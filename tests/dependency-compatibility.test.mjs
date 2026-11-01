import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import semver from 'semver';
import { parse } from 'yaml';
import { root } from '../scripts/create-app.mjs';
import { checkRepository, checkNodeManifest, checkUpdatePolicy, checkWorkflowRuntime, npmEntry, ignoredRange } from '../scripts/check-dependency-compatibility.mjs';
const config = parse(await readFile(join(root, '.github/dependabot.yml'), 'utf8'));
const mobile = JSON.parse(await readFile(join(root, 'starters/mobile/package.json'), 'utf8'));
const ignored = (directory, name, candidate) => semver.satisfies(candidate, ignoredRange(npmEntry(config, directory), name));

test('the current manifests, lockfiles, runtime pins and update policy agree', async () => {
  assert.equal(await checkRepository(), 24);
});
for (const directory of ['web', 'desktop']) {
  test(`reject the Node 26 declaration regression in ${directory}`, () => {
    const manifest = { engines: { node: '>=24 <25' }, devDependencies: { '@types/node': '26.6.6' } };
    const lock = { packages: { '': { devDependencies: { '@types/node': '26.6.6' } }, 'node_modules/@types/node': { version: '26.6.6' } } };
    assert.throws(() => checkNodeManifest(directory, manifest, lock, 24), /Node 24 declaration line/);
  });
}
test('allow a compatible Node type patch but reject a stale or tampered lockfile', () => {
  const manifest = { engines: { node: '>=24 <25' }, devDependencies: { '@types/node': '24.19.3' } };
  const lock = { packages: { '': { devDependencies: { '@types/node': '24.19.3' } }, 'node_modules/@types/node': { version: '24.19.3' } } };
  assert.doesNotThrow(() => checkNodeManifest('fixture', manifest, lock, 24));
  lock.packages['node_modules/@types/node'].version = '26.6.6';
  assert.throws(() => checkNodeManifest('fixture', manifest, lock, 24), /manifest and lockfile/);
});
test('reject a runtime constraint that silently widens the supported Node major', () => {
  assert.throws(() => checkNodeManifest('fixture', { engines: { node: '>=24 <27' } }, {}, 24), /engines.node/);
});
test('Dependabot ranges filter the four reviewed incompatible proposals', () => {
  assert(ignored('/starters/mobile', 'react', '19.3.1'));
  assert(ignored('/starters/mobile', 'typescript', '7.0.2'));
  assert(ignored('/starters/web', '@types/node', '26.6.6'));
  assert(ignored('/starters/desktop', '@types/node', '26.6.6'));
});
test('compatible patch lines and independent platform upgrades remain available', () => {
  assert(!ignored('/starters/mobile', 'typescript', '6.0.4'));
  for (const directory of ['/starters/web', '/starters/desktop']) {
    assert(!ignored(directory, '@types/node', '24.19.3'));
    const entry = npmEntry(config, directory);
    assert(!(entry.ignore ?? []).some(rule => ['react', 'typescript'].includes(rule['dependency-name'])));
  }
  assert(!(npmEntry(config, '/starters/mobile').ignore ?? []).some(rule => rule['dependency-name'] === 'expo'));
});
test('a missing Node cap is detected before the bot can propose another runtime mismatch', () => {
  const changed = structuredClone(config);
  npmEntry(changed, '/starters/web').ignore = [];
  assert.throws(() => checkUpdatePolicy(changed, 24, mobile), /@types\/node/);
});
test('an SDK migration requires revisiting the old React and compiler caps', () => {
  const changed = structuredClone(mobile);
  changed.dependencies.react = '19.4.0';
  assert.throws(() => checkUpdatePolicy(config, 24, changed), /react: update policy/);
  changed.dependencies.react = mobile.dependencies.react;
  changed.devDependencies.typescript = '7.0.2';
  assert.throws(() => checkUpdatePolicy(config, 24, changed), /typescript: update policy/);
});
test('overlapping npm scopes cannot accidentally apply mobile rules to another starter', () => {
  const changed = structuredClone(config);
  changed.updates.push(structuredClone(npmEntry(config, '/starters/mobile')));
  assert.throws(() => checkUpdatePolicy(changed, 24, mobile), /exactly one npm update entry/);
});

test('repository and exported workflows cannot silently change the tested Node runtime', () => {
  const workflow = { jobs: { test: { steps: [{ uses: 'actions/setup-node@reviewed-commit', with: { 'node-version': '24' } }] } } };
  assert.doesNotThrow(() => checkWorkflowRuntime('fixture', workflow, 24));
  workflow.jobs.test.steps[0].with['node-version'] = '26';
  assert.throws(() => checkWorkflowRuntime('fixture', workflow, 24), /setup-node must select/);
});
