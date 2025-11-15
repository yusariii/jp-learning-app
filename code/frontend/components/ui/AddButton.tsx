import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'
import { useRouter, Href } from 'expo-router';

export default function AddButton({ to, label }: { to: Href; label: string }) {
  const { theme } = useAppTheme();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(to)}
      style={[theme.button.primary.container, { alignSelf: 'flex-end' }]}
      hitSlop={theme.utils.hitSlop}
      activeOpacity={0.8}
    >
      <Text style={theme.button.primary.label}>＋ {label}</Text>
    </TouchableOpacity>
  );
}
