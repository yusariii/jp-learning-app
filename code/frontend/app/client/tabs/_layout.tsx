import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserSidebar from '@/components/client/Sider';
import UserBottomMenuBar from '@/components/client/BottomMenuBar';

export default function ClientTabsLayout() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false, 
          tabBarStyle: {
            backgroundColor: theme.color.surface,
            borderTopColor: theme.color.border,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingTop: 12,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: theme.color.primary,
          tabBarInactiveTintColor: theme.color.textSub,
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 12,
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Hành trình',
            tabBarIcon: ({ color }) => <Feather name="map" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="study"
          options={{
            title: 'Luyện tập',
            tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="dictionary"
          options={{
            title: 'Từ điển',
            tabBarIcon: ({ color }) => <Feather name="book" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Hồ sơ',
            tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}