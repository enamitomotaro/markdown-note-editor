'use client';

import { useTheme } from '@/app/hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme();

  return <>{children}</>;
}