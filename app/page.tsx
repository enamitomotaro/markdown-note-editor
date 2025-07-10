'use client';

import { useState, useMemo } from 'react';
import { useNotes } from '@/app/hooks/useNotes';
import { Header } from '@/app/components/Header';
import { SearchBar } from '@/app/components/SearchBar';
import { NoteCard } from '@/app/components/NoteCard';
import { EmptyState } from '@/app/components/EmptyState';

export default function Home() {
  const { notes, isLoading } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.body.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 検索バー */}
        <div className="mb-8 animate-fade-in">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* ノート統計 */}
        <div className="mb-6 text-center text-gray-600 dark:text-gray-400 animate-slide-up">
          <p className="text-sm">
            {filteredNotes.length} 件のノート
            {searchQuery && ` (「${searchQuery}」の検索結果)`}
          </p>
        </div>

        {/* ノート一覧 */}
        {filteredNotes.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((note, index) => (
                <div 
                  key={note.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NoteCard note={note} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
