import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-app-theme';
import { LessonNode } from '@/components/client/LessonNode'; 
import { listLessons } from '@/api/client/lesson';
import TabScreenLayout from '@/components/client/TabScreenLayout';
import { getUser } from '@/helpers/storage';

const { width } = Dimensions.get('window');

export default function LearningMapScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID first, then fetch lessons with progress
    getUser()
      .then((user) => {
        const userId = user?.id || user?._id;
        return listLessons({ limit: 50, userId });
      })
      .then((res) => {
        // Map lessons to node data with progress from API
        const mapped = res.data.map((lesson: any, i: number) => ({
          id: lesson._id,
          title: lesson.title,
          // DEMO MODE: Auto-unlock all lessons
          status: lesson.userProgress?.status || (i === 0 ? 'active' : 'locked'),
          stars: lesson.userProgress?.stars || 0,
        }));
        setLessons(mapped);
      })
      .catch((e) => {
        console.error('Failed to load lessons:', e);
        // Fallback: try without userId
        return listLessons({ limit: 50 })
          .then((res) => {
            const mapped = res.data.map((lesson: any, i: number) => ({
              id: lesson._id,
              title: lesson.title,
              // DEMO MODE: First lesson active, rest locked but clickable
              status: i === 0 ? 'active' : 'locked',
              stars: 0,
            }));
            setLessons(mapped);
          })
          .catch((e) => setError(e?.message || 'Không tải được danh sách bài học'));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={theme.text.secondary}>{error}</Text>
      </View>
    );
  }

  return (
    <TabScreenLayout title="Lộ trình học" hideBottomBar={false}>
      <View style={theme.surface.screen}>
      <LinearGradient colors={[theme.color.bg, theme.color.surfaceAlt]} style={StyleSheet.absoluteFill} />

      {/* Header đơn giản (Có thể tách thành Component Header riêng nếu muốn gọn hơn nữa) */}
      <View style={styles.header}>
         {/* ... (Code header giữ nguyên hoặc tách ra) ... */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          {/* Đường Path vẽ ở background */}
          <View style={[styles.path, { backgroundColor: theme.game.pathColor, width: theme.game.pathWidth }]} />

          {/* Render danh sách nút */}
          {lessons.map((lesson, index) => {
            // Logic Zic-zac tính toán ở đây để truyền xuống
            const isLeft = index % 2 === 0;
            const xOffset = isLeft ? -width / 4 : width / 4;

            return (
              <LessonNode
                key={lesson.id}
                data={lesson}
                index={index}
                xOffset={xOffset}
                onPress={(id) => router.push(`/client/learning/lesson/${id}` as any)}
              />
            );
          })}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      </View>
    </TabScreenLayout>
  );
}

// Style giờ đây rất ngắn, chỉ chứa layout chung
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
    // ...
  },
  scrollContent: {
    paddingTop: 20,
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    alignItems: 'center',
  },
  path: {
    position: 'absolute',
    top: 40,
    bottom: 0,
    borderRadius: 4,
    opacity: 0.5,
  },
});