import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-app-theme';

type Tab = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  href: string;
  match?: (pathname: string) => boolean;
};

export default function UserBottomMenuBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const tabs: Tab[] = [
    { key: 'home', label: 'Home', icon: 'home', href: '/', match: (p) => p === '/' },
    { key: 'learn', label: 'Học', icon: 'book-open', href: '/lesson', match: (p) => p.startsWith('/lesson') },
    { key: 'exam', label: 'Test', icon: 'check-square', href: '/exam', match: (p) => p.startsWith('/exam') },
    { key: 'profile', label: 'Bạn', icon: 'user', href: '/profile', match: (p) => p.startsWith('/profile') },
    { key: 'setting', label: 'Set', icon: 'settings', href: '/setting', match: (p) => p.startsWith('/setting') },
  ];

  const isActive = (t: Tab) => (t.match ? t.match(pathname) : pathname.startsWith(t.href));

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: theme.color.surface,
          borderTopColor: theme.color.border,
        },
        Platform.OS === 'ios' ? theme.tokens.elevation.md : null,
      ]}
    >
      {tabs.map((t) => {
        const active = isActive(t);
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => router.push(t.href as any)}
            style={styles.item}
            activeOpacity={0.85}
            hitSlop={theme.utils.hitSlop}
          >
            <Feather
              name={t.icon}
              size={20}
              color={active ? theme.color.link : theme.color.textSub}
            />
            <Text
              style={{
                ...theme.text.meta,
                marginTop: 4,
                color: active ? theme.color.link : theme.color.textMeta,
                fontWeight: active ? '800' : '600',
              }}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
});
