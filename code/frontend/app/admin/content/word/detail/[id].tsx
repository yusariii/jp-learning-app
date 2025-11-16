import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { getWord, type Word } from '../../../../../api/admin/content/word';
import { useAppTheme } from '../../../../../hooks/use-app-theme'
import ContentCard from '../../../../../components/card/ContentCard'
import TagPills from '../../../../../components/ui/TagPills';
import ExampleBlock from '../../../../../components/ui/ExampleBlock';

export default function WordDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Word | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const w = await getWord(String(params.id));
        if (mounted) setItem(w);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params.id]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết từ vựng">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }

  if (!item) {
    return (
      <LayoutDefault title="Chi tiết từ vựng">
        <View style={{ padding: theme.tokens.space.md }}>
          <Text style={theme.text.body}>Không tìm thấy dữ liệu.</Text>
          <View style={{ height: theme.tokens.space.sm }} />
          <TouchableOpacity onPress={() => router.back()} style={theme.button.ghost.container} hitSlop={theme.utils.hitSlop}>
            <Text style={theme.button.ghost.label}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Chi tiết từ vựng">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <ContentCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, flexWrap: 'wrap' }}>
            <Text style={theme.text.h1}>{item.termJP}</Text>
            {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
          </View>

          {!!item.hiraKata && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.hiraKata}</Text>}
          {!!item.romaji && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.romaji}</Text>}

          {!!item.meaningVI && <Text style={[{ ...theme.text.body, fontWeight: '600' as const }, { marginTop: theme.tokens.space.xs }]}>{item.meaningVI}</Text>}
          {!!item.meaningEN && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.meaningEN}</Text>}
          {!!item.kanji && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>Kanji: {item.kanji}</Text>}
          {!!item.audioUrl && <Text style={[theme.text.link, { marginTop: theme.tokens.space.xs }]}>Audio: {item.audioUrl}</Text>}

          <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
            <TouchableOpacity
              style={[theme.button.primary.container, { flex: 1 }]}
              onPress={() => router.push(`/admin/content/word/edit/${item._id}` as Href)}
              hitSlop={theme.utils.hitSlop}
            >
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button.ghost.container} onPress={() => router.back()} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.ghost.label}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </ContentCard>

        <ContentCard>
          <Text style={theme.text.h2}>Tags</Text>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            {item.tags?.length ? <TagPills tags={item.tags} /> : <Text style={theme.text.secondary}>Không có tag</Text>}
          </View>
        </ContentCard>

        <ContentCard>
          <Text style={theme.text.h2}>Ví dụ minh hoạ</Text>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            {item.examples?.length ? (
              item.examples.map((ex, i) => <ExampleBlock key={i} ex={ex} index={i} />)
            ) : (
              <Text style={theme.text.secondary}>Chưa có ví dụ.</Text>
            )}
          </View>
        </ContentCard>

        <ContentCard>
          <Text style={theme.text.h2}>Thông tin khác</Text>
          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>
            Tạo: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
          </Text>
          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>
            Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}
          </Text>
        </ContentCard>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
