import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { getSpeaking, type Speaking } from '@/api/admin/content/speaking';
import { useAppTheme } from '@/hooks/use-app-theme';
import ContentCard from '@/components/card/ContentCard';
import BackButton from '@/components/ui/BackButton';

export default function SpeakingDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Speaking | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getSpeaking(String(id));
        if (alive) setItem(s);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết chủ đề nói">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }

  if (!item) {
    return (
      <LayoutDefault title="Chi tiết chủ đề nói">
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
    <LayoutDefault title="Chi tiết chủ đề nói">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/content/speaking"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <Text style={theme.text.h1}>{item.title}</Text>
          {!!item.guidance && <Text style={[theme.text.body, { marginTop: theme.tokens.space.sm }]}>{item.guidance}</Text>}
          {!!item.sampleAudioUrl && (
            <Text style={[theme.text.link, { marginTop: theme.tokens.space.xs }]}>Sample Audio: {item.sampleAudioUrl}</Text>
          )}

          <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
            <TouchableOpacity
              style={[theme.button.primary.container, { flex: 1 }]}
              onPress={() => router.push(`/admin/content/speaking/update/${item._id}` as Href)}
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
          <Text style={theme.text.h2}>Prompts</Text>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            {item.prompts?.length ? item.prompts.map((p, i) => (
              <View key={i} style={{
                backgroundColor: theme.color.bgSubtle,
                borderRadius: theme.tokens.radius.md,
                borderWidth: 1, borderColor: theme.color.border,
                padding: theme.tokens.space.md, marginBottom: theme.tokens.space.sm,
              }}>
                <Text style={theme.text.meta}>#{i + 1}</Text>
                {!!p.promptJP && <Text style={[theme.text.title, { marginTop: theme.tokens.space.xs }]}>{p.promptJP}</Text>}
                {!!p.promptEN && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{p.promptEN}</Text>}
                {!!p.expectedSample && <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{p.expectedSample}</Text>}
              </View>
            )) : <Text style={theme.text.secondary}>Chưa có prompt.</Text>}
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
