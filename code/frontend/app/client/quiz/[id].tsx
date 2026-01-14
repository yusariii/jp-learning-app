import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { getTestDetail, submitTest, TestDetail } from '@/api/client/test';
import BackButton from '@/components/client/ui/BackButton';
import { QuestionCard } from '@/components/client/QuestionCard';
import { ProgressBar } from '@/components/client/ProgressBar';
import { appAlert } from '@/helpers/appAlert';

export default function QuizDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const { theme } = useAppTheme();
  const router = useRouter();

  const titleStr = Array.isArray(title) ? title[0] : (title || 'Bài test');
  const idStr = Array.isArray(id) ? id[0] : String(id);

  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState<'vocab' | 'grammar' | 'listening'>('vocab');

  useEffect(() => {
    if (!idStr) return;
    loadTest();
  }, [idStr]);

  const loadTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestDetail(idStr);
      setTest(data.test);
    } catch (e: any) {
      setError(e?.message || 'Không tải được bài test');
    } finally {
      setLoading(false);
    }
  };

  // Get all questions for current section
  const currentQuestions = useMemo(() => {
    if (!test) return [];

    const questions: any[] = [];

    if (currentSection === 'vocab') {
      test.vocabSection?.vocabUnits?.forEach((unit) => {
        unit.questions?.forEach((q, idx) => {
          questions.push({
            id: `vocab-${unit._id}-${idx}`,
            ...q,
            unitTitle: unit.title,
            unitInstructions: unit.instructionsJP,
          });
        });
      });
    } else if (currentSection === 'grammar') {
      // Grammar units
      test.grammarReadingSection?.grammarUnits?.forEach((unit) => {
        unit.questions?.forEach((q, idx) => {
          questions.push({
            id: `gram-${unit._id}-${idx}`,
            ...q,
            unitTitle: unit.title,
            unitInstructions: unit.instructionsJP,
          });
        });
      });

      // Reading units
      test.grammarReadingSection?.readingUnits?.forEach((unit) => {
        unit.passages?.forEach((passage) => {
          passage.questions?.forEach((q, idx) => {
            questions.push({
              id: `read-${passage._id}-${idx}`,
              ...q,
              passageJP: passage.passageJP,
              unitTitle: passage.title,
              unitInstructions: unit.instructionsJP,
            });
          });
        });
      });
    } else if (currentSection === 'listening') {
      test.listeningSection?.listeningUnits?.forEach((unit) => {
        unit.questions?.forEach((q, idx) => {
          questions.push({
            id: `listen-${unit._id}-${idx}`,
            ...q,
            mediaUrl: unit.mediaUrl,
            unitTitle: unit.title,
            unitInstructions: unit.instructionsJP,
          });
        });
      });
    }

    return questions;
  }, [test, currentSection]);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = useMemo(() => {
    return (test?.vocabSection?.vocabUnits?.reduce((sum, u) => sum + (u.questions?.length || 0), 0) || 0) +
           (test?.grammarReadingSection?.grammarUnits?.reduce((sum, u) => sum + (u.questions?.length || 0), 0) || 0) +
           (test?.grammarReadingSection?.readingUnits?.reduce((sum, u) => sum + u.passages?.reduce((s, p) => s + (p.questions?.length || 0), 0) || 0, 0) || 0) +
           (test?.listeningSection?.listeningUnits?.reduce((sum, u) => sum + (u.questions?.length || 0), 0) || 0);
  }, [test]);

  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      appAlert('Thông báo', `Bạn chưa trả lời hết câu hỏi (${answeredCount}/${totalQuestions})`);
      return;
    }

    try {
      setSubmitting(true);
      const result = await submitTest(idStr, answers);
      
      router.push(`/client/quiz/result?testId=${idStr}&scorePercent=${result.scorePercent}&passed=${result.passed}&totalScore=${result.totalScore}&totalPoints=${result.totalPoints}` as any);
    } catch (e: any) {
      appAlert('Lỗi', e?.message || 'Không thể nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  if (error || !test) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <Text style={[theme.text.h2, { color: theme.color.danger }]}>Lỗi</Text>
        <Text style={[theme.text.body, { marginTop: 8 }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={theme.surface.screen}>
      <Stack.Screen
        options={{
          title: titleStr,
          headerTransparent: true,
          headerTintColor: '#fff',
        }}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.color.primary }]}>
        <BackButton
          fallbackHref="/client/quiz"
          containerStyle={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          color="#fff"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerTime}>⏱️ {test.totalTime} phút</Text>
        </View>
      </View>

      {/* Section Tabs */}
      <View style={[styles.sectionTabs, { borderBottomColor: theme.color.border }]}>
        {(['vocab', 'grammar', 'listening'] as const).map((section) => (
          <TouchableOpacity
            key={section}
            style={[
              styles.tab,
              currentSection === section && [
                styles.tabActive,
                { borderBottomColor: theme.color.primary },
              ],
            ]}
            onPress={() => setCurrentSection(section)}
          >
            <Text
              style={[
                theme.text.body,
                currentSection === section && { color: theme.color.primary, fontWeight: '600' },
              ]}
            >
              {section === 'vocab' ? '📚 Từ vựng' : section === 'grammar' ? '✏️ Ngữ pháp' : '🎧 Nghe'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Questions */}
      <ScrollView contentContainerStyle={styles.content}>
        {currentQuestions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            questionNumber={idx + 1}
            questionText={q.questionText}
            contextJP={q.contextJP}
            passageJP={q.passageJP}
            options={q.options || []}
            selectedIndex={answers[q.id]}
            onSelectOption={(optIdx) => handleSelectAnswer(q.id, optIdx)}
          />
        ))}

        {/* Progress and Submit */}
        <View style={[styles.progressCard, { backgroundColor: theme.color.surface, borderColor: theme.color.border }]}>
          <Text style={[theme.text.body, { marginBottom: 12 }]}>
            Tiến độ: <Text style={{ fontWeight: 'bold' }}>{answeredCount}/{totalQuestions}</Text> câu
          </Text>
          <ProgressBar current={answeredCount} total={totalQuestions} />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: theme.color.primary }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>
                Nộp bài ({answeredCount}/{totalQuestions})
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  progressCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
});
