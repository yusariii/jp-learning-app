import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { WordCard } from '@/components/client/WordCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonWords } from '@/api/client/lesson';
import type { WordItem } from '@/components/client/WordList';
import BackButton from '@/components/client/ui/BackButton';
import { updateSectionProgress } from '@/api/client/user';
import { getUser } from '@/helpers/storage';

export default function WordLearningScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!id) return;
    getLessonWords(String(id))
      .then((res) => {
        // Map words to card format
        const mapped = (res.words as WordItem[]).map((w) => ({
          id: w._id,
          kanji: w.kanji || w.termJP,
          hiragana: w.hiraKata || '',
          mean: w.meaningVI || w.meaningEN || '',
          example: w.examples?.[0]?.sentenceJP || '',
        }));
        setWords(mapped);
      })
      .catch((e) => setError(e?.message || 'Không tải được từ vựng'))
      .finally(() => setLoading(false));
  }, [id]);

  // Xử lý khi bấm nút (Next)
  const handleNext = (remembered: boolean) => {
    // Logic lưu kết quả (Todo: gọi API)
    console.log(remembered ? "Đã thuộc" : "Cần học lại");

    if (currentIndex < words.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      setFinished(true);
      // Mark vocab section as completed
      if (id) {
        getUser().then(user => {
          if (!user?._id) return;
          const userId = user._id;
          return updateSectionProgress(String(id), 'vocab', userId);
        })
          .then(() => console.log('Vocab section completed'))
          .catch(e => console.error('Failed to update progress:', e));
      }
    }
  };

  if (loading) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }
words
  if (error || !words.length) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <Text style={theme.text.secondary}>{error || 'Không có từ vựng nào'}</Text>
        <TouchableOpacity 
          style={[theme.button.primary.container, { marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <Text style={theme.button.primary.label}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  if (finished) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <Ionicons name="trophy" size={80} color="#FFD700" />
        <Text style={[theme.text.h2, { marginTop: 20 }]}>Hoàn thành!</Text>
        <Text style={theme.text.body}>Bạn đã học xong {words.length} từ.</Text>
        <TouchableOpacity 
          style={[theme.button.primary.container, { marginTop: 30, width: 200 }]}
          onPress={() => router.back()}
        >
          <Text style={theme.button.primary.label}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[theme.surface.screen, { backgroundColor: '#F5F5F5' }]}>
      <Stack.Screen options={{ title: `Từ vựng (${currentIndex + 1}/${words.length})`, headerTintColor: theme.color.text }} />

      <BackButton 
        fallbackHref="/client/tabs"
        containerStyle={{ position: 'absolute', top: insets.top + 10, left: 16, zIndex: 10 }}
      />

      <View style={[styles.cardContainer, { paddingTop: insets.top + 20 }]}>
        {/* Render Card với Animation thay đổi */}
        <Animated.View 
          key={currentWord.id} // Key thay đổi để trigger animation
          entering={FadeInRight.duration(300)}
          exiting={FadeOutLeft.duration(300)}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <WordCard data={currentWord} />
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionContainer, { paddingBottom: insets.bottom + 20 }]}>
        
        {/* Nút Chưa Thuộc (Màu Đỏ) */}
        <TouchableOpacity 
          style={[styles.btn, styles.btnAh, { borderColor: theme.color.danger }]}
          onPress={() => handleNext(false)}
        >
          <Ionicons name="close" size={32} color={theme.color.danger} />
          <Text style={[styles.btnText, { color: theme.color.danger }]}>Chưa thuộc</Text>
        </TouchableOpacity>

        {/* Nút Đã Thuộc (Màu Xanh) */}
        <TouchableOpacity 
          style={[styles.btn, styles.btnOh, { backgroundColor: theme.color.success, borderColor: theme.color.success }]}
          onPress={() => handleNext(true)}
        >
          <Ionicons name="checkmark" size={32} color="#fff" />
          <Text style={[styles.btnText, { color: '#fff' }]}>Đã thuộc</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    gap: 8,
    minWidth: 140,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  btnAh: { backgroundColor: '#fff' }, // Nút "Chưa thuộc" nền trắng
  btnOh: { }, // Nút "Đã thuộc" nền màu (đã set inline)
  btnText: { fontWeight: '700', fontSize: 16 }
});