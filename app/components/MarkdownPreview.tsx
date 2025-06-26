'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-bold
                    prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4
                    prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-2xl prose-h3:mt-5 prose-h3:mb-2
                    prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2
                    prose-h5:text-lg prose-h5:mt-3 prose-h5:mb-1
                    prose-h6:text-base prose-h6:mt-3 prose-h6:mb-1
                    prose-p:text-base prose-p:leading-7 prose-p:mb-4
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline hover:prose-a:no-underline
                    prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-em:italic
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                    prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                    prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                    prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100
                    prose-ol:list-decimal prose-ol:pl-6
                    prose-ul:list-disc prose-ul:pl-6
                    prose-li:mb-2
                    prose-img:rounded-lg prose-img:shadow-md
                    prose-hr:border-gray-300 dark:prose-hr:border-gray-700">
      <ReactMarkdown
        components={{
          // コードブロックのカスタマイズ
          pre: ({ children }) => (
            <pre className="overflow-x-auto p-4 my-4 bg-gray-900 dark:bg-black rounded-lg text-sm">
              {children}
            </pre>
          ),
          // インラインコードのカスタマイズ
          code: ({ children, ...props }) => {
            // コードブロック内のコードは親のpreで処理されるため、インラインコードのみスタイリング
            const isInline = !props.className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 mx-0.5 bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return <code {...props}>{children}</code>;
          },
          // テーブルのスタイリング
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}