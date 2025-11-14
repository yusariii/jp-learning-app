import React, { useState, ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Sidebar from '../components/sider';


import { useAppTheme } from '../hooks/use-app-theme';

type Props = {
  children: ReactNode;
  title?: string;
  rightActions?: React.ReactNode; 
};

export default function LayoutDefault({ children, title = 'Admin', rightActions }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible((s) => !s);
  const closeSidebar = () => setIsSidebarVisible(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: theme.color.bg, 
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.tokens.space.sm, 
          paddingHorizontal: theme.tokens.space.md,
          paddingTop: Math.max(insets.top, 8),
          paddingBottom: theme.tokens.space.sm,
          backgroundColor: theme.color.surface,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.color.border,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        iconButton: {
          padding: 8,
          borderRadius: theme.tokens.radius.sm, 
        },
        headerTitle: {
          ...theme.text.title, 
          color: theme.color.text,
          flexShrink: 1,
        },
        headerRight: {
          marginLeft: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.tokens.space.sm,
        },
        body: {
          flex: 1,
          paddingHorizontal: theme.tokens.space.md,
          paddingTop: theme.tokens.space.md,
          paddingBottom: insets.bottom,
          backgroundColor: theme.color.bg,
        },
      }),
    [theme.mode, insets.top, insets.bottom]
  );

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Mở menu"
          onPress={toggleSidebar}
          style={styles.iconButton}
          hitSlop={theme.utils.hitSlop}
        >
          <Feather name="menu" size={22} color={theme.color.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRight}>
          {rightActions ?? (
            <Feather name="bell" size={18} color={theme.color.textSub} />
          )}
        </View>
      </View>

      <View style={styles.body}>{children}</View>

      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
    </SafeAreaView>
  );
}
