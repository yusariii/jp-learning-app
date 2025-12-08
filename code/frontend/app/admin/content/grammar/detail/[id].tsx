import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { getGrammar, deleteGrammar, type Grammar } from '@/api/admin/content/grammar';
import { useAppTheme } from '@/hooks/use-app-theme';
import ContentCard from '@/components/card/ContentCard';
import ExampleBlock from '@/components/block/ExampleBlock';
import BackButton from '@/components/ui/BackButton';
import DeleteButton from '@/components/ui/DeleteButton';
import { appAlert } from '@/helpers/appAlert';

export default function GrammarDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Grammar | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const g = await getGrammar(String(params.id));
        if (mounted) setItem(g);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params.id]);

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
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/content/grammar"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, flexWrap: 'wrap' }}>
            <Text style={theme.text.h1}>{item.title}</Text>
            {!!item.jlptLevel && <Text style={theme.badge.jlpt(item.jlptLevel)}>{item.jlptLevel}</Text>}
          </View>

          {!!item.description && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.description}</Text>}

          <Text style={[theme.text.h2, { marginTop: theme.tokens.space.md }]}>Giải thích (JP)</Text>
          <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{item.explanationJP}</Text>

          {!!item.explanationEN && (
            <>
              <Text style={[theme.text.h2, { marginTop: theme.tokens.space.md }]}>Explanation (EN)</Text>
              <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{item.explanationEN}</Text>
            </>
          )}

          <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
            <TouchableOpacity
              style={[theme.button.primary.container, { flex: 1 }]}
              onPress={() => router.push(`/admin/content/grammar/update/${item._id}` as Href)}
              hitSlop={theme.utils.hitSlop}
            >
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
            <DeleteButton
              variant="solid"
              label="Xoá"
              onConfirm={async () => {
                await deleteGrammar(item._id!);
                appAlert('Đã xoá');
                router.back();
              }}
            />

          </View>
        </ContentCard>

        <ContentCard>
          <Text style={theme.text.h2}>Ví dụ</Text>
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
