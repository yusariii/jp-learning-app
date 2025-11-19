import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useRouter, Href } from 'expo-router';

import LayoutDefault from '../../../../layout-default/layout-default';
import { useAppTheme } from '../../../../hooks/use-app-theme';
import { listGrammars, type Grammar } from '../../../../api/admin/content/grammar';

import SearchBar from '../../../../components/ui/SearchBar';
import FilterBar, { type SortKey } from '../../../../components/list/FilterBar'
import GrammarCard from '../../../../components/card/GrammarCard'
import AddButton from '../../../../components/ui/AddButton';
import EmptyState from '../../../../components/ui/EmptyState';

type ApiList = { data: Grammar[]; page: number; limit: number; total: number };

const JLPTS: Array<Grammar['jlptLevel']> = ['', 'N5', 'N4', 'N3', 'N2', 'N1'];
const LIMIT = 20;

export default function ListGrammarScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();

  const [q, setQ] = useState('');
  const [jlpt, setJlpt] = useState<Grammar['jlptLevel']>('');
  const [sort, setSort] = useState<SortKey>('updatedAt');

  const [data, setData] = useState<Grammar[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const reachedEndRef = useRef(false);

  const fetchPage = useCallback(async (p: number, append = false) => {
    setLoading(true);
    try {
      const res: ApiList = await listGrammars({
        page: p,
        limit: LIMIT,
        q: q.trim() || undefined,
        jlpt: jlpt || undefined,
        sort: (sort as any) || 'updatedAt',
      }) as any;

      append ? setData(prev => [...prev, ...res.data]) : setData(res.data);
      setPage(res.page);
      setTotal(res.total);
      reachedEndRef.current = res.data.length < LIMIT || res.page * LIMIT >= res.total;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [q, jlpt, sort]);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reachedEndRef.current = false;
    fetchPage(1);
  }, [fetchPage]);

  const onEndReached = useCallback(() => {
    if (loading || reachedEndRef.current) return;
    const next = page + 1;
    fetchPage(next, true);
    setPage(next);
  }, [loading, page, fetchPage]);

  const styles = useMemo(() => ({
    header: { padding: theme.tokens.space.md, gap: theme.tokens.space.sm },
    listContent: { paddingHorizontal: theme.tokens.space.md, paddingBottom: theme.tokens.space.xl },
  }), [theme.mode]);

  return (
    <LayoutDefault title="Ngữ pháp">
      <View style={styles.header}>
        <SearchBar
          value={q}
          onChangeText={setQ}
          onSubmit={() => fetchPage(1)}
          placeholder="Tìm theo tiêu đề/mô tả/nội dung…"
        />

        <FilterBar
          jlptLevels={JLPTS}
          selected={jlpt}
          onSelect={(lv) => { setJlpt(lv as Grammar['jlptLevel']); fetchPage(1); }}
          sorts={['updatedAt', 'createdAt', 'title']}
          sort={sort}
          onSort={(s) => { setSort(s); fetchPage(1); }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <AddButton to={'/admin/content/grammar/create'} label="Thêm ngữ pháp" />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => it._id || it.title}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GrammarCard
            item={item}
            onDetail={() => router.push(`/admin/content/grammar/detail/${item._id}` as Href)}
            onEdit={() => router.push(`/admin/content/grammar/update/${item._id}` as Href)}
          />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListEmptyComponent={!loading ? <EmptyState label="Chưa có ngữ pháp"/> : null}
        ListFooterComponent={loading ? (
          <View style={{ paddingVertical: theme.tokens.space.lg }}>
            <ActivityIndicator color={theme.color.textSub} />
          </View>
        ) : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.textSub} />
        }
      />
    </LayoutDefault>
  );
}
