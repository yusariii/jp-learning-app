import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ContentCard from './ContentCard';
import TagPills from '../ui/TagPills'
import type { Word } from '../../api/admin/content/word';
import { useAppTheme } from '../../hooks/use-app-theme';

export default function WordCard({ item, onEdit, onDetail }: { item: Word; onEdit?: () => void; onDetail?: () => void; }) {
  const { theme } = useAppTheme();

  return (
    <ContentCard>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm }}>
        <Text style={theme.text.title}>{item.termJP}</Text>
        {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
      </View>

      <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.xs }}>
        {!!item.hiraKata && <Text style={theme.text.secondary}>{item.hiraKata}</Text>}
        {!!item.romaji && <Text style={theme.text.secondary}>{item.romaji}</Text>}
      </View>

      <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.xs }}>
        {!!item.meaningVI && <Text style={{ ...theme.text.body, fontWeight: '600' }}>{item.meaningVI}</Text>}
        {!!item.meaningEN && <Text style={theme.text.secondary}>{item.meaningEN}</Text>}
      </View>

      <TagPills tags={item.tags} />

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
