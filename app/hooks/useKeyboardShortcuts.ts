import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, metaKey, shiftKey, callback }) => {
        const isCtrlPressed = ctrlKey ? (e.ctrlKey || e.metaKey) : true;
        const isMetaPressed = metaKey ? e.metaKey : true;
        const isShiftPressed = shiftKey ? e.shiftKey : !shiftKey || e.shiftKey;
        
        if (
          e.key.toLowerCase() === key.toLowerCase() &&
          isCtrlPressed &&
          isMetaPressed &&
          isShiftPressed
        ) {
          e.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}