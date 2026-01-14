import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonGrammars } from '@/api/client/lesson';
import type { GrammarItem } from '@/components/client/GrammarList';
import BackButton from '@/components/client/ui/BackButton';
import { updateSectionProgress } from '@/api/client/user';
import { getUser } from '@/helpers/storage';

export default function GrammarLearningScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  const [grammars, setGrammars] = useState<GrammarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedExamples, setExpandedExamples] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!id) return;
    getLessonGrammars(String(id))
      .then((res: any) => {
        setGrammars(res.grammars || []);
      })
      .catch((e: any) => setError(e?.message || 'Không tải được ngữ pháp'))
      .finally(() => setLoading(false));
  }, [id]);

  const currentGrammar = grammars[currentIndex];

  const handleNext = () => {
    if (currentIndex < grammars.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setExpandedExamples(new Set());
    } else {
      // Mark grammar section as completed
      if (id) {
        getUser().then(user => {
          if (!user?._id) return;
          const userId = user._id;
          return updateSectionProgress(String(id), 'grammar', userId);
        })
          .then(() => console.log('Grammar section completed'))
          .catch(e => console.error('Failed to update progress:', e));
      }
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
      setExpandedExamples(new Set());
    }
  };

  const toggleExample = (idx: number) => {
    setExpandedExamples(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  if (error || !grammars.length) {
    return (
      <View style={[theme.surface.screen, { padding: 20 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <BackButton fallbackHref="/client/tabs" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.color.textMeta} />
          <Text style={[theme.text.secondary, { marginTop: 16, textAlign: 'center' }]}>
            {error || 'Không có ngữ pháp nào'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[theme.surface.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.color.primary, theme.color.link]}
        style={styles.header}
      >
        <BackButton 
          fallbackHref="/client/tabs"
          containerStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          color="#fff"
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ngữ pháp</Text>
          <Text style={styles.headerProgress}>{currentIndex + 1} / {grammars.length}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown} style={[styles.card, { backgroundColor: theme.color.surface }]}>
          {/* Grammar Title */}
          <View style={styles.titleSection}>
            <MaterialCommunityIcons name="chat-processing" size={32} color={theme.color.primary} />
            <Text style={[theme.text.h2, { marginLeft: 12 }]}>{currentGrammar.title}</Text>
          </View>

          {/* Description */}
          {currentGrammar.description && (
            <View style={[styles.section, { backgroundColor: theme.color.surfaceAlt, padding: 16, borderRadius: 12 }]}>
              <Text style={theme.text.body}>{currentGrammar.description}</Text>
            </View>
          )}

          {/* Explanation */}
          <View style={styles.section}>
            <Text style={[theme.text.h3, { marginBottom: 8 }]}>📖 Giải thích</Text>
            <Text style={theme.text.body}>{currentGrammar.explanationJP}</Text>
            {currentGrammar.explanationEN && (
              <Text style={[theme.text.secondary, { marginTop: 8 }]}>{currentGrammar.explanationEN}</Text>
            )}
          </View>

          {/* Examples */}
          {currentGrammar.examples && currentGrammar.examples.length > 0 && (
            <View style={styles.section}>
              <Text style={[theme.text.h3, { marginBottom: 12 }]}>💡 Ví dụ</Text>
              {currentGrammar.examples.map((ex: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.exampleCard, { backgroundColor: theme.color.bg, borderColor: theme.color.border }]}
                  onPress={() => toggleExample(idx)}
                  activeOpacity={0.7}
                >
                  <View style={styles.exampleHeader}>
                    <Text style={[theme.text.body, { flex: 1, fontWeight: '600' }]}>
                      {ex.sentenceJP}
                    </Text>
                    <Ionicons 
                      name={expandedExamples.has(idx) ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme.color.textMeta} 
                    />
                  </View>
                  {expandedExamples.has(idx) && (
                    <View style={{ marginTop: 8 }}>
                      {ex.readingKana && (
                        <Text style={[theme.text.secondary, { fontSize: 14, marginBottom: 4 }]}>
                          {ex.readingKana}
                        </Text>
                      )}
                      {ex.meaningVI && (
                        <Text style={[theme.text.body, { color: theme.color.primary }]}>
                          {ex.meaningVI}
                        </Text>
                      )}
                      {ex.meaningEN && (
                        <Text style={[theme.text.secondary, { marginTop: 4 }]}>
                          {ex.meaningEN}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* JLPT Level */}
          {currentGrammar.jlptLevel && (
            <View style={[styles.jlptBadge, { backgroundColor: theme.color.primary + '20' }]}>
              <Text style={[theme.text.secondary, { color: theme.color.primary, fontWeight: '600' }]}>
                JLPT {currentGrammar.jlptLevel}
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomBar, { backgroundColor: theme.color.surface, borderTopColor: theme.color.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: currentIndex === 0 ? theme.color.surfaceAlt : theme.color.primary }]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? theme.color.textMeta : '#fff'} />
          <Text style={[styles.navBtnText, { color: currentIndex === 0 ? theme.color.textMeta : '#fff' }]}>
            Trước
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: theme.color.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.navBtnText, { color: '#fff' }]}>
            {currentIndex === grammars.length - 1 ? 'Hoàn thành' : 'Tiếp'}
          </Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  headerContent: {
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerProgress: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  exampleCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jlptBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  navBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
