
import React, { useState, ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Sidebar from "../components/sider"

type Props = {
  children: ReactNode;
  title?: string;
};

export default function LayoutDefault({ children, title = 'Admin' }: Props) {
  const insets = useSafeAreaInsets();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible((s) => !s);
  const closeSidebar = () => setIsSidebarVisible(false);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={toggleSidebar}
          style={styles.iconButton}
        >
          <Feather name="menu" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight}>
          <Feather name="bell" size={20} />
        </View>
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom }]}>
        {children}
      </View>

      {isSidebarVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeSidebar}
          style={styles.backdrop}
          accessibilityLabel="Close menu"
        />
      )}
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  headerRight: {
    marginLeft: 'auto',
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
