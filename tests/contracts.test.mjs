import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, starters } from '../scripts/create-app.mjs';
test('independent starters use the same contract, generated declarations and shared client', async () => {
  const canonical = await readFile(join(root, 'contracts/openapi.json'), 'utf8');
  const types = await readFile(join(root, 'starters/web/src/generated/api.ts'), 'utf8');
  const client = await readFile(join(root, 'starters/web/src/api-client.ts'), 'utf8');
  for (const starter of starters) {
    assert.equal(await readFile(join(root, 'starters', starter, 'contracts/openapi.json'), 'utf8'), canonical);
    assert.equal(await readFile(join(root, 'starters', starter, 'src/generated/api.ts'), 'utf8'), types);
    assert.equal(await readFile(join(root, 'starters', starter, 'src/api-client.ts'), 'utf8'), client);
  }
});
