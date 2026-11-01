import { readFile } from 'node:fs/promises';
import postgres from 'postgres';
const url = process.env.DATABASE_URL;
if (!url) throw new Error('Set DATABASE_URL using the local .env.example.');
const sql = postgres(url, { max: 1 });
try { await sql.unsafe(await readFile(new URL('../db/001-notes.sql', import.meta.url), 'utf8')); }
finally { await sql.end(); }
console.log('Applied local notes schema. Add versioned migrations before evolving a real application.');
