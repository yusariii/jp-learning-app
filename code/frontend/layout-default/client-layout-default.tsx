import React, { ReactNode, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/use-app-theme';
import UserSidebar from '@/components/client/Sider';
import UserBottomMenuBar from '@/components/client/BottomMenuBar';

type Props = {
  children: ReactNode;
  title?: string;
  rightActions?: React.ReactNode;
  /** nếu muốn ẩn bottom bar (ví dụ màn thi full screen) */
  hideBottomBar?: boolean;
  /** nếu children đã có ScrollView riêng thì set false */
  enableScroll?: boolean;
};

export default function LayoutUserDefault({
  children,
  title = 'JLPT',
  rightActions,
  hideBottomBar = false,
  enableScroll = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();

  const isWide = width >= 960; // desktop/web
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible((s) => !s);
  const closeSidebar = () => setIsSidebarVisible(false);

  const bottomBarHeight = hideBottomBar ? 0 : 64 + Math.max(insets.bottom, 8);

  const styles = useMemo(
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
            android: { elevation: 2 },
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
        mainRow: {
          flex: 1,
          flexDirection: isWide ? 'row' : 'column',
        },
        permanentSider: {
          width: 300,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: theme.color.border,
          backgroundColor: theme.color.surface,
        },
        body: {
          flex: 1,
          backgroundColor: theme.color.bg,
        },
        bodyScrollContent: {
          paddingHorizontal: theme.tokens.space.md,
          paddingTop: theme.tokens.space.md,
          paddingBottom: bottomBarHeight + 20, // chừa chỗ bottom bar + extra space
        },
        bodyNoScroll: {
          paddingHorizontal: theme.tokens.space.md,
          paddingTop: theme.tokens.space.md,
          paddingBottom: bottomBarHeight,
        },
        bottomBarWrap: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [theme.mode, insets.top, insets.bottom, isWide, bottomBarHeight]
  );

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        {!isWide && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Mở menu"
            onPress={toggleSidebar}
            style={styles.iconButton}
            hitSlop={theme.utils.hitSlop}
          >
            <Feather name="menu" size={22} color={theme.color.text} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRight}>
          {rightActions ?? (
            <TouchableOpacity style={styles.iconButton} hitSlop={theme.utils.hitSlop}>
              <Feather name="bell" size={18} color={theme.color.textSub} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mainRow}>
        {/* Permanent sider cho desktop/web */}
        {enableScroll ? (
          <ScrollView 
            style={styles.body}
            contentContainerStyle={styles.bodyScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.body, styles.bodyNoScroll]}>{children}</View>
        )}
          <View style={styles.permanentSider}>
            {/* Dùng cùng component UserSidebar nhưng render ở trạng thái luôn mở */}
            <UserSidebar isVisible={true} onClose={() => {}} />
          </View>
        ) : null}

        <View style={styles.body}>{children}</View>
      </View>

      {/* Drawer sider cho mobile */}
      {!isWide && <UserSidebar isVisible={isSidebarVisible} onClose={closeSidebar} />}

      {/* Bottom bar cho mobile */}
      {!isWide && !hideBottomBar && (
        <View style={styles.bottomBarWrap}>
          <UserBottomMenuBar />
        </View>
      )}
    </SafeAreaView>
  );
}
