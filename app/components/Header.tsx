import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Markdown Notes
            </h1>
          </div>
          
          <Link href="/edit/new">
            <Button variant="primary" className="shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">新規ノート</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}