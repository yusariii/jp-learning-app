import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import BackButton from '@/components/client/ui/BackButton';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getSpeakingByLesson } from '@/api/client/speaking';
import { updateSectionProgress } from '@/api/client/user';
import { getUser } from '@/helpers/storage';

export default function SpeakingScreen() {
  const { theme } = useAppTheme();
  const colors = theme.color;
  const { id } = useLocalSearchParams(); // This is lessonId
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState<any>(null);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [completedPrompts, setCompletedPrompts] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (id) {
      loadSpeaking();
    }
  }, [id]);

  const loadSpeaking = async () => {
    try {
      setLoading(true);
      const data = await getSpeakingByLesson(String(id));
      // Get first speaking exercise from the list
      if (data.speakings && data.speakings.length > 0) {
        setSpeaking(data.speakings[0]);
        setCompletedPrompts(new Array(data.speakings[0].prompts.length).fill(false));
      } else {
        setSpeaking(null);
      }
    } catch (error) {
      console.error('Error loading speaking:', error);
      setSpeaking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Khi dừng recording, đánh dấu là hoàn thành
      const newCompleted = [...completedPrompts];
      newCompleted[currentPrompt] = true;
      setCompletedPrompts(newCompleted);
    }
  };

  const handleNext = () => {
    if (currentPrompt < speaking.prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setIsRecording(false);
    } else {
      // Mark speaking section as completed
      if (id) {
        getUser().then(user => {
          if (!user?._id) return;
          const userId = user._id;
          return updateSectionProgress(String(id), 'speaking', userId);
        })
          .then(() => console.log('Speaking section completed'))
          .catch(e => console.error('Failed to update progress:', e));
      }
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1);
      setIsRecording(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Luyện nói',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerLeft: () => <BackButton />,
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!speaking) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Luyện nói',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerLeft: () => <BackButton />,
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.textSub }]}>
            Không tìm thấy bài luyện nói
          </Text>
        </View>
      </View>
    );
  }

  if (showResults) {
    const completed = completedPrompts.filter(Boolean).length;
    const total = speaking.prompts.length;

    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Kết quả',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerLeft: () => <BackButton />,
          }}
        />
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <LinearGradient colors={['#00BCD4', '#0097A7']} style={styles.resultsCard}>
            <MaterialCommunityIcons name="check-decagram" size={80} color="#fff" />
            <Text style={styles.resultsTitle}>Tuyệt vời!</Text>
            <Text style={styles.resultsScore}>
              Đã hoàn thành {completed}/{total} câu
            </Text>
          </LinearGradient>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const prompt = speaking.prompts[currentPrompt];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: speaking.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerLeft: () => <BackButton />,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Guidance */}
        <View style={[styles.guidanceBox, { backgroundColor: colors.primary + '15' }]}>
          <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
          <Text style={[styles.guidanceText, { color: colors.text }]}>
            {speaking.guidance}
          </Text>
        </View>

        {/* Progress */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: colors.textSub }]}>
              Câu {currentPrompt + 1}/{speaking.prompts.length}
            </Text>
            <View style={styles.dotsContainer}>
              {speaking.prompts.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        idx === currentPrompt
                          ? colors.primary
                          : completedPrompts[idx]
                          ? colors.success
                          : colors.textMeta,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Prompt Card */}
        <LinearGradient
          colors={['#00BCD4' + '15', colors.surface]}
          style={[styles.card, styles.promptCard]}
        >
          <View style={styles.promptHeader}>
            <MaterialCommunityIcons name="microphone" size={28} color={colors.primary} />
          </View>

          <Text style={[styles.promptJP, { color: colors.text }]}>{prompt.promptJP}</Text>
          <Text style={[styles.promptEN, { color: colors.textSub }]}>{prompt.promptEN}</Text>
        </LinearGradient>

        {/* Sample Answer */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color={colors.primary} />
            <Text style={[styles.sampleTitle, { color: colors.text }]}>Câu mẫu tham khảo</Text>
          </View>
          <Text style={[styles.sampleText, { color: colors.textSub }]}>
            {prompt.expectedSample}
          </Text>
        </View>

        {/* Recording Button */}
        <TouchableOpacity
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording ? colors.danger : colors.primary,
            },
          ]}
          onPress={handleRecord}
        >
          <MaterialCommunityIcons
            name={isRecording ? 'stop' : 'microphone'}
            size={32}
            color="#fff"
          />
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
          </Text>
        </TouchableOpacity>

        {completedPrompts[currentPrompt] && (
          <View style={[styles.completedBox, { backgroundColor: colors.success + '15' }]}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={[styles.completedText, { color: colors.success }]}>
              Đã hoàn thành câu này
            </Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentPrompt > 0 && (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: colors.textMeta }]}
              onPress={handlePrevious}
            >
              <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
              <Text style={styles.navButtonText}>Quay lại</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              {
                backgroundColor: completedPrompts[currentPrompt] ? colors.primary : colors.textMeta,
                opacity: completedPrompts[currentPrompt] ? 1 : 0.5,
              },
            ]}
            onPress={handleNext}
            disabled={!completedPrompts[currentPrompt]}
          >
            <Text style={styles.navButtonText}>
              {currentPrompt < speaking.prompts.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  guidanceBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  guidanceText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  promptCard: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  promptHeader: {
    marginBottom: 16,
  },
  promptJP: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  promptEN: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sampleTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sampleText: {
    fontSize: 16,
    lineHeight: 24,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  resultsCard: {
    width: '100%',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  resultsScore: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
