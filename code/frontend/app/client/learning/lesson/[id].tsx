import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import WordList from '@/components/client/WordList';
import GrammarList from '@/components/client/GrammarList';
import { getLessonDetail } from '@/api/client/lesson';
import BackButton from '@/components/client/ui/BackButton';
import { getUserProgress } from '@/api/client/user';
import { getUser } from '@/helpers/storage';

// Mock data các phần trong bài học
const SECTIONS = [
  { id: 'vocab', title: 'Từ vựng', icon: 'cards', color: '#4CAF50', route: 'word-swipe' },
  { id: 'grammar', title: 'Ngữ pháp', icon: 'chat-processing', color: '#2196F3', route: 'grammar' },
  { id: 'listening', title: 'Luyện nghe', icon: 'headphones', color: '#FF9800', route: 'listening' },
  { id: 'reading', title: 'Đọc hiểu', icon: 'book-open-page-variant', color: '#9C27B0', route: 'reading' },
  { id: 'speaking', title: 'Luyện nói', icon: 'microphone', color: '#00BCD4', route: 'speaking' },
  { id: 'quiz', title: 'Kiểm tra', icon: 'sword-cross', color: '#E91E63', route: '/client/quiz' },
];

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams(); // Lấy ID bài học từ URL
  const { theme } = useAppTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  const loadLessonData = () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    getUser().then(currentUser => {
      console.log('[Lesson] Current user from storage:', currentUser);
      if (!currentUser?._id) {
        console.log('[Lesson] No user found, using fallback');
        // Fallback to allow testing without login
        const userId = '677b8f9e1c5d4e3a2b1c9d8f';
        return Promise.all([
          getLessonDetail(String(id)),
          getUserProgress(userId)
        ]);
      }
      const userId = currentUser._id;
      console.log('[Lesson] Using logged in user:', userId);
      return Promise.all([
        getLessonDetail(String(id)),
        getUserProgress(userId)
      ]);
    })
      .then(([lessonData, progressData]) => {
        setDetail(lessonData);
        // Find progress for this lesson
        const progress = progressData.progress.find((p: any) => p.lessonId === String(id));
        console.log('[Lesson] Progress for this lesson:', progress);
        setLessonProgress(progress);
      })
      .catch((e) => {
        setError(e?.message || 'Không tải được dữ liệu bài học');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLessonData();
  }, [id]);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('[Lesson] Screen focused, reloading data...');
      loadLessonData();
    }, [id])
  );

  return (
    <View style={theme.surface.screen}>
      {/* Cấu hình Header riêng cho màn hình này */}
      <Stack.Screen
        options={{
          title: detail?.lesson?.title || 'Bài học',
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Header Background */}
      <View style={styles.headerBg}>
        <LinearGradient
          colors={[theme.color.primary, theme.color.link]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <BackButton 
          fallbackHref="/client/tabs"
          containerStyle={{ position: 'absolute', top: 50, left: 16, backgroundColor: 'rgba(255,255,255,0.25)' }}
          color="#fff"
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{detail?.lesson?.title || 'Bài học'}</Text>
          {detail?.lesson?.description ? (
            <Text style={styles.headerSub}>{detail.lesson.description}</Text>
          ) : null}
          {detail?.lesson?.jlptLevel ? (
            <Text style={styles.headerSub}>JLPT: {detail.lesson.jlptLevel}</Text>
          ) : null}
        </View>
      </View>

      {/* Nội dung bài học + Danh sách nhiệm vụ */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading && (
          <ActivityIndicator size="large" color={theme.color.primary} style={{ marginTop: 16 }} />
        )}

        {error && !loading && (
          <Text style={[theme.text.secondary, { color: theme.color.danger, marginBottom: 12 }]}>
            {error}
          </Text>
        )}

        {detail && !loading && (
          <>
            {/* Thông tin bài học */}
            <View style={styles.lessonInfo}>
              <Text style={[theme.text.h2, { marginBottom: 4 }]}>{detail.lesson.title}</Text>
              {detail.lesson.description ? (
                <Text style={theme.text.secondary}>{detail.lesson.description}</Text>
              ) : null}
              
              {/* Stars Display */}
              {lessonProgress && (
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= (lessonProgress.stars || 0) ? 'star' : 'star-outline'}
                      size={24}
                      color={star <= (lessonProgress.stars || 0) ? '#FFD700' : theme.color.textMeta}
                    />
                  ))}
                  <Text style={[theme.text.meta, { marginLeft: 8 }]}>
                    {lessonProgress.stars || 0}/5 hoàn thành
                  </Text>
                </View>
              )}
            </View>

            {/* Từ vựng từ model Word */}
            <WordList words={detail.words || []} />

            {/* Ngữ pháp từ model Grammar */}
            <GrammarList grammars={detail.grammars || []} />
          </>
        )}

        {/* Danh sách nhiệm vụ */}
        <View style={styles.grid}>
          {SECTIONS.map((section, index) => {
            const sectionKey = section.id === 'vocab' ? 'vocab' 
              : section.id === 'grammar' ? 'grammar' 
              : section.id === 'listening' ? 'listening'
              : section.id === 'reading' ? 'reading'
              : section.id === 'speaking' ? 'speaking'
              : null;
            const isCompleted = sectionKey && lessonProgress?.completedSections?.[sectionKey];
            
            return (
              <Animated.View
                key={section.id}
                entering={FadeInDown.delay(index * 100).springify()}
                style={styles.cardWrapper}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.card, { backgroundColor: theme.color.surface }]}
                  onPress={() => {
                    if (section.id === 'quiz') {
                      router.push('/client/quiz' as any);
                    } else {
                      router.push(`/client/learning/${section.route}/${id}` as any);
                    }
                  }}
                >
                  <View style={[styles.iconBox, { backgroundColor: section.color + '20' }]}>
                    <MaterialCommunityIcons name={section.icon as any} size={32} color={section.color} />
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      </View>
                    )}
                  </View>
                  <Text style={[theme.text.title, { marginTop: 12 }]}>{section.title}</Text>
                  <Text style={theme.text.meta}>
                    {isCompleted ? 'Đã hoàn thành ✓' : 'Chưa hoàn thành'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    height: 250,
    justifyContent: 'flex-end',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20 },
  lessonInfo: { marginBottom: 16 },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardWrapper: {
    width: '47%', // Chia đôi màn hình
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 60, height: 60,
    borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});