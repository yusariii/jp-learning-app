import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ContentCard from './ContentCard';
import type { Grammar } from '../../api/admin/content/grammar';

type Props = {
  item: Grammar;
  onEdit?: () => void;
};

export default function GrammarCard({ item, onEdit }: Props) {
  const firstEx = item.examples?.[0];

  return (
    <ContentCard>
      <View style={styles.head}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        {!!item.jlptLevel && (
          <Text style={styles.jlpt}>{item.jlptLevel}</Text>
        )}
      </View>
      {!!item.description && (
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      {!!item.explanationJP && (
        <Text style={styles.explainJP} numberOfLines={3}>
          {item.explanationJP}
        </Text>
      )}
      {!!item.explanationEN && (
        <Text style={styles.explainEN} numberOfLines={2}>
          {item.explanationEN}
        </Text>
      )}
      {firstEx && (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleJP} numberOfLines={2}>
            {firstEx.sentenceJP}
          </Text>
          {!!firstEx.readingKana && (
            <Text style={styles.kana} numberOfLines={1}>
              {firstEx.readingKana}
            </Text>
          )}
          {!!firstEx.meaningVI && (
            <Text style={styles.meaningVI} numberOfLines={2}>
              {firstEx.meaningVI}
            </Text>
          )}
          {!!firstEx.meaningEN && (
            <Text style={styles.meaningEN} numberOfLines={2}>
              {firstEx.meaningEN}
            </Text>
          )}
        </View>
      )}
      <View style={styles.foot}>
        <Text style={styles.meta}>
          {item.updatedAt
            ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}`
            : item.createdAt
            ? `Tạo: ${new Date(item.createdAt).toLocaleString()}`
            : ''}
        </Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.link}>Sửa</Text>
          </TouchableOpacity>
        )}
      </View>
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '700', flexShrink: 1 },
  jlpt: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111',
    color: '#fff',
    fontWeight: '700',
  },

  desc: { color: '#555', marginTop: 6 },

  explainJP: { marginTop: 6, fontWeight: '600' },
  explainEN: { color: '#555', marginTop: 2 },

  exampleBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eaeaea',
    gap: 2,
  },
  exampleJP: { fontSize: 14 },
  kana: { color: '#666' },
  meaningVI: { fontWeight: '600' },
  meaningEN: { color: '#555' },

  foot: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: { color: '#888', fontSize: 12 },
  link: { color: '#0a7', fontWeight: '700' },
});
