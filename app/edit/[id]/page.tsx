'use client';

import { useState, useEffect, use, useDeferredValue } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '@/app/types/note';
import { getNoteById, saveNote, deleteNote, extractTitle } from '@/app/utils/storage';
import { useDebounce } from '@/app/hooks/useDebounce';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [noteId, setNoteId] = useState<string>('');
  
  // パフォーマンス最適化のためプレビューの更新を遅延
  const deferredBody = useDeferredValue(body);
  // 自動保存のためのデバウンス
  const debouncedBody = useDebounce(body, 500);

  useEffect(() => {
    // 初期ロード
    if (id === 'new') {
      const newId = uuidv4();
      setNoteId(newId);
      setBody('# New Note\n\nStart writing...');
      setIsLoading(false);
    } else {
      const note = getNoteById(id);
      if (note) {
        setNoteId(note.id);
        setBody(note.body);
      } else {
        // ノートが見つからない場合は一覧へ
        router.push('/');
      }
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    // デバウンスされた自動保存
    if (!isLoading && noteId && debouncedBody) {
      const note: Note = {
        id: noteId,
        title: extractTitle(debouncedBody),
        body: debouncedBody,
        updatedAt: Date.now(),
      };
      saveNote(note);
    }
  }, [debouncedBody, noteId, isLoading]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      if (noteId) {
        deleteNote(noteId);
        router.push('/');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to List
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* エディタペイン */}
        <div className="w-1/2 p-4 bg-gray-100">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 
                     font-mono text-sm resize-none focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your markdown here..."
          />
        </div>

        {/* プレビューペイン */}
        <div className="w-1/2 p-4 bg-white overflow-auto">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{deferredBody}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}