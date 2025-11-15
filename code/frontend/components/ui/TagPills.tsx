import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';

export default function TagPills({ tags }: { tags?: string[] }) {
  const { theme } = useAppTheme();
  if (!tags?.length) return null;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.xs, marginTop: theme.tokens.space.xs }}>
      {tags.map(t => (
        <View
          key={t}
          style={{
            ...theme.chip.container,
            height: theme.chip.height,
            backgroundColor: theme.color.surfaceAlt,
            borderColor: theme.color.border,
            borderWidth: 1,
          }}
        >
          <Text style={theme.chip.label}>{t}</Text>
        </View>
      ))}
    </View>
  );
}
