'use client';

import { useState, useEffect, use, useDeferredValue, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Trash2, Eye, EyeOff, 
  Bold, Italic, Link2, ListOrdered, ListIcon,
  Code, Quote, Hash, Moon, Sun
} from 'lucide-react';
import { Note } from '@/app/types/note';
import { getNoteById, saveNote, deleteNote, extractTitle } from '@/app/utils/storage';
import { useDebounce } from '@/app/hooks/useDebounce';
import { useKeyboardShortcuts } from '@/app/hooks/useKeyboardShortcuts';
import { useThemeContext } from '@/app/providers/ThemeProvider';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [noteId, setNoteId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme, toggleTheme } = useThemeContext();
  
  // パフォーマンス最適化のためプレビューの更新を遅延
  const deferredBody = useDeferredValue(body);
  // 自動保存のためのデバウンス
  const debouncedBody = useDebounce(body, 500);

  // エディタヘルパー関数
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const newText = body.substring(0, start) + before + selectedText + after + body.substring(end);
    
    setBody(newText);
    
    // カーソル位置を調整
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  };

  // キーボードショートカット
  useKeyboardShortcuts([
    { key: 's', ctrlKey: true, callback: () => toast.success('自動保存されています') },
    { key: 'b', ctrlKey: true, callback: () => insertMarkdown('**', '**') },
    { key: 'i', ctrlKey: true, callback: () => insertMarkdown('*', '*') },
    { key: 'k', ctrlKey: true, callback: () => insertMarkdown('[', '](url)') },
    { key: 'p', ctrlKey: true, callback: () => setShowPreview(!showPreview) },
  ]);

  useEffect(() => {
    // 初期ロード
    if (id === 'new') {
      const newId = uuidv4();
      setNoteId(newId);
      setBody('# 新しいノート\n\nここから書き始めてください...');
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
      setIsSaving(true);
      const note: Note = {
        id: noteId,
        title: extractTitle(debouncedBody),
        body: debouncedBody,
        updatedAt: Date.now(),
      };
      saveNote(note);
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [debouncedBody, noteId, isLoading]);

  const handleDelete = () => {
    if (confirm('このノートを削除してもよろしいですか？')) {
      if (noteId) {
        deleteNote(noteId);
        toast.success('ノートを削除しました');
        router.push('/');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                         hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">一覧に戻る</span>
              </Link>
              
              {isSaving && (
                <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  保存中...
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="テーマ切替"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {showPreview ? (
                  <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="hidden lg:inline text-sm text-gray-600 dark:text-gray-400">
                  プレビュー
                </span>
              </button>
              
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white 
                         rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">削除</span>
              </button>
            </div>
          </div>

          {/* ツールバー */}
          <div className="flex items-center space-x-1 mt-2 pb-2 overflow-x-auto">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="太字 (Ctrl+B)"
            >
              <Bold className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="斜体 (Ctrl+I)"
            >
              <Italic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => insertMarkdown('# ')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="見出し"
            >
              <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => insertMarkdown('[', '](url)')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="リンク (Ctrl+K)"
            >
              <Link2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => insertMarkdown('- ')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="箇条書き"
            >
              <ListIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => insertMarkdown('1. ')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="番号付きリスト"
            >
              <ListOrdered className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => insertMarkdown('`', '`')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="インラインコード"
            >
              <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => insertMarkdown('> ')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="引用"
            >
              <Quote className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <div className={`flex h-[calc(100vh-120px)] ${!showPreview ? 'justify-center' : ''}`}>
        {/* エディタペイン */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full max-w-4xl'} p-4`}>
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-full p-6 bg-transparent text-gray-900 dark:text-white
                       font-mono text-sm resize-none focus:outline-none"
              placeholder="Markdownで書き始めてください..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* プレビューペイン */}
        {showPreview && (
          <div className="w-1/2 p-4 overflow-auto animate-slide-in-right">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-full">
              <div className="prose prose-lg dark:prose-invert max-w-none
                           prose-headings:text-gray-900 dark:prose-headings:text-white
                           prose-p:text-gray-700 dark:prose-p:text-gray-300
                           prose-a:text-blue-600 dark:prose-a:text-blue-400
                           prose-code:text-pink-600 dark:prose-code:text-pink-400
                           prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                           prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600">
                <ReactMarkdown>{deferredBody}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ショートカットヘルプ */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 
                    bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm
                    border border-gray-200 dark:border-gray-700 hidden lg:block">
        <div className="space-y-1">
          <div>Ctrl+B: 太字</div>
          <div>Ctrl+I: 斜体</div>
          <div>Ctrl+K: リンク</div>
          <div>Ctrl+P: プレビュー切替</div>
        </div>
      </div>
    </div>
  );
}