import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, Href } from 'expo-router';

import LayoutDefault from '@/layout-default/layout-default';
import { listLessons, type Lesson, } from '@/api/admin/content/lesson';
import { useAppTheme } from '@/hooks/use-app-theme';

import SearchBar from '@/components/ui/SearchBar';
import FilterBar, { type SortKey, } from '@/components/list/FilterBar';
import ContentCard from '@/components/card/ContentCard';
import AddButton from '@/components/ui/AddButton';
import EmptyState from '@/components/ui/EmptyState';
import BackButton from '@/components/ui/BackButton';

const PAGE_SIZE = 20;

type JLPT = '' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export default function LessonListScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();

    const [q, setQ] = useState('');
    const [jlpt, setJlpt] = useState<JLPT>('');
    const [sort, setSort] = useState<SortKey>('updatedAt');

    const [data, setData] = useState<Lesson[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [noMore, setNoMore] = useState(false);

    const fetchPage = useCallback(
        async (p: number, append = false) => {
            if (append) setLoadingMore(true);
            else setLoading(true);
            try {
                const res = await listLessons({
                    page: p,
                    limit: PAGE_SIZE,
                    q: q.trim() || undefined,
                    jlptLevel: jlpt || undefined,
                    sort: (sort as any) || 'updatedAt',
                });

                if (append) {
                    setData((prev) => [...prev, ...res.data]);
                } else {
                    setData(res.data);
                }
                setPage(res.page);
                setTotal(res.total);

                const loaded = (res.page - 1) * res.limit + res.data.length;
                setNoMore(loaded >= res.total || res.data.length < res.limit);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
            }
        },
        [q, jlpt, sort],
    );

    useEffect(() => {
        fetchPage(1, false);
    }, [fetchPage]);

    const onSearch = () => {
        setNoMore(false);
        fetchPage(1, false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        setNoMore(false);
        fetchPage(1, false);
    };

    const onEndReached = () => {
        if (loading || loadingMore || noMore) return;
        const next = page + 1;
        fetchPage(next, true);
    };

    const styles = useMemo(() => ({
        header: { padding: theme.tokens.space.md, gap: theme.tokens.space.sm },
        listContent: { paddingHorizontal: theme.tokens.space.md, paddingBottom: theme.tokens.space.xl },
    }), [theme.mode]);

    const renderItem = ({ item }: { item: Lesson }) => {
        const counts = {
            word: item.wordIds?.length || 0,
            reading: item.readingIds?.length || 0,
            speaking: item.speakingIds?.length || 0,
            grammar: item.grammarIds?.length || 0,
            listening: item.listeningIds?.length || 0,
        };

        return (
            <ContentCard>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.tokens.space.sm,
                    }}
                >
                    <Text style={theme.text.title} numberOfLines={1}>
                        #{item.lessonNumber} · {item.title}
                    </Text>
                    {!!item.jlptLevel && (
                        <Text style={theme.badge.jlpt(item.jlptLevel)}>
                            {item.jlptLevel}
                        </Text>
                    )}
                </View>

                {!!item.description && (
                    <Text
                        style={[
                            theme.text.secondary,
                            { marginTop: theme.tokens.space.xs },
                        ]}
                        numberOfLines={2}
                    >
                        {item.description}
                    </Text>
                )}

                <Text
                    style={[
                        theme.text.meta,
                        { marginTop: theme.tokens.space.sm },
                    ]}
                >
                    W:{counts.word} · R:{counts.reading} · S:{counts.speaking} ·
                    G:{counts.grammar} · L:{counts.listening}
                </Text>

                <Text
                    style={[
                        theme.text.meta,
                        { marginTop: theme.tokens.space.xs },
                    ]}
                >
                    {item.updatedAt
                        ? `Sửa: ${new Date(
                            item.updatedAt,
                        ).toLocaleString()}`
                        : item.createdAt
                            ? `Tạo: ${new Date(
                                item.createdAt,
                            ).toLocaleString()}`
                            : ''}
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: theme.tokens.space.sm,
                        marginTop: theme.tokens.space.sm,
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            router.push(
                                `/admin/content/lesson/detail/${item._id}` as Href,
                            )
                        }
                        style={theme.button.ghost.container}
                        hitSlop={theme.utils.hitSlop}
                    >
                        <Text style={theme.button.ghost.label}>Chi tiết</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(
                                `/admin/content/lesson/update/${item._id}` as Href,
                            )
                        }
                        style={theme.button.primary.container}
                        hitSlop={theme.utils.hitSlop}
                    >
                        <Text style={theme.button.primary.label}>Sửa</Text>
                    </TouchableOpacity>
                </View>
            </ContentCard>
        );
    };

    return (
        <LayoutDefault title="Bài học">
            <View
                style={styles.header}
            >
                <BackButton
                    fallbackHref="/admin"
                    containerStyle={{ marginBottom: theme.tokens.space.sm }}
                />
                <SearchBar
                    value={q}
                    onChangeText={setQ}
                    onSubmit={onSearch}
                    placeholder="Tìm theo tiêu đề / mô tả"
                />

                <FilterBar
                    jlptLevels={['', 'N5', 'N4', 'N3', 'N2', 'N1']}
                    selected={jlpt}
                    onSelect={(lv) => {
                        setJlpt(lv as JLPT);
                        setNoMore(false);
                        fetchPage(1, false);
                    }}
                    sorts={['updatedAt', 'createdAt', 'title']}
                    sort={sort}
                    onSort={(s) => {
                        setSort(s);
                        setNoMore(false);
                        fetchPage(1, false);
                    }}
                />

                <AddButton
                    to={'/admin/content/lesson/create' as Href}
                    label="Thêm lesson"
                />
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => String(item._id)}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: theme.tokens.space.md,
                    paddingTop: theme.tokens.space.sm,
                    paddingBottom: theme.tokens.space.xl,
                }}
                ListEmptyComponent={
                    !loading ? (
                        <EmptyState label="Chưa có lesson nào" />
                    ) : null
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View
                            style={{
                                paddingVertical: theme.tokens.space.sm,
                            }}
                        >
                            <ActivityIndicator color={theme.color.textSub} />
                        </View>
                    ) : null
                }
                onEndReachedThreshold={0.2}
                onEndReached={onEndReached}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.color.textSub}
                    />
                }
            />

            {loading && data.length === 0 && (
                <View
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator color={theme.color.textSub} />
                </View>
            )}
        </LayoutDefault>
    );
}
