import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/use-app-theme';

type Props = {
  children: ReactNode;
  title?: string;
  hideBottomBar?: boolean;
  enableScroll?: boolean;
};

const TabScreenLayout: React.FC<Props> = ({
  children,
  title,
  hideBottomBar,
  enableScroll = true,
}) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Bottom bar is handled by Expo Tabs, just add padding for it
  const bottomBarHeight = hideBottomBar ? 0 : Platform.OS === 'ios' ? 88 : 68;

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.bg }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.color.surface,
            borderBottomColor: theme.color.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <Text style={[theme.text.h2, { color: theme.color.text }]}>{title || 'Lộ trình'}</Text>
      </View>

      {/* Main Content */}
      {enableScroll ? (
        <ScrollView
          style={styles.body}
          contentContainerStyle={{
            paddingBottom: bottomBarHeight + 20,
          }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.body, { paddingBottom: bottomBarHeight + 20 }]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
  },
});

export default TabScreenLayout;
