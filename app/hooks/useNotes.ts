import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/app/types/note';
import { getNotes, saveNote, deleteNote, getNoteById } from '@/app/utils/storage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(() => {
    setIsLoading(true);
    try {
      const loadedNotes = getNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('ノートの読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初期ロード
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback((initialBody: string = '# 新しいノート\n\nここから書き始めてください...') => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      body: initialBody,
      updatedAt: Date.now()
    };
    saveNote(newNote);
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((note: Note) => {
    saveNote(note);
    setNotes(prev => prev.map(n => n.id === note.id ? note : n));
  }, []);

  const removeNote = useCallback((noteId: string) => {
    deleteNote(noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  const getNote = useCallback((noteId: string) => {
    return getNoteById(noteId);
  }, []);

  const searchNotes = useCallback((query: string) => {
    if (!query) return notes;
    
    const lowerQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.body.toLowerCase().includes(lowerQuery)
    );
  }, [notes]);

  return {
    notes,
    isLoading,
    loadNotes,
    createNote,
    updateNote,
    removeNote,
    getNote,
    searchNotes
  };
}

export function useNote(noteId: string | null) {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!noteId) {
      setNote(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loadedNote = getNoteById(noteId);
      setNote(loadedNote);
    } catch (error) {
      console.error('ノートの読み込みに失敗しました:', error);
      setNote(null);
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  const updateNote = useCallback((updatedNote: Note) => {
    saveNote(updatedNote);
    setNote(updatedNote);
  }, []);

  const removeNote = useCallback(() => {
    if (note) {
      deleteNote(note.id);
      setNote(null);
    }
  }, [note]);

  return {
    note,
    isLoading,
    updateNote,
    removeNote
  };
}