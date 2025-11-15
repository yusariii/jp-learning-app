import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'

export default function ContentCard({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();
  return (
    <View
      style={{
        ...theme.surface.card,
        padding: theme.tokens.space.md,
        marginVertical: theme.list.itemSpacingY / 2,
        borderRadius: theme.tokens.radius.md,
        backgroundColor: theme.color.surface,
        borderWidth: 1,
        borderColor: theme.color.border,
      }}
    >
      {children}
    </View>
  );
}
