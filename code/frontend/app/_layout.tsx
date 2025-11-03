import { Slot, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../constants/theme-provider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <Slot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}