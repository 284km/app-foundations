import { z } from 'zod';
export const inputSchema = z.object({ title: z.string().trim().refine(value => [...value].length >= 1 && [...value].length <= 200) }).strict();
export const idSchema = z.uuid();
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
function headers(request: Request) {
  const result = new Headers({ 'Cache-Control': 'no-store', Vary: 'Origin' });
  const origin = request.headers.get('Origin');
  const allowed = (process.env.DEMO_ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim());
  if (origin && (origin === new URL(request.url).origin || allowed.includes(origin))) {
    result.set('Access-Control-Allow-Origin', origin);
    result.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    result.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  return result;
}
export function problem(request: Request, status: number, title: string) {
  const h = headers(request); h.set('Content-Type', 'application/problem+json');
  return Response.json({ type: 'about:blank', title, status }, { status, headers: h });
}
export function reply(request: Request, data: unknown, status = 200) {
  return Response.json(data, { status, headers: headers(request) });
}
export function empty(request: Request) { return new Response(null, { status: 204, headers: headers(request) }); }
export function preflight(request: Request) { return guard(request) ?? empty(request); }
export function guard(request: Request): Response | null {
  // Explicit local demo opt-in. Adding real auth/authz is required before production.
  if (process.env.NODE_ENV === 'production' || process.env.DEMO_API_ENABLED !== 'true') return problem(request, 503, 'Local demo API is disabled');
  const origin = request.headers.get('Origin');
  const allowed = (process.env.DEMO_ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim());
  if (origin && origin !== new URL(request.url).origin && !allowed.includes(origin)) return problem(request, 403, 'Origin is not allowed');
  return null;
}
export async function input(request: Request) {
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Use application/json');
  if (Number(request.headers.get('Content-Length') ?? 0) > 4096) throw new HttpError(413, 'Request is too large');
  // Limit the streamed body as well; Content-Length is supplied by the caller.
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'A JSON body is required');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new HttpError(413, 'Request is too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const buffer = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
  let value: unknown;
  try { value = JSON.parse(new TextDecoder().decode(buffer)); } catch { throw new HttpError(400, 'Invalid JSON'); }
  const parsed = inputSchema.safeParse(value);
  if (!parsed.success) throw new HttpError(400, 'Title must contain 1 to 200 characters; unknown fields are rejected');
  return parsed.data;
}
export async function handle(request: Request, action: () => Promise<Response>) {
  const denied = guard(request); if (denied) return denied;
  try { return await action(); }
  catch (error) {
    // Never return database errors, credentials, stack traces, or request bodies.
    return error instanceof HttpError ? problem(request, error.status, error.message) : problem(request, 500, 'Unable to complete the request');
  }
}
