'use client';
import { useCallback, useEffect, useState } from 'react';
import { notesApi, type Note } from './api-client';
export function NotesView({ baseUrl, onExport }: { baseUrl: string; onExport?: (notes: Note[]) => Promise<void> }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const load = useCallback(async () => {
    setBusy(true); setError('');
    try { setNotes((await notesApi(baseUrl).list()).items); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to load notes'); }
    finally { setBusy(false); }
  }, [baseUrl]);
  useEffect(() => { void load(); }, [load]);
  async function mutate(action: () => Promise<unknown>, message: string) {
    setBusy(true); setError(''); setStatus('');
    try { await action(); setTitle(''); setEditing(null); await load(); setStatus(message); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to save changes'); }
    finally { setBusy(false); }
  }
  return <main>
    <p className="eyebrow">APP FOUNDATIONS / LOCAL DEMO</p>
    <h1>Notes</h1>
    <p>A small REST API example. Use synthetic data only.</p>
    <form onSubmit={event => {
      event.preventDefault();
      if (!title.trim() || busy) return;
      void mutate(() => editing ? notesApi(baseUrl).update(editing, title) : notesApi(baseUrl).create(title), editing ? 'Note updated.' : 'Note added.');
    }}>
      <label htmlFor="title">{editing ? 'Edit note title' : 'New note title'}</label>
      <div className="row"><input id="title" value={title} onChange={event => setTitle(event.target.value)} maxLength={200} required disabled={busy} />
      <button disabled={busy || !title.trim()}>{editing ? 'Save' : 'Add note'}</button></div>
      {editing && <button type="button" disabled={busy} onClick={() => { setEditing(null); setTitle(''); }}>Cancel edit</button>}
    </form>
    {error && <p role="alert">{error}. Check the local API and database configuration.</p>}
    <p role="status" aria-live="polite">{busy ? 'Loading…' : status}</p>
    {!busy && !error && !notes.length && <p>No notes yet. Add your first note above.</p>}
    <ul>{notes.map(note => <li key={note.id}>
      <span>{note.title}</span><div className="row">
        <button type="button" disabled={busy} aria-label={`Edit ${note.title}`} onClick={() => { setEditing(note.id); setTitle(note.title); }}>Edit</button>
        <button type="button" disabled={busy} aria-label={`Delete ${note.title}`} onClick={() => void mutate(() => notesApi(baseUrl).remove(note.id), 'Note deleted.')}>Delete</button>
      </div>
    </li>)}</ul>
    <div className="row"><button type="button" disabled={busy} onClick={() => void load()}>Refresh</button>
    {onExport && <button type="button" disabled={busy} onClick={async () => {
      try { await onExport(notes); setStatus('Exported notes to the application data directory.'); }
      catch { setError('Unable to export notes'); }
    }}>Export JSON locally</button>}</div>
    <footer>Development baseline · Authentication and offline synchronization are not included.</footer>
  </main>;
}
