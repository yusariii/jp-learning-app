import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getGrammar, type Grammar } from '../../../../../api/admin/content/grammar';
import { useAppTheme } from '../../../../../hooks/use-app-theme';

export default function GrammarDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Grammar | null>(null);

  useEffect(() => {
    let m = true;
    (async () => {
      try { const w = await getGrammar(String(params.id)); if (m) setItem(w); }
      finally { if (m) setLoading(false); }
    })();
    return () => { m = false; };
  }, [params.id]);

  const styles = useMemo(() => StyleSheet.create({
    container: { padding: theme.tokens.space.md },
    section: { ...theme.surface.card, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.md },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, flexWrap: 'wrap' },
    line: { marginTop: theme.tokens.space.xs },
  }), [theme.mode]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết ngữ pháp">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }

  if (!item) {
    return (
      <LayoutDefault title="Chi tiết ngữ pháp">
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
    <LayoutDefault title="Chi tiết ngữ pháp">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={theme.text.h1}>{item.title}</Text>
            {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
          </View>
          {!!item.description && <Text style={[theme.text.secondary, styles.line]}>{item.description}</Text>}
          <Text style={[theme.text.h2, { marginTop: theme.tokens.space.md }]}>Giải thích (JP)</Text>
          <Text style={[theme.text.body, styles.line]}>{item.explanationJP}</Text>
          {!!item.explanationEN && (
            <>
              <Text style={[theme.text.h2, { marginTop: theme.tokens.space.md }]}>Explanation (EN)</Text>
              <Text style={[theme.text.body, styles.line]}>{item.explanationEN}</Text>
            </>
          )}
          <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
            <TouchableOpacity
              style={[theme.button.primary.container, { flex: 1 }]}
              onPress={() => router.push(`/admin/content/grammar/edit/${item._id}` as any)}
              hitSlop={theme.utils.hitSlop}
            >
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button.ghost.container} onPress={() => router.back()} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.ghost.label}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={theme.text.h2}>Ví dụ</Text>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            {item.examples?.length ? item.examples.map((ex, i) => (
              <View key={i} style={{
                backgroundColor: theme.color.bgSubtle,
                borderRadius: theme.tokens.radius.md,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.color.border,
                padding: theme.tokens.space.md,
                marginBottom: theme.tokens.space.sm,
              }}>
                {!!ex.sentenceJP && <Text style={theme.text.title}>{ex.sentenceJP}</Text>}
                {!!ex.readingKana && <Text style={[theme.text.secondary, styles.line]}>{ex.readingKana}</Text>}
                {!!ex.meaningVI && <Text style={[theme.text.body, styles.line]}>{ex.meaningVI}</Text>}
                {!!ex.meaningEN && <Text style={[theme.text.secondary, styles.line]}>{ex.meaningEN}</Text>}
              </View>
            )) : <Text style={theme.text.secondary}>Chưa có ví dụ.</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={theme.text.h2}>Thông tin khác</Text>
          <Text style={[theme.text.meta, styles.line]}>Tạo: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</Text>
          <Text style={[theme.text.meta, styles.line]}>Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}</Text>
        </View>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
