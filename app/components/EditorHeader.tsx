import Link from 'next/link';
import { ArrowLeft, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { IconButton } from '@/app/components/ui/IconButton';

interface EditorHeaderProps {
  title: string;
  isSaving: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
  onDelete: () => void;
}

export function EditorHeader({ 
  title, 
  isSaving, 
  showPreview, 
  onTogglePreview, 
  onDelete 
}: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <IconButton variant="ghost" className="text-gray-600 dark:text-gray-400">
              <ArrowLeft className="w-5 h-5" />
            </IconButton>
          </Link>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title || 'Untitled Note'}
            </h1>
            {isSaving && (
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                保存中...
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <IconButton
            onClick={onTogglePreview}
            title={showPreview ? 'プレビューを隠す' : 'プレビューを表示'}
            className="text-gray-600 dark:text-gray-400 sm:hidden"
          >
            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </IconButton>
          
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">削除</span>
          </Button>
        </div>
      </div>
    </header>
  );
}