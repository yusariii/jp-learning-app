import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ContentCard from './ContentCard';
import TagPills from '../ui/TagPills';
import type { Word } from '../../api/admin/content/word'

export default function WordCard({ item, onEdit }: { item: Word; onEdit?: () => void; }) {
  return (
    <ContentCard>
      <View style={styles.head}>
        <Text style={styles.term}>{item.termJP}</Text>
        {!!item.jlptLevel && <Text style={styles.jlpt}>{item.jlptLevel}</Text>}
      </View>
      <View style={styles.row}>{!!item.hiraKata && <Text style={styles.subtle}>{item.hiraKata}</Text>}{!!item.romaji && <Text style={styles.subtle}>{item.romaji}</Text>}</View>
      <View style={styles.row}>{!!item.meaningVI && <Text style={styles.bold}>{item.meaningVI}</Text>}{!!item.meaningEN && <Text style={styles.gray}>{item.meaningEN}</Text>}</View>
      <TagPills tags={item.tags} />
      <View style={styles.foot}>
        <Text style={styles.meta}>{item.updatedAt ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}` : ''}</Text>
        {onEdit && <TouchableOpacity onPress={onEdit}><Text style={styles.link}>Sửa</Text></TouchableOpacity>}
      </View>
    </ContentCard>
  );
}
const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  term: { fontSize: 18, fontWeight: '700' },
  jlpt: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#111', color: '#fff', fontWeight: '700' },
  subtle: { color: '#666', marginRight: 8 },
  bold: { fontWeight: '600', marginRight: 8 },
  gray: { color: '#555' },
  row: { flexDirection: 'row', gap: 8, marginTop: 4 },
  foot: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: '#888', fontSize: 12 },
  link: { color: '#0a7', fontWeight: '700' },
});
