import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/app/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md';
  active?: boolean;
}

export function IconButton({ 
  children, 
  variant = 'default',
  size = 'md',
  active = false,
  className, 
  ...props 
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    ghost: 'hover:bg-transparent'
  };
  
  const sizes = {
    sm: 'p-1',
    md: 'p-2'
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        active && 'bg-gray-100 dark:bg-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}