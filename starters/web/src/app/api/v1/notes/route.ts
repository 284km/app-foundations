import { randomUUID } from 'node:crypto';
import { asNote, db } from '../../../../server/db';
import { handle, input, preflight, reply } from '../../../../server/http';
export const runtime = 'nodejs';
export function OPTIONS(request: Request) { return preflight(request); }
export function GET(request: Request) {
  return handle(request, async () => {
    const rows = await db()`SELECT * FROM notes ORDER BY created_at DESC, id DESC LIMIT 100`;
    return reply(request, { items: rows.map(asNote) });
  });
}
export function POST(request: Request) {
  return handle(request, async () => {
    const { title } = await input(request);
    const rows = await db()`INSERT INTO notes (id, title) VALUES (${randomUUID()}, ${title}) RETURNING *`;
    return reply(request, asNote(rows[0]), 201);
  });
}
