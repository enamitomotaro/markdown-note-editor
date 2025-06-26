import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    // システム設定に基づいてダークモードを適用
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // 初期設定
    applyTheme(mediaQuery);

    // システム設定変更時のリスナー
    mediaQuery.addEventListener('change', applyTheme);

    return () => {
      mediaQuery.removeEventListener('change', applyTheme);
    };
  }, []);
}