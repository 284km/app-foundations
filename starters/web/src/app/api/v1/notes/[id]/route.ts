import { asNote, db } from '../../../../../server/db';
import { empty, handle, HttpError, idSchema, input, preflight, reply } from '../../../../../server/http';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
async function noteId(context: Context) {
  const parsed = idSchema.safeParse((await context.params).id);
  if (!parsed.success) throw new HttpError(400, 'Invalid note ID');
  return parsed.data;
}
export function OPTIONS(request: Request) { return preflight(request); }
export function GET(request: Request, context: Context) {
  return handle(request, async () => {
    const id = await noteId(context);
    const rows = await db()`SELECT * FROM notes WHERE id = ${id}`;
    if (!rows.length) throw new HttpError(404, 'Note not found');
    return reply(request, asNote(rows[0]));
  });
}
export function PATCH(request: Request, context: Context) {
  return handle(request, async () => {
    const id = await noteId(context); const { title } = await input(request);
    const rows = await db()`UPDATE notes SET title = ${title}, updated_at = now() WHERE id = ${id} RETURNING *`;
    if (!rows.length) throw new HttpError(404, 'Note not found');
    return reply(request, asNote(rows[0]));
  });
}
export function DELETE(request: Request, context: Context) {
  return handle(request, async () => {
    const id = await noteId(context);
    const rows = await db()`DELETE FROM notes WHERE id = ${id} RETURNING id`;
    if (!rows.length) throw new HttpError(404, 'Note not found');
    return empty(request);
  });
}
