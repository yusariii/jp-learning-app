// app/admin/content/test/detail/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';

import LayoutDefault from '@/layout-default/layout-default';
import { useAppTheme } from '@/hooks/use-app-theme';
import ContentCard from '@/components/card/ContentCard';
import { getTest, type TestDoc } from '@/api/admin/content/test';
import BackButton from '@/components/ui/BackButton';

function QAList({ qs }: { qs: any[] }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ marginTop: theme.tokens.space.sm, gap: 8 }}>
      {qs?.length ? qs.map((q, idx) => (
        <View key={idx} style={{
          backgroundColor: theme.color.bgSubtle,
          borderRadius: theme.tokens.radius.md,
          borderWidth: 1, borderColor: theme.color.border,
          padding: theme.tokens.space.md, gap: 6,
        }}>
          <Text style={theme.text.meta}>Q{idx + 1}</Text>
          {!!q.contextJP && <Text style={theme.text.secondary}>{q.contextJP}</Text>}
          <Text style={theme.text.title}>{q.questionText}</Text>
          {!!q.mediaUrl && <Text style={theme.text.link}>Media: {q.mediaUrl}</Text>}
          <View style={{ marginTop: 6 }}>
            {q.options?.map((op: any, i: number) => (
              <Text key={i} style={i === q.correctIndex ? { ...theme.text.body, fontWeight: '700' as const } : theme.text.body}>
                • {(op.label || String.fromCharCode(65 + i))}. {op.text}
              </Text>
            ))}
          </View>
          <Text style={theme.text.meta}>Điểm: {q.points ?? 1}</Text>
        </View>
      )) : <Text style={theme.text.secondary}>Chưa có câu hỏi.</Text>}
    </View>
  );
}

export default function TestDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<TestDoc | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const it = await getTest(String(id)); if (alive) setItem(it); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết đề thi">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }
  if (!item) {
    return (
      <LayoutDefault title="Chi tiết đề thi">
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
    <LayoutDefault title="Chi tiết đề thi">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/content/test"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.xs }}>
            <Text style={theme.text.h1}>{item.title}</Text>
          </View>

          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>
            Tổng thời gian: {item.totalTime ?? '—'} phút ・ Trạng thái: {item.published ? 'Published' : 'Draft'}
          </Text>
          {!!item.description && <Text style={[theme.text.body, { marginTop: theme.tokens.space.sm }]}>{item.description}</Text>}

          <View style={{ marginTop: theme.tokens.space.md }}>
            <Text style={theme.text.h2}>Thời gian từng phần</Text>
            <Text style={theme.text.body}>• 文字・語彙: {item.vocabSection?.totalTime ?? '—'} phút</Text>
            <Text style={theme.text.body}>• 文法・読解: {item.grammarReadingSection?.totalTime ?? '—'} phút</Text>
            <Text style={theme.text.body}>• 聴解: {item.listeningSection?.totalTime ?? '—'} phút</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
            <TouchableOpacity style={[theme.button.primary.container, { flex: 1 }]} onPress={() => router.push(`/admin/content/test/edit/${item._id}` as Href)} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button.ghost.container} onPress={() => router.back()} hitSlop={theme.utils.hitSlop}>
              <Text style={theme.button.ghost.label}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </ContentCard>

        {/* Vocab: Units -> Questions */}
        <ContentCard>
          <Text style={theme.text.h2}>文字・語彙 (Vocabulary)</Text>
          {(item.vocabSection?.vocabUnits || []).length ? (
            <View style={{ marginTop: theme.tokens.space.sm, gap: theme.tokens.space.md }}>
              {item.vocabSection!.vocabUnits.map((u: any, ui: number) => (
                <ContentCard key={`v-${ui}`}>
                  <Text style={theme.text.h3}>Bài #{ui + 1}{u.title ? ` — ${u.title}` : ''}</Text>
                  {!!u.instructionsJP && <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{u.instructionsJP}</Text>}
                  {!!u.instructionsEN && <Text style={theme.text.secondary}>{u.instructionsEN}</Text>}
                  <QAList qs={u.questions || []} />
                </ContentCard>
              ))}
            </View>
          ) : <Text style={theme.text.secondary}>Chưa có bài.</Text>}
        </ContentCard>

        {/* Grammar: Units -> Questions */}
        <ContentCard>
          <Text style={theme.text.h2}>文法 (Grammar)</Text>
          {(item.grammarReadingSection?.grammarUnits || []).length ? (
            <View style={{ marginTop: theme.tokens.space.sm, gap: theme.tokens.space.md }}>
              {item.grammarReadingSection!.grammarUnits.map((u: any, ui: number) => (
                <ContentCard key={`g-${ui}`}>
                  <Text style={theme.text.h3}>Bài #{ui + 1}{u.title ? ` — ${u.title}` : ''}</Text>
                  {!!u.instructionsJP && <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{u.instructionsJP}</Text>}
                  {!!u.instructionsEN && <Text style={theme.text.secondary}>{u.instructionsEN}</Text>}
                  <QAList qs={u.questions || []} />
                </ContentCard>
              ))}
            </View>
          ) : <Text style={theme.text.secondary}>Chưa có bài.</Text>}
        </ContentCard>

        {/* Reading: Units -> Passages -> Questions */}
        <ContentCard>
          <Text style={theme.text.h2}>読解 (Reading)</Text>
          {(item.grammarReadingSection?.readingUnits || []).length ? (
            <View style={{ marginTop: theme.tokens.space.sm, gap: theme.tokens.space.md }}>
              {item.grammarReadingSection!.readingUnits.map((u: any, ui: number) => (
                <ContentCard key={`runit-${ui}`}>
                  <Text style={theme.text.h3}>Bài #{ui + 1}{u.title ? ` — ${u.title}` : ''}</Text>
                  {!!u.instructionsJP && <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{u.instructionsJP}</Text>}
                  {!!u.instructionsEN && <Text style={theme.text.secondary}>{u.instructionsEN}</Text>}

                  {(u.passages || []).length ? (
                    <View style={{ marginTop: theme.tokens.space.sm, gap: theme.tokens.space.md }}>
                      {u.passages.map((g: any, gi: number) => (
                        <ContentCard key={`rp-${gi}`}>
                          <Text style={theme.text.h3}>Đoạn #{gi + 1}{g.title ? ` — ${g.title}` : ''}</Text>
                          <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{g.passageJP}</Text>
                          {!!g.passageEN && <Text style={theme.text.secondary}>{g.passageEN}</Text>}
                          <QAList qs={g.questions || []} />
                        </ContentCard>
                      ))}
                    </View>
                  ) : <Text style={theme.text.secondary}>Bài này chưa có đoạn.</Text>}
                </ContentCard>
              ))}
            </View>
          ) : <Text style={theme.text.secondary}>Chưa có bài.</Text>}
        </ContentCard>

        {/* Listening: Units -> URL -> Questions */}
        <ContentCard>
          <Text style={theme.text.h2}>聴解 (Listening)</Text>
          {(item.listeningSection?.listeningUnits || []).length ? (
            <View style={{ marginTop: theme.tokens.space.sm, gap: theme.tokens.space.md }}>
              {item.listeningSection!.listeningUnits.map((u: any, ui: number) => (
                <ContentCard key={`l-${ui}`}>
                  <Text style={theme.text.h3}>Bài #{ui + 1}{u.title ? ` — ${u.title}` : ''}</Text>
                  {!!u.instructionsJP && <Text style={[theme.text.body, { marginTop: theme.tokens.space.xs }]}>{u.instructionsJP}</Text>}
                  {!!u.instructionsEN && <Text style={theme.text.secondary}>{u.instructionsEN}</Text>}
                  {!!u.mediaUrl && <Text style={[theme.text.link, { marginTop: theme.tokens.space.xs }]}>Media URL: {u.mediaUrl}</Text>}
                  <QAList qs={u.questions || []} />
                </ContentCard>
              ))}
            </View>
          ) : <Text style={theme.text.secondary}>Chưa có bài.</Text>}
        </ContentCard>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
