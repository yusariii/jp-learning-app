import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import LayoutDefault from '../../../../layout-default/layout-default';
import { useAppTheme } from "../../../../hooks/use-app-theme"
import { listGrammars, type Grammar } from '../../../../api/admin/content/grammar';

type ApiList = { data: Grammar[]; page: number; limit: number; total: number };
const JLPTS: Array<Grammar['jlptLevel']> = ['', 'N5','N4','N3','N2','N1'];
const LIMIT = 20;

export default function GrammarListScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const [q, setQ] = useState('');
  const [jlpt, setJlpt] = useState<Grammar['jlptLevel']>('');
  const [sort, setSort] = useState<'updatedAt'|'createdAt'|'title'>('updatedAt');

  const [data, setData] = useState<Grammar[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const reachedEndRef = useRef(false);

  const fetchPage = useCallback(async (p: number, append = false) => {
    setLoading(true);
    try {
      const res = await listGrammars({ page: p, limit: LIMIT, q: q.trim() || undefined, jlpt, sort });
      append ? setData(prev => [...prev, ...res.data]) : setData(res.data);
      setPage(res.page);
      setTotal(res.total);
      reachedEndRef.current = res.data.length < LIMIT || (res.page * LIMIT >= res.total);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [q, jlpt, sort]);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const onRefresh = useCallback(() => { setRefreshing(true); reachedEndRef.current = false; fetchPage(1); }, [fetchPage]);
  const onEndReached = useCallback(() => {
    if (loading || reachedEndRef.current) return;
    const next = page + 1;
    fetchPage(next, true); setPage(next);
  }, [loading, page, fetchPage]);

  const styles = useMemo(() => StyleSheet.create({
    header: { padding: theme.tokens.space.md, gap: theme.tokens.space.sm },
    searchRow: { flexDirection: 'row', gap: theme.tokens.space.sm },
    inputWrap: { ...theme.surface.input, flex: 1 },
    input: { ...theme.text.body, paddingVertical: 0 },
    searchBtn: {
      minHeight: theme.tokens.touch.min, paddingHorizontal: theme.tokens.space.md, paddingVertical: 12,
      borderRadius: theme.tokens.radius.md, backgroundColor: theme.color.surface, borderColor: theme.color.border, borderWidth: 1,
      alignItems: 'center', justifyContent: 'center',
    },
    searchBtnText: { ...theme.text.body, fontWeight: '700' as const, color: theme.color.text },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.sm, alignItems: 'center' },
    card: {
      ...theme.surface.card, marginVertical: theme.list.itemSpacingY/2, padding: theme.tokens.space.md,
      borderRadius: theme.tokens.radius.md, backgroundColor: theme.color.surface,
      borderWidth: StyleSheet.hairlineWidth, borderColor: theme.color.border,
    },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    actions: { flexDirection: 'row', gap: theme.tokens.space.sm, alignItems: 'center' },
  }), [theme.mode]);

  return (
    <LayoutDefault title="Ngữ pháp">
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Tìm theo tiêu đề/mô tả/nội dung..."
              value={q}
              onChangeText={setQ}
              onSubmitEditing={() => fetchPage(1)}
              placeholderTextColor={theme.color.textMeta}
              style={styles.input}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity onPress={() => fetchPage(1)} style={styles.searchBtn} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.searchBtnText}>Tìm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowWrap}>
          <View style={styles.rowWrap}>
            {JLPTS.map(lv => (
              <TouchableOpacity
                key={lv || 'none'}
                onPress={() => { setJlpt(lv); fetchPage(1); }}
                hitSlop={theme.utils.hitSlop}
                style={[theme.chip.container, { height: theme.chip.height }, jlpt === lv && theme.chip.active.container]}
              >
                <Text style={[theme.chip.label, jlpt === lv && theme.chip.active.label]}>{lv || '—'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.rowWrap, { marginLeft: 'auto' }]}>
            {(['updatedAt','createdAt','title'] as const).map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => { setSort(s); fetchPage(1); }}
                hitSlop={theme.utils.hitSlop}
                style={[theme.chip.container, { height: theme.chip.height }, sort === s && theme.chip.active.container]}
              >
                <Text style={[theme.chip.label, sort === s && theme.chip.active.label]}>
                  {s === 'updatedAt' ? 'Sửa gần nhất' : s === 'createdAt' ? 'Mới tạo' : 'A→Z'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => router.push('/admin/content/grammar/create')}
            style={theme.button.primary.container}
            hitSlop={theme.utils.hitSlop}
          >
            <Text style={theme.button.primary.label}>＋ Thêm ngữ pháp</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => it._id || it.title}
        contentContainerStyle={{ paddingHorizontal: theme.tokens.space.md, paddingBottom: theme.tokens.space.xl }}
        renderItem={({ item }) => <GrammarRow item={item} />}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListEmptyComponent={!loading ? <EmptyState onCreate={() => router.push('/admin/content/grammar/create')} /> : null}
        ListFooterComponent={loading ? <View style={{ paddingVertical: theme.tokens.space.lg }}><ActivityIndicator color={theme.color.textSub} /></View> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.textSub} />}
      />
    </LayoutDefault>
  );
}

function GrammarRow({ item }: { item: Grammar }) {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <View style={{
      ...theme.surface.card, marginVertical: theme.list.itemSpacingY/2, padding: theme.tokens.space.md,
      borderRadius: theme.tokens.radius.md, backgroundColor: theme.color.surface,
      borderWidth: StyleSheet.hairlineWidth, borderColor: theme.color.border,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, flexWrap: 'wrap' }}>
        <Text style={theme.text.title}>{item.title}</Text>
        {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
      </View>

      {!!item.description && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]} numberOfLines={2}>{item.description}</Text>}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.tokens.space.sm }}>
        <Text style={theme.text.meta}>
          {item.updatedAt ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}` : item.createdAt ? `Tạo: ${new Date(item.createdAt).toLocaleString()}` : ''}
        </Text>
        <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
          <TouchableOpacity onPress={() => router.push(`/admin/content/grammar/detail/${item._id}` as any)} style={theme.button.ghost.container} hitSlop={theme.utils.hitSlop}>
            <Text style={theme.button.ghost.label}>Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/admin/content/grammar/edit/${item._id}` as any)} style={theme.button.primary.container} hitSlop={theme.utils.hitSlop}>
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
      <Text style={theme.text.body}>Chưa có mục ngữ pháp</Text>
      <TouchableOpacity onPress={onCreate} style={[theme.button.primary.container, { marginTop: theme.tokens.space.sm }]} hitSlop={theme.utils.hitSlop}>
        <Text style={theme.button.primary.label}>＋ Thêm mục đầu tiên</Text>
      </TouchableOpacity>
    </View>
  );
}
