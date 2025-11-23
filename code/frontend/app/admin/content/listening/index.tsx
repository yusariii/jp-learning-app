import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';

import LayoutDefault from '../../../../layout-default/layout-default';
import { useAppTheme } from '../../../../hooks/use-app-theme'
import { listListenings, type Listening } from '../../../../api/admin/content/listening';

import SearchBar from '../../../../components/ui/SearchBar';
import FilterBar, { type SortKey } from '../../../../components/list/FilterBar';
import ContentCard from '../../../../components/card/ContentCard';
import Chip from '../../../../components/ui/Chip';
import AddButton from '../../../../components/ui/AddButton';
import EmptyState from '../../../../components/ui/EmptyState';

type ApiList = { data: Listening[]; page: number; limit: number; total: number };
const LIMIT = 20;
const DIFFS: Array<Listening['difficulty'] | ''> = ['', 'easy', 'medium', 'hard'];

export default function ListListeningScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();

    const [q, setQ] = useState('');
    const [difficulty, setDifficulty] = useState<'' | Listening['difficulty']>('');
    const [sort, setSort] = useState<SortKey>('updatedAt');

    const [data, setData] = useState<Listening[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const reachedEndRef = useRef(false);

    const fetchPage = useCallback(async (p: number, append = false) => {
        setLoading(true);
        try {
            const res: ApiList = await listListenings({ page: p, limit: LIMIT, q: q.trim() || undefined, difficulty: difficulty || undefined, sort: (sort as any) || 'updatedAt' }) as any;
            append ? setData(prev => [...prev, ...res.data]) : setData(res.data);
            setPage(res.page); setTotal(res.total);
            reachedEndRef.current = res.data.length < LIMIT || res.page * LIMIT >= res.total;
        } finally { setLoading(false); setRefreshing(false); }
    }, [q, difficulty, sort]);

    useEffect(() => { fetchPage(1); }, [fetchPage]);
    const onRefresh = useCallback(() => { setRefreshing(true); reachedEndRef.current = false; fetchPage(1); }, [fetchPage]);
    const onEndReached = useCallback(() => { if (loading || reachedEndRef.current) return; const next = page + 1; fetchPage(next, true); setPage(next); }, [loading, page, fetchPage]);

    const styles = useMemo(() => ({
        header: { padding: theme.tokens.space.md, gap: theme.tokens.space.sm },
        listContent: { paddingHorizontal: theme.tokens.space.md, paddingBottom: theme.tokens.space.xl },
    }), [theme.mode]);

    return (
        <LayoutDefault title="Nghe hiểu">
            <View style={styles.header}>
                <SearchBar value={q} onChangeText={setQ} onSubmit={() => fetchPage(1)} placeholder="Tìm tiêu đề/bản ghi/câu hỏi…" />
                <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, flexWrap: 'wrap' }}>
                    {DIFFS.map(d => <Chip key={d || 'all'} label={d || 'All'} active={(difficulty || '') === d} onPress={() => { setDifficulty(d as any); fetchPage(1); }} />)}
                </View>
                <FilterBar jlptLevels={['' as any]} selected={'' as any} onSelect={() => { }} sorts={['updatedAt', 'createdAt', 'title']} sort={sort} onSort={(s) => { setSort(s); fetchPage(1); }} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <AddButton to={'/admin/content/listening/create' as Href} label="Thêm bài nghe" />
                </View>
            </View>

            <FlatList
                data={data}
                keyExtractor={(it) => it._id || it.title}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <ContentCard>
                        <Text style={theme.text.title} numberOfLines={1}>{item.title}</Text>
                        <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]} numberOfLines={1}>Audio: {item.audioUrl}</Text>
                        <View style={{ marginTop: theme.tokens.space.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={theme.text.meta}>{item.updatedAt ? `Cập nhật: ${new Date(item.updatedAt).toLocaleString()}` : ''}</Text>
                            <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
                                <TouchableOpacity onPress={() => router.push(`/admin/content/listening/detail/${item._id}` as Href)} style={theme.button.ghost.container}><Text style={theme.button.ghost.label}>Chi tiết</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push(`/admin/content/listening/update/${item._id}` as Href)} style={theme.button.primary.container}><Text style={theme.button.primary.label}>Sửa</Text></TouchableOpacity>
                            </View>
                        </View>
                    </ContentCard>
                )}
                onEndReachedThreshold={0.2}
                onEndReached={onEndReached}
                ListEmptyComponent={!loading ? <EmptyState label="Chưa có bài nghe" /> : null}
                ListFooterComponent={loading ? <View style={{ paddingVertical: theme.tokens.space.lg }}><ActivityIndicator color={theme.color.textSub} /></View> : null}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.textSub} />}
            />
        </LayoutDefault>
    );
}
