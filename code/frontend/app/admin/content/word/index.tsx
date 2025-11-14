import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import LayoutDefault from '../../../../layout-default/layout-default';

import { listWords, type Word } from '../../../../api/admin/content/word/index';

import { useAppTheme } from '../../../../hooks/use-app-theme';

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
  const { theme } = useAppTheme();              
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

  const styles = useMemo(() => StyleSheet.create({
    header: { padding: theme.tokens.space.md, gap: theme.tokens.space.sm },
    toolbar: { flexDirection: 'row', justifyContent: 'flex-end' },
    searchRow: { flexDirection: 'row', gap: theme.tokens.space.sm },

    inputWrap: { ...theme.surface.input, flex: 1 }, 
    input: { ...theme.text.body, paddingVertical: 0 },

    searchBtn: {
      minHeight: theme.tokens.touch.min,
      paddingHorizontal: theme.tokens.space.md,
      paddingVertical: 12,
      borderRadius: theme.tokens.radius.md,
      backgroundColor: theme.color.surface,
      borderColor: theme.color.border,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchBtnText: { ...theme.text.body, fontWeight: '700', color: theme.color.text },

    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.sm, alignItems: 'center' },

    card: {
      ...theme.surface.card,
      marginVertical: theme.list.itemSpacingY / 2,
      padding: theme.tokens.space.md,
      borderRadius: theme.tokens.radius.md,
      backgroundColor: theme.color.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.color.border,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm },
    rowGap4: { flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.xs },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tagChip: { backgroundColor: theme.color.surfaceAlt, borderColor: theme.color.border, borderWidth: 1 },
  }), [theme.mode]);

  return (
    <LayoutDefault title="Từ vựng">
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Tìm theo từ, romaji, nghĩa..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => fetchPage(1, false)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity onPress={() => fetchPage(1, false)} style={styles.searchBtn} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.searchBtnText}>Tìm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowWrap}>
          <View style={styles.rowWrap}>
            {JLPTS.map(lv => (
              <TouchableOpacity
                key={lv || 'none'}
                onPress={() => { setJlpt(lv || ''); fetchPage(1, false); }}
                hitSlop={theme.utils.hitSlop}
                style={[
                  theme.chip.container,
                  { height: theme.chip.height },
                  jlpt === lv && theme.chip.active.container
                ]}
              >
                <Text style={[theme.chip.label, jlpt === lv && theme.chip.active.label]}>{lv || '—'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.rowWrap, { marginLeft: 'auto' }]}>
            {(['updatedAt', 'createdAt', 'termJP'] as const).map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => { setSort(s); fetchPage(1, false); }}
                hitSlop={theme.utils.hitSlop}
                style={[
                  theme.chip.container,
                  { height: theme.chip.height },
                  sort === s && theme.chip.active.container
                ]}
              >
                <Text style={[theme.chip.label, sort === s && theme.chip.active.label]}>
                  {s === 'updatedAt' ? 'Sửa gần nhất' : s === 'createdAt' ? 'Mới tạo' : 'A→Z'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => router.push('/admin/content/word/create')}
            style={theme.button.primary.container}
            accessibilityLabel="Thêm từ vựng"
            hitSlop={theme.utils.hitSlop}
          >
            <Text style={theme.button.primary.label}>＋ Thêm từ vựng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id || item.termJP}
        contentContainerStyle={{ paddingHorizontal: theme.tokens.space.md, paddingBottom: theme.tokens.space.xl }}
        renderItem={({ item }) => (
          <WordRow
            item={item}
            onPressEdit={() => router.push(`/admin/content/word/edit/${item._id}` as Parameters<typeof router.push>[0])}
          />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListEmptyComponent={!loading ? <EmptyState onCreate={() => router.push('/admin/content/word/create')} /> : null}
        ListFooterComponent={loading ? (
          <View style={{ paddingVertical: theme.tokens.space.lg }}>
            <ActivityIndicator color={theme.color.textSub} />
          </View>
        ) : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.textSub} />}
      />
    </LayoutDefault>
  );
}

function WordRow({ item, onPressEdit }: { item: Word; onPressEdit: () => void }) {
  const { theme } = useAppTheme();
  const router = useRouter();

  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      ...theme.surface.card,
      marginVertical: theme.list.itemSpacingY / 2,
      padding: theme.tokens.space.md,
      borderRadius: theme.tokens.radius.md,
      backgroundColor: theme.color.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.color.border,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm },
    rowGap4: { flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.xs },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.sm, alignItems: 'center' },
    tagChip: { backgroundColor: theme.color.surfaceAlt, borderColor: theme.color.border, borderWidth: 1 },

    actions: { flexDirection: 'row', gap: theme.tokens.space.sm, alignItems: 'center' },
  }), [theme.mode]);

  const goDetail = () => router.push(
    `/admin/content/word/detail/${item._id}` as Parameters<typeof router.push>[0]
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={theme.text.title}>{item.termJP}</Text>
        {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
      </View>

      <View style={styles.rowGap4}>
        {!!item.hiraKata && <Text style={theme.text.secondary}>{item.hiraKata}</Text>}
        {!!item.romaji && <Text style={theme.text.secondary}>{item.romaji}</Text>}
      </View>

      <View style={styles.rowGap4}>
        {!!item.meaningVI && <Text style={{ ...theme.text.body, fontWeight: '600' }}>{item.meaningVI}</Text>}
        {!!item.meaningEN && <Text style={theme.text.secondary}>{item.meaningEN}</Text>}
      </View>

      {!!item.tags?.length && (
        <View style={[styles.rowWrap, { marginTop: theme.tokens.space.sm }]}>
          {item.tags!.map(t =>
            <View key={t} style={[theme.chip.container, styles.tagChip, { height: theme.chip.height }]}>
              <Text style={theme.chip.label}>{t}</Text>
            </View>
          )}
        </View>
      )}

      <View style={[styles.rowBetween, { marginTop: theme.tokens.space.sm }]}>
        <Text style={theme.text.meta}>
          {item.updatedAt ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}`
            : item.createdAt ? `Tạo: ${new Date(item.createdAt).toLocaleString()}` : ''}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={goDetail}
            style={theme.button.ghost.container}
            hitSlop={theme.utils.hitSlop}
          >
            <Text style={theme.button.ghost.label}>Chi tiết</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressEdit}
            style={theme.button.primary.container}
            hitSlop={theme.utils.hitSlop}
          >
            <Text style={theme.button.primary.label}>Sửa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


function EmptyState({ onCreate }: { onCreate: () => void }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ padding: theme.tokens.space.lg, alignItems: 'center' }}>
      <Text style={theme.text.body}>Chưa có từ vựng</Text>
      <TouchableOpacity
        onPress={onCreate}
        style={[theme.button.primary.container, { marginTop: theme.tokens.space.sm }]}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={theme.button.primary.label}>＋ Thêm từ vựng đầu tiên</Text>
      </TouchableOpacity>
    </View>
  );
}
