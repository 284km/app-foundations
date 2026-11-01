import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp, root, starters } from '../scripts/create-app.mjs';

test('exports are independent and contain contract, provenance, license and lockfile', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'foundations-test-'));
  for (const starter of starters) {
    const dest = await createApp(starter, join(dir, starter));
    const provenance = JSON.parse(await readFile(join(dest, '.app-foundations.json')));
    assert.equal(provenance.starter, starter);
    assert.equal(provenance.repository, 'https://github.com/284km/app-foundations');
    const spec = JSON.parse(await readFile(join(dest, 'contracts/openapi.json')));
    assert.equal(spec.info.version, '1.0.0');
    assert.match(await readFile(join(dest, 'LICENSE'), 'utf8'), /MIT License/);
    await assert.rejects(readFile(join(dest, '.env')));
    await assert.rejects(readFile(join(dest, 'node_modules/package.json')));
    assert.match(await readFile(join(dest, '.github/workflows/ci.yml'), 'utf8'), /Application CI/);
    const pkg = JSON.parse(await readFile(join(dest, 'package.json')));
    assert(!JSON.stringify(pkg).includes('workspace:'));
    const lock = JSON.parse(await readFile(join(dest, 'package-lock.json')));
    assert.equal(lock.name, pkg.name);
  }
});
test('export refuses existing directories, invalid starters and source-tree destinations', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'foundations-guard-'));
  await writeFile(join(dir, 'keep.txt'), 'preserve');
  await assert.rejects(createApp('web', dir));
  assert.equal(await readFile(join(dir, 'keep.txt'), 'utf8'), 'preserve');
  await assert.rejects(createApp('../web', join(dir, 'invalid')));
  await assert.rejects(createApp('web', join(root, 'accidental-output')));
  await assert.rejects(createApp('web', join(root, '..hidden-output')));
});
