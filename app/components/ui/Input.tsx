import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl border transition-all',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:border-transparent shadow-sm',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';