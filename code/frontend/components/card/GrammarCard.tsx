import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ContentCard from './ContentCard';
import type { Grammar } from '../../api/admin/content/grammar'
import { useAppTheme } from '../../hooks/use-app-theme'

type Props = {
  item: Grammar;
  onEdit?: () => void;
  onDetail?: () => void;
};

export default function GrammarCard({ item, onEdit, onDetail }: Props) {
  const { theme } = useAppTheme();
  const firstEx = item.examples?.[0];

  return (
    <ContentCard>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm }}>
        <Text style={theme.text.title} numberOfLines={1}>{item.title}</Text>
        {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
      </View>

      {!!item.description && (
        <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {!!item.explanationJP && (
        <Text style={{ ...theme.text.body, marginTop: theme.tokens.space.xs, fontWeight: '600' }} numberOfLines={3}>
          {item.explanationJP}
        </Text>
      )}

      {!!item.explanationEN && (
        <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]} numberOfLines={2}>
          {item.explanationEN}
        </Text>
      )}

      {firstEx && (
        <View
          style={{
            marginTop: theme.tokens.space.sm,
            padding: theme.tokens.space.sm,
            borderRadius: theme.tokens.radius.md,
            backgroundColor: theme.color.bgSubtle,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.color.border,
            gap: 2,
          }}
        >
          <Text style={theme.text.body} numberOfLines={2}>{firstEx.sentenceJP}</Text>
          {!!firstEx.readingKana && <Text style={theme.text.secondary} numberOfLines={1}>{firstEx.readingKana}</Text>}
          {!!firstEx.meaningVI && <Text style={{ ...theme.text.body, fontWeight: '600' }} numberOfLines={2}>{firstEx.meaningVI}</Text>}
          {!!firstEx.meaningEN && <Text style={theme.text.secondary} numberOfLines={2}>{firstEx.meaningEN}</Text>}
        </View>
      )}

      <View style={{ marginTop: theme.tokens.space.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={theme.text.meta}>
          {item.updatedAt
            ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}`
            : item.createdAt
            ? `Tạo: ${new Date(item.createdAt).toLocaleString()}`
            : ''}
        </Text>

        <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
          {onDetail && (
            <TouchableOpacity onPress={onDetail} style={theme.button.ghost.container} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.ghost.label}>Chi tiết</Text>
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={theme.button.primary.container} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ContentCard>
  );
}
