import { createRoot } from 'react-dom/client';
import { invoke } from '@tauri-apps/api/core';
import { NotesView } from './NotesView';
import './styles.css';
createRoot(document.getElementById('root')!).render(<NotesView
  baseUrl={import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000'}
  onExport={async notes => { await invoke('export_notes', { notesJson: JSON.stringify(notes, null, 2) }); }}
/>);
