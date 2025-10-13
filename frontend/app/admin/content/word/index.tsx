import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import LayoutDefault from '../../../../layout-default/layout-default';

import { listWords, type Word } from '../../../../api/admin/content/word/index'

type ApiList = {
  data: Word[];
  page: number;
  limit: number;
  total: number;
};

const JLPTS: Array<NonNullable<Word['jlptLevel']> | ''> = ['', 'N5', 'N4', 'N3', 'N2', 'N1'];
const LIMIT = 20;

export default function VocabListScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [jlpt, setJlpt] = useState<Word['jlptLevel']>('');
  const [sort, setSort] = useState<'updatedAt' | 'createdAt' | 'termJP'>('updatedAt');
  const [data, setData] = useState<Word[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const reachedEndRef = useRef(false);

  const fetchPage = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const result: ApiList = await listWords({
        page: pageNum, limit: LIMIT,
        q: query.trim() || undefined,
        jlpt: jlpt || undefined,
        sort,
      }) as any;

      append ? setData(prev => [...prev, ...result.data]) : setData(result.data);
      setPage(result.page);
      setTotal(result.total);
      reachedEndRef.current = result.data.length < LIMIT || (result.page * LIMIT >= result.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query, jlpt, sort]);

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reachedEndRef.current = false;
    fetchPage(1, false);
  }, [fetchPage]);

  const onEndReached = useCallback(() => {
    if (loading || reachedEndRef.current) return;
    const next = page + 1;
    fetchPage(next, true);
    setPage(next);
  }, [page, loading, fetchPage]);

  return (
    <LayoutDefault title="Từ vựng">
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Tìm theo từ, romaji, nghĩa..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => fetchPage(1, false)}
            style={styles.input}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={() => fetchPage(1, false)} style={styles.searchBtn}>
            <Text style={{ fontWeight: '700' }}>Tìm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowWrap}>
          <View style={styles.rowWrap}>
            {JLPTS.map(lv => (
              <TouchableOpacity
                key={lv || 'none'}
                onPress={() => { setJlpt(lv || ''); fetchPage(1, false); }}
                style={[styles.chip, jlpt === lv && styles.chipActive]}
              >
                <Text style={[styles.chipText, jlpt === lv && styles.chipTextActive]}>{lv || '—'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.rowWrap, { marginLeft: 'auto' }]}>
            {(['updatedAt','createdAt','termJP'] as const).map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => { setSort(s); fetchPage(1, false); }}
                style={[styles.chip, sort === s && styles.chipActive]}
              >
                <Text style={[styles.chipText, sort === s && styles.chipTextActive]}>
                  {s === 'updatedAt' ? 'Sửa gần nhất' : s === 'createdAt' ? 'Mới tạo' : 'A→Z'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => router.push('/admin/content/word/create')}
            style={styles.primaryBtn}
            accessibilityLabel="Thêm từ vựng"
          >
            <Text style={styles.primaryBtnText}>＋ Thêm từ vựng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id || item.termJP}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <WordItem
            item={item}
            onPressEdit={() => router.push(`/admin/content/word/edit/${item._id}` as Parameters<typeof router.push>[0])}
          />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListEmptyComponent={!loading ? <EmptyState onCreate={() => router.push('/admin/content/word/create')} /> : null}
        ListFooterComponent={loading ? <View style={{ paddingVertical: 16 }}><ActivityIndicator /></View> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </LayoutDefault>
  );
}

function WordItem({ item, onPressEdit }: { item: Word; onPressEdit: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.term}>{item.termJP}</Text>
        {!!item.jlptLevel && <Text style={styles.jlpt}>{item.jlptLevel}</Text>}
      </View>
      <View style={styles.rowGap4}>
        {!!item.hiraKata && <Text style={styles.subtle}>{item.hiraKata}</Text>}
        {!!item.romaji && <Text style={styles.subtle}>{item.romaji}</Text>}
      </View>
      <View style={styles.rowGap4}>
        {!!item.meaningVI && <Text style={styles.meaning}>{item.meaningVI}</Text>}
        {!!item.meaningEN && <Text style={styles.meaningEn}>{item.meaningEN}</Text>}
      </View>
      {!!item.tags?.length && (
        <View style={[styles.rowWrap, { marginTop: 6 }]}>
          {item.tags!.map(t => <View key={t} style={[styles.chip, styles.tagChip]}><Text style={styles.chipText}>{t}</Text></View>)}
        </View>
      )}
      <View style={[styles.rowBetween, { marginTop: 10 }]}>
        <Text style={styles.meta}>
          {item.updatedAt ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}`
            : item.createdAt ? `Tạo: ${new Date(item.createdAt).toLocaleString()}` : ''}
        </Text>
        <TouchableOpacity onPress={onPressEdit}>
          <Text style={styles.link}>Sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Chưa có từ vựng</Text>
      <TouchableOpacity onPress={onCreate} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>＋ Thêm từ vựng đầu tiên</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12, gap: 8 },
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end' },
  primaryBtn: {
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  searchBtn: {
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d9d9d9',
    justifyContent: 'center',
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#212121', borderColor: '#212121' },
  chipText: { fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  tagChip: { backgroundColor: '#f3f3f3' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  term: { fontSize: 18, fontWeight: '700' },
  jlpt: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111',
    color: '#fff',
    fontWeight: '700',
    overflow: 'hidden',
  },
  subtle: { color: '#666' },
  meaning: { fontWeight: '600' },
  meaningEn: { color: '#555' },
  rowGap4: { flexDirection: 'row', gap: 8, marginTop: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { color: '#888', fontSize: 12 },
  link: { color: '#0a7', fontWeight: '700' },
});
