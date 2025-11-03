// hooks/useAppTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '../constants/theme-provider';
import type { Theme } from '../constants/theme';

export function useAppTheme() {
  // Trả về { pref, mode, theme, setPref, ready }
  return useContext(ThemeContext) as {
    pref: 'system' | 'light' | 'dark';
    mode: 'light' | 'dark';
    theme: Theme;
    setPref: (p: 'system' | 'light' | 'dark') => void;
    ready: boolean;
  };
}
