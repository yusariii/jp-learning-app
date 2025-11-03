// Quản lý chế độ màu: 'system' | 'light' | 'dark' + đồng bộ AsyncStorage
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme, type Theme } from './theme';

export type ThemePref = 'system' | 'light' | 'dark';
type Ctx = {
  pref: ThemePref;            // người dùng chọn gì
  mode: 'light' | 'dark';     // mode thực tế đang áp dụng
  theme: Theme;               // theme trả về từ getTheme(mode)
  setPref: (p: ThemePref) => void;
  ready: boolean;             // đã hydrate xong chưa
};

export const ThemeContext = createContext<Ctx>({
  pref: 'system',
  mode: 'light',
  theme: getTheme('light'),
  setPref: () => {},
  ready: false,
});

const KEY = 'app.theme.pref';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const device = useColorScheme(); // 'light' | 'dark' | null
  const [pref, setPrefState] = useState<ThemePref>('system');
  const [ready, setReady] = useState(false);

  // Hydrate: đọc lựa chọn lưu trước đó
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPrefState(saved);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setPref = useCallback(async (p: ThemePref) => {
    setPrefState(p);
    await AsyncStorage.setItem(KEY, p);
  }, []);

  // Quyết định mode thực tế theo pref
  const mode: 'light' | 'dark' = useMemo(() => {
    if (pref === 'system') return (device ?? 'light');
    return pref;
  }, [pref, device]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = useMemo<Ctx>(() => ({ pref, mode, theme, setPref, ready }), [pref, mode, theme, setPref, ready]);

  // Có thể thêm <SafeAreaProvider> ở đây nếu bạn dùng
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
