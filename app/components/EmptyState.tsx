import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface EmptyStateProps {
  searchQuery?: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="text-center py-12 animate-fade-in">
      <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {searchQuery ? '検索結果がありません' : 'ノートがありません'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {searchQuery
          ? '別のキーワードで検索してみてください'
          : '最初のノートを作成してみましょう'}
      </p>
      {!searchQuery && (
        <Link href="/edit/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            新規ノートを作成
          </Button>
        </Link>
      )}
    </div>
  );
}