import type { components } from './generated/api';
export type Note = components['schemas']['Note'];
type NoteList = components['schemas']['NoteList'];
export function notesApi(baseUrl: string) {
  const base = baseUrl.replace(/\/$/, '');
  async function request<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${base}/api/v1/notes${path}`, {
        method, signal: controller.signal,
        headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
        ...(data === undefined ? {} : { body: JSON.stringify(data) }),
      });
      if (!response.ok) {
        const problem: unknown = await response.json().catch(() => null);
        const title = problem && typeof problem === 'object' && 'title' in problem && typeof problem.title === 'string' ? problem.title : 'Request failed';
        throw new Error(`${title} (${response.status})`);
      }
      return response.status === 204 ? undefined as T : await response.json() as T;
    } finally { clearTimeout(timer); }
  }
  return {
    list: () => request<NoteList>(''),
    create: (title: string) => request<Note>('', 'POST', { title }),
    update: (id: string, title: string) => request<Note>(`/${encodeURIComponent(id)}`, 'PATCH', { title }),
    remove: (id: string) => request<void>(`/${encodeURIComponent(id)}`, 'DELETE'),
  };
}
