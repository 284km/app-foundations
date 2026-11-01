import postgres from 'postgres';
const state = globalThis as unknown as { notesSql?: ReturnType<typeof postgres> };
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return state.notesSql ??= postgres(url, { max: 5, idle_timeout: 20, connect_timeout: 5 });
}
export function asNote(row: Record<string, unknown>) {
  return { id: String(row.id), title: String(row.title), createdAt: new Date(row.created_at as string).toISOString(), updatedAt: new Date(row.updated_at as string).toISOString() };
}
