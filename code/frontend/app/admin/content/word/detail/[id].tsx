import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getWord, type Word } from '../../../../../api/admin/content/word';
import { useAppTheme } from '../../../../../hooks/use-app-theme';

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
        if (mounted) setItem(w as Word);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params.id]);

  const styles = useMemo(() => StyleSheet.create({
    container: { padding: theme.tokens.space.md },
    section: { ...theme.surface.card, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.md },

    headerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, flexWrap: 'wrap' },
    row: { flexDirection: 'row', gap: theme.tokens.space.sm, flexWrap: 'wrap' },
    line: { marginTop: theme.tokens.space.xs },

    tagChip: {
      ...theme.chip.container,
      height: theme.chip.height,
      backgroundColor: theme.color.surfaceAlt,
      borderColor: theme.color.border,
      borderWidth: 1,
    },

    actions: { flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md },
  }), [theme.mode]);

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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Thông tin chính */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={theme.text.h1}>{item.termJP}</Text>
            {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
          </View>

          {!!item.hiraKata && <Text style={[theme.text.secondary, styles.line]}>{item.hiraKata}</Text>}
          {!!item.romaji && <Text style={[theme.text.secondary, styles.line]}>{item.romaji}</Text>}

          {!!item.meaningVI && (
            <Text style={[{ ...theme.text.body, fontWeight: '600' as const }, styles.line]}>
              {item.meaningVI}
            </Text>
          )}
          {!!item.meaningEN && <Text style={[theme.text.secondary, styles.line]}>{item.meaningEN}</Text>}
          {!!item.kanji && <Text style={[theme.text.secondary, styles.line]}>Kanji: {item.kanji}</Text>}
          {!!item.audioUrl && <Text style={[theme.text.link, styles.line]}>Audio: {item.audioUrl}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[theme.button.primary.container, { flex: 1 }]}
              onPress={() => router.push(`/admin/content/word/edit/${item._id}` as Parameters<typeof router.push>[0])}
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
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={theme.text.h2}>Tags</Text>
          <View style={[styles.row, { marginTop: theme.tokens.space.sm }]}>
            {item.tags?.length
              ? item.tags.map((t) => (
                  <View key={t} style={styles.tagChip}>
                    <Text style={theme.chip.label}>{t}</Text>
                  </View>
                ))
              : <Text style={theme.text.secondary}>Không có tag</Text>}
          </View>
        </View>

        {/* Ví dụ minh hoạ */}
        <View style={styles.section}>
          <Text style={theme.text.h2}>Ví dụ minh hoạ</Text>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            {item.examples?.length ? item.examples.map((ex, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: theme.color.bgSubtle,
                  borderRadius: theme.tokens.radius.md,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.color.border,
                  padding: theme.tokens.space.md,
                  marginBottom: theme.tokens.space.sm,
                }}
              >
                {!!ex.sentenceJP && <Text style={theme.text.title}>{ex.sentenceJP}</Text>}
                {!!ex.readingKana && <Text style={[theme.text.secondary, styles.line]}>{ex.readingKana}</Text>}
                {!!ex.meaningVI && <Text style={[theme.text.body, styles.line]}>{ex.meaningVI}</Text>}
              </View>
            )) : (
              <Text style={theme.text.secondary}>Chưa có ví dụ.</Text>
            )}
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={theme.text.h2}>Thông tin khác</Text>
          <Text style={[theme.text.meta, styles.line]}>
            Tạo: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
          </Text>
          <Text style={[theme.text.meta, styles.line]}>
            Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}
          </Text>
        </View>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
