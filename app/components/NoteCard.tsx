import Link from 'next/link';
import { Calendar, Hash } from 'lucide-react';
import { Note } from '@/app/types/note';
import { Card, CardHeader, CardContent, CardFooter } from '@/app/components/ui/Card';
import { formatDate } from '@/app/utils/date';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const extractPreview = (body: string): string => {
    const cleaned = body
      .replace(/^#+ /gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*+] /gm, '')
      .replace(/^>\s*/gm, '')
      .trim();
    
    return cleaned.slice(0, 100) + (cleaned.length > 100 ? '...' : '');
  };

  const preview = extractPreview(note.body);

  return (
    <Link href={`/edit/${note.id}`}>
      <Card hover className="h-full">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {note.title || 'Untitled Note'}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-sm overflow-hidden" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const
          }}>
            {preview || 'No content'}
          </p>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(note.updatedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Hash className="w-3 h-3" />
              <span>{note.body.length} 文字</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}