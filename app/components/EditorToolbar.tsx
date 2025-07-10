import { Bold, Italic, Link2, ListOrdered, ListIcon, Code, Quote, Hash } from 'lucide-react';
import { IconButton } from '@/app/components/ui/IconButton';

interface EditorToolbarProps {
  onInsertMarkdown: (before: string, after?: string) => void;
}

export function EditorToolbar({ onInsertMarkdown }: EditorToolbarProps) {
  const tools = [
    { icon: Bold, label: '太字', onClick: () => onInsertMarkdown('**', '**') },
    { icon: Italic, label: '斜体', onClick: () => onInsertMarkdown('*', '*') },
    { icon: Link2, label: 'リンク', onClick: () => onInsertMarkdown('[', '](url)') },
    { icon: ListOrdered, label: '番号付きリスト', onClick: () => onInsertMarkdown('1. ') },
    { icon: ListIcon, label: '箇条書き', onClick: () => onInsertMarkdown('- ') },
    { icon: Code, label: 'コード', onClick: () => onInsertMarkdown('`', '`') },
    { icon: Quote, label: '引用', onClick: () => onInsertMarkdown('> ') },
    { icon: Hash, label: '見出し', onClick: () => onInsertMarkdown('## ') },
  ];

  return (
    <div className="flex items-center space-x-1 p-2 border-b border-gray-200 dark:border-gray-700">
      {tools.map((tool, index) => (
        <IconButton
          key={index}
          onClick={tool.onClick}
          title={tool.label}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <tool.icon className="w-4 h-4" />
        </IconButton>
      ))}
    </div>
  );
}