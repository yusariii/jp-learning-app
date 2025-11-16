import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';

export type ExampleLike = {
  sentenceJP?: string;
  readingKana?: string;
  meaningVI?: string;
  meaningEN?: string;
};

export default function ExampleBlock({
  ex,
  index,
  style,
}: {
  ex: ExampleLike;
  index?: number;        
  style?: ViewStyle;       
}) {
  const { theme } = useAppTheme();
  const hasAnything =
    !!ex?.sentenceJP || !!ex?.readingKana || !!ex?.meaningVI || !!ex?.meaningEN;

  if (!hasAnything) return null;

  return (
    <View
      style={[
        {
          backgroundColor: theme.color.bgSubtle,
          borderRadius: theme.tokens.radius.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.color.border,
          padding: theme.tokens.space.md,
          marginBottom: theme.tokens.space.sm,
        },
        style,
      ]}
    >
      {typeof index === 'number' && (
        <Text
          style={[
            theme.text.meta,
            { marginBottom: theme.tokens.space.xs }
          ]}
        >
          #{index + 1}
        </Text>
      )}

      {!!ex.sentenceJP && (
        <Text style={theme.text.title} numberOfLines={3}>
          {ex.sentenceJP}
        </Text>
      )}

      {!!ex.readingKana && (
        <Text
          style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}
          numberOfLines={2}
        >
          {ex.readingKana}
        </Text>
      )}

      {!!ex.meaningVI && (
        <Text
          style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}
          numberOfLines={3}
        >
          {ex.meaningVI}
        </Text>
      )}

      {!!ex.meaningEN && (
        <Text
          style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}
          numberOfLines={3}
        >
          {ex.meaningEN}
        </Text>
      )}
    </View>
  );
}
