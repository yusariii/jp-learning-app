import { Stack } from 'expo-router';
import React, { useEffect } from 'react';

export default function RootLayout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
    </Stack>
  );
}