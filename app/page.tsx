'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Note } from '@/app/types/note';
import { getNotes } from '@/app/utils/storage';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // クライアントサイドでのみ実行
    setNotes(getNotes());
  }, []);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Markdown Notes</h1>
          <Link
            href="/edit/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((note) => (
                <Link
                  key={note.id}
                  href={`/edit/${note.id}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {note.title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {note.body.slice(0, 100)}...
                  </p>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
