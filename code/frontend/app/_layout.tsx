import { Slot, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Slot />
    </SafeAreaProvider>

  );
}