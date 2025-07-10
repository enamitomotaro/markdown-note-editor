import { Note } from '@/app/types/note';

const STORAGE_KEY = 'markdown-notes';

// メモリ内キャッシュ
let notesCache: Note[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5000; // 5秒間キャッシュ

export const getNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  
  // キャッシュが有効な場合はキャッシュから返す
  const now = Date.now();
  if (notesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return notesCache;
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  notesCache = stored ? JSON.parse(stored) : [];
  cacheTimestamp = now;
  return notesCache as Note[];
};

export const saveNotes = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  // キャッシュを更新
  notesCache = notes;
  cacheTimestamp = Date.now();
};

// キャッシュをクリアする関数
export const clearNotesCache = (): void => {
  notesCache = null;
  cacheTimestamp = 0;
};

export const getNoteById = (id: string): Note | null => {
  const notes = getNotes();
  return notes.find(note => note.id === id) || null;
};

export const saveNote = (note: Note): void => {
  const notes = getNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }
  
  saveNotes(notes);
};

export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filtered = notes.filter(note => note.id !== id);
  saveNotes(filtered);
};

export const extractTitle = (body: string): string => {
  // 先頭のH1を探す
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // H1がなければ最初の非空白行
  const firstLine = body.split('\n').find(line => line.trim());
  if (firstLine) {
    return firstLine.trim().slice(0, 50) + (firstLine.length > 50 ? '...' : '');
  }
  
  return 'Untitled Note';
};