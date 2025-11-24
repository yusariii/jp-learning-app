import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { getListening, type Listening } from '../../../../../api/admin/content/listening';
import { useAppTheme } from '../../../../../hooks/use-app-theme';
import ContentCard from '../../../../../components/card/ContentCard';
import ListeningQuestionBlock from '../../../../../components/block/ListeningQuestionBlock';

export default function ListeningDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Listening | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const it = await getListening(String(id)); if (alive) setItem(it); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết bài nghe">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }

  if (!item) {
    return (
      <LayoutDefault title="Chi tiết bài nghe">
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
    <LayoutDefault title="Chi tiết bài nghe">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <ContentCard>
          <Text style={theme.text.h1}>{item.title}</Text>
          <Text style={[theme.text.link, { marginTop: theme.tokens.space.xs }]}>Audio: {item.audioUrl}</Text>
          {!!item.transcriptJP && (<>
            <Text style={[theme.text.h2, { marginTop: theme.tokens.space.md }]}>Transcript (JP)</Text>
            <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{item.transcriptJP}</Text>
          </>)}
          {!!item.transcriptEN && (<>
            <Text style={[theme.text.h2, { marginTop: theme.tokens.space.md }]}>Transcript (EN)</Text>
            <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{item.transcriptEN}</Text>
          </>)}
          <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
            <TouchableOpacity style={[theme.button.primary.container, { flex: 1 }]} onPress={() => router.push(`/admin/content/listening/edit/${item._id}` as Href)} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button.ghost.container} onPress={() => router.back()} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.ghost.label}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </ContentCard>

        <ContentCard>
          <Text style={theme.text.h2}>Câu hỏi nghe hiểu</Text>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            {item.questions?.length
              ? item.questions.map((q, i) => <ListeningQuestionBlock key={i} q={q as any} index={i} />)
              : <Text style={theme.text.secondary}>Chưa có câu hỏi.</Text>}
          </View>
        </ContentCard>

        <ContentCard>
          <Text style={theme.text.h2}>Thông tin khác</Text>
          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>Tạo: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</Text>
          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}</Text>
        </ContentCard>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
