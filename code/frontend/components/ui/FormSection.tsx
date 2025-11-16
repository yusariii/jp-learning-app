import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'

export default function FormSection({
  title, children, footer,
}: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ ...theme.surface.card, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.md }}>
      <Text style={{ ...theme.text.h2, marginBottom: theme.tokens.space.sm }}>{title}</Text>
      {children}
      {footer}
    </View>
  );
}
