import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';

import LayoutDefault from '../../../../../layout-default/layout-default';
import { getLesson, type Lesson, } from '../../../../../api/admin/content/lesson';
import { useAppTheme } from '../../../../../hooks/use-app-theme';

import ContentCard from '../../../../../components/card/ContentCard';

export default function LessonDetailScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<Lesson | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await getLesson(String(id));
                if (alive) setItem(data);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    if (loading) {
        return (
            <LayoutDefault title="Chi tiết lesson">
                <View style={{ padding: theme.tokens.space.md }}>
                    <ActivityIndicator color={theme.color.textSub} />
                    <Text
                        style={[
                            theme.text.secondary,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Đang tải...
                    </Text>
                </View>
            </LayoutDefault>
        );
    }

    if (!item) {
        return (
            <LayoutDefault title="Chi tiết lesson">
                <View style={{ padding: theme.tokens.space.md }}>
                    <Text style={theme.text.body}>
                        Không tìm thấy dữ liệu.
                    </Text>
                    <View style={{ height: theme.tokens.space.sm }} />
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={theme.button.ghost.container}
                        hitSlop={theme.utils.hitSlop}
                    >
                        <Text style={theme.button.ghost.label}>
                            ← Quay lại
                        </Text>
                    </TouchableOpacity>
                </View>
            </LayoutDefault>
        );
    }

    const wordIds = item.wordIds || [];
    const readingIds = item.readingIds || [];
    const speakingIds = item.speakingIds || [];
    const grammarIds = item.grammarIds || [];
    const listeningIds = item.listeningIds || [];

    return (
        <LayoutDefault title="Chi tiết lesson">
            <ScrollView
                contentContainerStyle={{
                    padding: theme.tokens.space.md,
                    gap: theme.tokens.space.md,
                }}
            >
                {/* Thông tin chính */}
                <ContentCard>
                    <Text style={theme.text.h1}>
                        #{item.lessonNumber} · {item.title}
                    </Text>

                    {!!item.jlptLevel && (
                        <Text
                            style={[
                                theme.text.meta,
                                { marginTop: theme.tokens.space.xs },
                            ]}
                        >
                            JLPT: {item.jlptLevel}
                        </Text>
                    )}

                    {typeof item.durationMinutes === 'number' && (
                        <Text
                            style={[
                                theme.text.meta,
                                { marginTop: theme.tokens.space.xs },
                            ]}
                        >
                            Thời lượng: ~{item.durationMinutes} phút
                        </Text>
                    )}

                    <Text
                        style={[
                            theme.text.meta,
                            { marginTop: theme.tokens.space.xs },
                        ]}
                    >
                        Trạng thái: {item.published ? 'Public' : 'Nháp'}
                    </Text>

                    {!!item.description && (
                        <>
                            <Text
                                style={[
                                    theme.text.h2,
                                    { marginTop: theme.tokens.space.md },
                                ]}
                            >
                                Mô tả
                            </Text>
                            <Text
                                style={[
                                    theme.text.body,
                                    { marginTop: theme.tokens.space.xs },
                                ]}
                            >
                                {item.description}
                            </Text>
                        </>
                    )}

                    {!!(item.tags && item.tags.length) && (
                        <>
                            <Text
                                style={[
                                    theme.text.h2,
                                    { marginTop: theme.tokens.space.md },
                                ]}
                            >
                                Tags
                            </Text>
                            <Text
                                style={[
                                    theme.text.body,
                                    { marginTop: theme.tokens.space.xs },
                                ]}
                            >
                                {item.tags.join(', ')}
                            </Text>
                        </>
                    )}

                    <View
                        style={{
                            flexDirection: 'row',
                            gap: theme.tokens.space.sm,
                            marginTop: theme.tokens.space.md,
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                theme.button.primary.container,
                                { flex: 1 },
                            ]}
                            onPress={() =>
                                router.push(
                                    `/admin/content/lesson/update/${item._id}` as Href,
                                )
                            }
                            hitSlop={theme.utils.hitSlop}
                        >
                            <Text style={theme.button.primary.label}>Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={theme.button.ghost.container}
                            onPress={() => router.back()}
                            hitSlop={theme.utils.hitSlop}
                        >
                            <Text style={theme.button.ghost.label}>Quay lại</Text>
                        </TouchableOpacity>
                    </View>
                </ContentCard>

                {/* Liên kết nội dung */}
                <ContentCard>
                    <Text style={theme.text.h2}>Liên kết nội dung</Text>

                    <Text
                        style={[
                            theme.text.body,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Words ({wordIds.length}):
                    </Text>
                    <Text style={theme.text.meta}>
                        {wordIds.map((w) => w.wordId).join(', ') || '—'}
                    </Text>

                    <Text
                        style={[
                            theme.text.body,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Readings ({readingIds.length}):
                    </Text>
                    <Text style={theme.text.meta}>
                        {readingIds
                            .map((r) => r.readingId)
                            .join(', ') || '—'}
                    </Text>

                    <Text
                        style={[
                            theme.text.body,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Speakings ({speakingIds.length}):
                    </Text>
                    <Text style={theme.text.meta}>
                        {speakingIds
                            .map((s) => s.speakingId)
                            .join(', ') || '—'}
                    </Text>

                    <Text
                        style={[
                            theme.text.body,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Grammars ({grammarIds.length}):
                    </Text>
                    <Text style={theme.text.meta}>
                        {grammarIds
                            .map((g) => g.grammarId)
                            .join(', ') || '—'}
                    </Text>

                    <Text
                        style={[
                            theme.text.body,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Listenings ({listeningIds.length}):
                    </Text>
                    <Text style={theme.text.meta}>
                        {listeningIds
                            .map((l) => l.listeningId)
                            .join(', ') || '—'}
                    </Text>
                </ContentCard>

                {/* Thông tin hệ thống */}
                <ContentCard>
                    <Text style={theme.text.h2}>Thông tin khác</Text>
                    <Text
                        style={[
                            theme.text.meta,
                            { marginTop: theme.tokens.space.xs },
                        ]}
                    >
                        Tạo:{' '}
                        {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : '—'}
                    </Text>
                    <Text
                        style={[
                            theme.text.meta,
                            { marginTop: theme.tokens.space.xs },
                        ]}
                    >
                        Cập nhật:{' '}
                        {item.updatedAt
                            ? new Date(item.updatedAt).toLocaleString()
                            : '—'}
                    </Text>
                </ContentCard>

                <View style={{ height: theme.tokens.space.xl }} />
            </ScrollView>
        </LayoutDefault>
    );
}
