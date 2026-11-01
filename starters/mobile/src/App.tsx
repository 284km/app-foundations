import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { notesApi, type Note } from './api-client';
const base = process.env.EXPO_PUBLIC_API_BASE_URL ?? (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://127.0.0.1:3000');
const api = notesApi(base);
export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setBusy(true); setError('');
    try { setNotes((await api.list()).items); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to load notes'); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function mutate(action: () => Promise<unknown>) {
    setBusy(true); setError('');
    try { await action(); setTitle(''); setEditing(null); await load(); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to save changes'); }
    finally { setBusy(false); }
  }
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Text style={styles.eyebrow}>APP FOUNDATIONS / LOCAL DEMO</Text>
    <Text accessibilityRole="header" style={styles.heading}>Notes</Text>
    <Text>Use synthetic data only. Configure the local Web starter API first.</Text>
    <Text style={styles.label}>{editing ? 'Edit note title' : 'New note title'}</Text>
    <TextInput accessibilityLabel="Note title" style={styles.input} value={title} onChangeText={setTitle} maxLength={200} editable={!busy} returnKeyType="done" />
    <Button title={editing ? 'Save note' : 'Add note'} disabled={busy || !title.trim()} onPress={() => void mutate(() => editing ? api.update(editing, title) : api.create(title))} />
    {editing && <Button title="Cancel edit" disabled={busy} onPress={() => { setEditing(null); setTitle(''); }} />}
    {busy && <ActivityIndicator accessibilityLabel="Loading notes" />}
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <FlatList data={notes} keyExtractor={note => note.id} refreshing={busy} onRefresh={() => void load()}
      keyboardShouldPersistTaps="handled" ListEmptyComponent={!busy && !error ? <Text>No notes yet.</Text> : undefined}
      renderItem={({ item }) => <View style={styles.note}><Text style={styles.noteTitle}>{item.title}</Text><View style={styles.actions}>
        <Button title="Edit" accessibilityLabel={`Edit ${item.title}`} disabled={busy} onPress={() => { setEditing(item.id); setTitle(item.title); }} />
        <Button title="Delete" accessibilityLabel={`Delete ${item.title}`} disabled={busy} onPress={() => void mutate(() => api.remove(item.id))} />
      </View></View>} />
    <Button title="Refresh notes" disabled={busy} onPress={() => void load()} />
    <Text style={styles.footer}>Development baseline. Authentication and offline synchronization are not included.</Text>
  </KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7f2' }, page: { flex: 1, padding: 24, gap: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 1, color: '#185b45' }, heading: { fontSize: 40, fontWeight: '700', color: '#18302b' },
  label: { fontWeight: '600' }, input: { borderWidth: 1, borderColor: '#788a80', borderRadius: 6, padding: 12, fontSize: 17, color: '#18302b', backgroundColor: '#fff' },
  note: { padding: 16, marginVertical: 6, backgroundColor: '#fff', borderRadius: 12 }, noteTitle: { fontSize: 18, color: '#18302b' },
  actions: { flexDirection: 'row', gap: 12 }, error: { color: '#9b2020' }, footer: { fontSize: 12, color: '#394a40' },
});
