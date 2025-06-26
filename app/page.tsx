'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Moon, Sun, FileText, Calendar, Hash } from 'lucide-react';
import { Note } from '@/app/types/note';
import { getNotes } from '@/app/utils/storage';
import { useThemeContext } from '@/app/providers/ThemeProvider';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useThemeContext();

  useEffect(() => {
    // クライアントサイドでのみ実行
    setNotes(getNotes());
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '昨日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const extractPreview = (body: string): string => {
    // Markdownの記号を除去してプレビューテキストを生成
    const cleaned = body
      .replace(/^#+ /gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*+] /gm, '')
      .replace(/^>\s*/gm, '')
      .trim();
    
    return cleaned.slice(0, 150) + (cleaned.length > 150 ? '...' : '');
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.body.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Markdown Notes
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <Link
                href="/edit/new"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">新規ノート</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 検索バー */}
        <div className="mb-8 animate-fade-in">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ノートを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all shadow-sm"
            />
          </div>
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
          <div className="text-center py-16 animate-fade-in">
            <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? '検索結果が見つかりませんでした' : 'まだノートがありません'}
            </p>
            {!searchQuery && (
              <Link
                href="/edit/new"
                className="inline-flex items-center space-x-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>最初のノートを作成</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((note, index) => (
                <Link
                  key={note.id}
                  href={`/edit/${note.id}`}
                  className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                           hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                           border border-gray-100 dark:border-gray-700 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white 
                                 group-hover:text-blue-600 dark:group-hover:text-blue-400 
                                 transition-colors line-clamp-2">
                      {note.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {extractPreview(note.body)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Hash className="w-4 h-4" />
                      <span>{note.body.length} 文字</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
