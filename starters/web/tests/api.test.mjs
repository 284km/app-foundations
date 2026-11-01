import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
const spec = JSON.parse(await readFile(new URL('../contracts/openapi.json', import.meta.url)));
const ajv = new Ajv2020({ strict: false });
addFormats(ajv);
ajv.addSchema({ $id: 'urn:foundations:api', components: spec.components });
const validateNote = ajv.compile({ $ref: 'urn:foundations:api#/components/schemas/Note' });
const validateList = ajv.compile({ $ref: 'urn:foundations:api#/components/schemas/NoteList' });
const validateProblem = ajv.compile({ $ref: 'urn:foundations:api#/components/schemas/Problem' });
const base = process.env.TEST_API_URL ?? 'http://127.0.0.1:3000';
// Never aim destructive integration checks at arbitrary external infrastructure.
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Tests require a loopback API.');
const url = `${base}/api/v1/notes`;
async function call(path = '', method = 'GET', body, headers = {}) {
  return fetch(url + path, { method, headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
test('CRUD persists a synthetic note; invalid inputs and origins are rejected', async () => {
  let id;
  try {
    const created = await call('', 'POST', { title: `Synthetic test ${randomUUID()}` });
    assert.equal(created.status, 201);
    const note = await created.json(); id = note.id;
    assert(validateNote(note), ajv.errorsText(validateNote.errors));
    assert.match(id, /^[a-f0-9-]{36}$/);
    assert.equal(Number.isNaN(Date.parse(note.createdAt)), false);
    const read = await call(`/${id}`); assert.equal(read.status, 200);
    assert.deepEqual(await read.json(), note);
    const listed = await (await call()).json(); assert(validateList(listed), ajv.errorsText(validateList.errors)); assert(listed.items.some(n => n.id === id));
    const updated = await call(`/${id}`, 'PATCH', { title: 'Updated synthetic note' });
    assert.equal(updated.status, 200); assert.equal((await updated.json()).title, 'Updated synthetic note');
    for (const body of [{ title: '' }, { title: 'x'.repeat(201) }, { title: 'ok', unexpected: true }]) {
      const invalid = await call('', 'POST', body); assert.equal(invalid.status, 400);
      assert.match(invalid.headers.get('Content-Type'), /application\/problem\+json/);
      assert(validateProblem(await invalid.json()), ajv.errorsText(validateProblem.errors));
    }
    assert.equal((await call('/invalid')).status, 400);
    assert.equal((await call(`/${randomUUID()}`)).status, 404);
    assert.equal((await call('', 'POST', { title: 'blocked' }, { Origin: 'https://example.org' })).status, 403);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'text' })).status, 415);
    assert.equal((await call('', 'POST', { title: 'x'.repeat(5000) })).status, 413);
    const preflight = await call('', 'OPTIONS', undefined, { Origin: 'http://localhost:1420', 'Access-Control-Request-Method': 'POST' });
    assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), 'http://localhost:1420');
    assert.equal((await call(`/${id}`, 'DELETE')).status, 204);
    assert.equal((await call(`/${id}`)).status, 404); id = undefined;
  } finally { if (id) await call(`/${id}`, 'DELETE'); }
});
