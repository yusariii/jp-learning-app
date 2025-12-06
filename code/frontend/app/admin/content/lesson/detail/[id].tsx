import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';

import LayoutDefault from '@/layout-default/layout-default';
import { getLesson, type Lesson } from '@/api/admin/content/lesson';
import { useAppTheme } from '@/hooks/use-app-theme';
import ContentCard from '@/components/card/ContentCard';
import BackButton from '@/components/ui/BackButton';
import LinkedContentList from '@/components/block/LinkedContentList';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getLesson(String(id));
        if (!alive) return;
        setLesson(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading || !lesson) {
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
            Đang tải…
          </Text>
        </View>
      </LayoutDefault>
    );
  }

  const anyLesson = lesson as any;

  const wordIds: string[] =
    (anyLesson.wordIds || []).map((x: any) => x.wordId).filter(Boolean);
  const readingIds: string[] =
    (anyLesson.readingIds || []).map((x: any) => x.readingId).filter(Boolean);
  const speakingIds: string[] =
    (anyLesson.speakingIds || []).map((x: any) => x.speakingId).filter(Boolean);
  const grammarIds: string[] =
    (anyLesson.grammarIds || []).map((x: any) => x.grammarId).filter(Boolean);
  const listeningIds: string[] =
    (anyLesson.listeningIds || [])
      .map((x: any) => x.listeningId)
      .filter(Boolean);

  return (
    <LayoutDefault title="Chi tiết bài học">
      <ScrollView
        contentContainerStyle={{
          padding: theme.tokens.space.md,
        }}
      >
        <BackButton
          fallbackHref="/admin/content/lesson"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />

        {/* THÔNG TIN CHÍNH */}
        <ContentCard>
          <Text style={theme.text.h1}>{lesson.title}</Text>

          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>
            Bài số: {lesson.lessonNumber ?? '—'}
          </Text>
          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>
            JLPT: {lesson.jlptLevel || '—'}
          </Text>
          <Text style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}>
            Trạng thái: {lesson.published ? 'Đã publish' : 'Nháp'}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: theme.tokens.space.sm,
              marginTop: theme.tokens.space.md,
            }}
          >
            <TouchableOpacity
              style={theme.button.primary.container}
              onPress={() =>
                router.push(
                  `/admin/content/lesson/update/${lesson._id}` as Href,
                )
              }
              hitSlop={theme.utils.hitSlop}
            >
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
          </View>
        </ContentCard>

        {/* MÔ TẢ */}
        <ContentCard>
          <Text style={theme.text.h2}>Mô tả</Text>
          <Text
            style={[
              theme.text.body,
              { marginTop: theme.tokens.space.xs },
            ]}
          >
            {lesson.description || 'Chưa có mô tả.'}
          </Text>
        </ContentCard>

        {/* NỘI DUNG LIÊN KẾT */}
        <ContentCard>
          <Text style={theme.text.h2}>Nội dung liên kết</Text>

          <LinkedContentList
            title="Từ vựng (Word)"
            apiPath="word"
            ids={wordIds}
            emptyText="Không có từ vựng được liên kết."
          />

          <LinkedContentList
            title="Bài đọc (Reading)"
            apiPath="reading"
            ids={readingIds}
            emptyText="Không có bài đọc được liên kết."
          />

          <LinkedContentList
            title="Luyện nói (Speaking)"
            apiPath="speaking"
            ids={speakingIds}
            emptyText="Không có speaking được liên kết."
          />

          <LinkedContentList
            title="Ngữ pháp (Grammar)"
            apiPath="grammar"
            ids={grammarIds}
            emptyText="Không có grammar được liên kết."
          />

          <LinkedContentList
            title="Luyện nghe (Listening)"
            apiPath="listening"
            ids={listeningIds}
            emptyText="Không có listening được liên kết."
          />
        </ContentCard>

        {/* THÔNG TIN KHÁC */}
        <ContentCard>
          <Text style={theme.text.h2}>Thông tin khác</Text>
          <Text
            style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}
          >
            Tạo:{' '}
            {anyLesson.createdAt
              ? new Date(anyLesson.createdAt).toLocaleString()
              : '—'}
          </Text>
          <Text
            style={[theme.text.meta, { marginTop: theme.tokens.space.xs }]}
          >
            Cập nhật:{' '}
            {anyLesson.updatedAt
              ? new Date(anyLesson.updatedAt).toLocaleString()
              : '—'}
          </Text>
        </ContentCard>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
