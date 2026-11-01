import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';
import { parse } from 'yaml';
import { root, starters } from './create-app.mjs';

export function checkNodeManifest(label, manifest, lock, nodeMajor) {
  const runtime = manifest.engines?.node;
  const target = `${nodeMajor}.x`;
  if (!runtime || !semver.validRange(runtime) || !semver.subset(runtime, target) || !semver.intersects(runtime, target)) {
    throw new Error(`${label}: engines.node must stay within Node ${nodeMajor}.x`);
  }
  const requested = manifest.devDependencies?.['@types/node'] ?? manifest.dependencies?.['@types/node'];
  if (requested === undefined) return;
  if (!semver.valid(requested) || semver.major(requested) !== nodeMajor) {
    throw new Error(`${label}: @types/node must be pinned to the Node ${nodeMajor} declaration line`);
  }
  const locked = lock.packages?.['node_modules/@types/node']?.version;
  const lockedRequest = lock.packages?.['']?.devDependencies?.['@types/node'] ?? lock.packages?.['']?.dependencies?.['@types/node'];
  if (locked !== requested || lockedRequest !== requested) {
    throw new Error(`${label}: @types/node manifest and lockfile must agree`);
  }
}

export function npmEntry(config, directory) {
  const entries = config.updates.filter(entry => entry['package-ecosystem'] === 'npm' && (entry.directories ?? [entry.directory]).includes(directory));
  if (entries.length !== 1) throw new Error(`${directory}: expected exactly one npm update entry`);
  return entries[0];
}
export function ignoredRange(entry, dependency) {
  const versions = (entry.ignore ?? []).filter(rule => rule['dependency-name'] === dependency).flatMap(rule => rule.versions ?? []);
  if (!versions.length || versions.some(version => !semver.validRange(version))) {
    throw new Error(`${dependency}: explicit valid ignore ranges are required`);
  }
  return versions.join(' || ');
}
function guardRange(entry, name, allowed, blocked) {
  const ignored = ignoredRange(entry, name);
  if (semver.intersects(allowed, ignored) || !semver.subset(blocked, ignored)) {
    throw new Error(`${name}: update policy must allow ${allowed} and ignore ${blocked}`);
  }
}
export function checkUpdatePolicy(config, nodeMajor, mobile) {
  if (config.version !== 2 || !Array.isArray(config.updates)) throw new Error('Expected Dependabot configuration version 2');
  const directories = ['/', ...starters.map(starter => `/starters/${starter}`)];
  for (const directory of directories) {
    guardRange(npmEntry(config, directory), '@types/node', `${nodeMajor}.x`, `>=${nodeMajor + 1}.0.0`);
  }
  const entry = npmEntry(config, '/starters/mobile');
  const scopes = entry.directories ?? [entry.directory];
  if (scopes.length !== 1 || scopes[0] !== '/starters/mobile') throw new Error('Expo update policy must be scoped to mobile only');
  for (const name of ['react', 'react-native']) {
    const version = mobile.dependencies[name];
    if (!semver.valid(version)) throw new Error(`Mobile ${name} must have an exact supported version`);
    guardRange(entry, name, version, `>${version}`);
  }
  // If a Web renderer is added to mobile, it must track the same supported React version.
  guardRange(entry, 'react-dom', mobile.dependencies.react, `>${mobile.dependencies.react}`);
  const compiler = mobile.devDependencies.typescript;
  if (!semver.valid(compiler)) throw new Error('Mobile TypeScript must have an exact supported version');
  guardRange(entry, 'typescript', `${semver.major(compiler)}.${semver.minor(compiler)}.x`, `>=${semver.major(compiler)}.${semver.minor(compiler) + 1}.0`);
}

export function checkWorkflowRuntime(label, workflow, nodeMajor) {
  const setups = Object.values(workflow.jobs ?? {}).flatMap(job => job.steps ?? []).filter(step => step.uses?.startsWith('actions/setup-node@'));
  if (!setups.length || setups.some(step => String(step.with?.['node-version']) !== String(nodeMajor))) {
    throw new Error(`${label}: setup-node must select the Node ${nodeMajor} baseline`);
  }
}

export async function checkRepository(directory = root) {
  const nodeText = (await readFile(join(directory, '.nvmrc'), 'utf8')).trim();
  if (!/^\d+$/.test(nodeText)) throw new Error('The root .nvmrc must pin a Node major');
  const nodeMajor = Number(nodeText);
  for (const local of ['', ...starters.map(starter => `starters/${starter}`)]) {
    const [manifest, lock, version] = await Promise.all([
      readFile(join(directory, local, 'package.json'), 'utf8').then(JSON.parse),
      readFile(join(directory, local, 'package-lock.json'), 'utf8').then(JSON.parse),
      readFile(join(directory, local, '.nvmrc'), 'utf8'),
    ]);
    if (version.trim() !== nodeText) throw new Error(`${local || 'root'}: .nvmrc differs from the root runtime baseline`);
    checkNodeManifest(local || 'root', manifest, lock, nodeMajor);
  }
  const config = parse(await readFile(join(directory, '.github/dependabot.yml'), 'utf8'));
  const mobile = JSON.parse(await readFile(join(directory, 'starters/mobile/package.json'), 'utf8'));
  checkUpdatePolicy(config, nodeMajor, mobile);
  for (const local of ['.github/workflows/validate.yml', ...starters.map(starter => `starters/${starter}/.github/workflows/ci.yml`)]) {
    checkWorkflowRuntime(local, parse(await readFile(join(directory, local), 'utf8')), nodeMajor);
  }
  return nodeMajor;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Dependency compatibility policy passed for Node ${await checkRepository()} and the scoped Expo toolchain. Run expo install --check for SDK validation.`);
}
