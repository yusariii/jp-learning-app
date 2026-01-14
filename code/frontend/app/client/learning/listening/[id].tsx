import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '@/components/client/ui/BackButton';
import { getLessonListenings } from '@/api/client/lesson';
import { updateSectionProgress } from '@/api/client/user';
import { getUser } from '@/helpers/storage';

// Listening data from API
type ListeningItem = {
  _id: string;
  title: string;
  audioUrl: string;
  transcriptJP?: string;
  transcriptEN?: string;
  questions: Array<{
    questionJP: string;
    questionEN?: string;
    type: 'mcq' | 'fill_blank' | 'true_false' | 'short_answer';
    options?: Array<{ text: string; isCorrect: boolean }>;
    answer?: any;
  }>;
  difficulty?: string;
};

export default function ListeningLearningScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ListeningItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    if (!id) return;
    getLessonListenings(String(id))
      .then((res: any) => {
        setItems(res.listenings || []);
      })
      .catch((e: any) => {
        console.error('Failed to load listenings:', e);
        setItems([]);
      })
      .finally(() => setLoading(false));

    return () => {
      // Cleanup if needed
    };
  }, [id]);

  const currentItem = items[currentIndex];
  const currentQuestion = currentItem?.questions?.[currentQuestionIndex];

  // Auto-generate True/False options if needed
  const questionOptions = currentQuestion?.type === 'true_false' && (!currentQuestion.options || currentQuestion.options.length === 0)
    ? [
        { text: '正しい (Đúng)', isCorrect: currentQuestion.answer === true },
        { text: '間違い (Sai)', isCorrect: currentQuestion.answer === false }
      ]
    : currentQuestion?.options || [];

  const playAudio = async () => {
    try {
      // For now, just show alert since we don't have real audio
      Alert.alert('🎧 Phát âm thanh', currentItem?.transcriptJP || currentItem?.transcriptEN || 'No transcript');
      
      // Real implementation would be:
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   { uri: currentItem.audioUrl }
      // );
      // setSound(newSound);
      // await newSound.playAsync();
      
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể phát âm thanh');
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    const isTextType = currentQuestion?.type === 'short_answer' || currentQuestion?.type === 'fill_blank';
    
    if (isTextType) {
      if (!textAnswer.trim()) {
        Alert.alert('Thông báo', 'Vui lòng nhập câu trả lời');
        return;
      }
    } else {
      if (selectedAnswer === null) {
        Alert.alert('Thông báo', 'Vui lòng chọn câu trả lời');
        return;
      }
    }
    setShowResult(true);
  };

  const handleNext = () => {
    // Track correct answer before moving to next
    if (showResult && isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setTotalQuestions(prev => prev + 1);

    // Check if there are more questions in current listening item
    if (currentQuestion && currentQuestionIndex < currentItem.questions.length - 1) {
      setCurrentQuestionIndex(curr => curr + 1);
      setSelectedAnswer(null);
      setTextAnswer('');
      setShowResult(false);
    }
    // Move to next listening item
    else if (currentIndex < items.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTextAnswer('');
      setShowResult(false);
    } 
    // All done - show completion screen
    else {
      console.log('Completing listening practice...');
      // Mark listening section as completed
      if (id) {
        getUser().then(user => {
          if (!user?._id) return;
          const userId = user._id;
          return updateSectionProgress(String(id), 'listening', userId);
        })
          .then(() => console.log('Listening section completed'))
          .catch(e => console.error('Failed to update progress:', e));
      }
      setShowCompletion(true);
    }
  };

  if (loading) {
    return (
      <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  if (!currentItem || !currentQuestion) {
    return (
      <View style={[theme.surface.screen, { padding: 20 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <BackButton fallbackHref="/client/tabs" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="headset-outline" size={64} color={theme.color.textMeta} />
          <Text style={[theme.text.secondary, { marginTop: 16 }]}>
            Không có bài luyện nghe
          </Text>
        </View>
      </View>
    );
  }

  const correctAnswerIndex = questionOptions.findIndex((opt: any) => opt.isCorrect) ?? -1;
  
  // Check if text answer is correct (for short_answer/fill_blank types)
  const isTextCorrect = currentQuestion?.answer && textAnswer.trim().toLowerCase() === String(currentQuestion.answer).toLowerCase();
  
  const isCorrect = (currentQuestion?.type === 'short_answer' || currentQuestion?.type === 'fill_blank') 
    ? isTextCorrect 
    : selectedAnswer === correctAnswerIndex;

  // Show completion screen
  if (showCompletion) {
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    return (
      <View style={[theme.surface.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <LinearGradient
          colors={['#FF9800', '#F57C00']}
          style={styles.header}
        >
          <BackButton 
            fallbackHref="/client/tabs"
            containerStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            color="#fff"
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Hoàn thành!</Text>
          </View>
        </LinearGradient>

        <View style={styles.completionContainer}>
          <LinearGradient 
            colors={['#FF9800', '#F57C00']} 
            style={styles.completionCard}
          >
            <MaterialCommunityIcons name="trophy" size={80} color="#fff" />
            <Text style={styles.completionTitle}>Tuyệt vời!</Text>
            <Text style={styles.completionScore}>
              {correctAnswers}/{totalQuestions} câu đúng
            </Text>
            <Text style={styles.completionPercent}>{percentage}%</Text>
          </LinearGradient>

          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: theme.color.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.completeButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[theme.surface.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <LinearGradient
        colors={['#FF9800', '#F57C00']}
        style={styles.header}
      >
        <BackButton 
          fallbackHref="/client/tabs"
          containerStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          color="#fff"
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Luyện nghe 🎧</Text>
          <Text style={styles.headerProgress}>
            Bài {currentIndex + 1}/{items.length} - Câu {currentQuestionIndex + 1}/{currentItem.questions.length}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Audio Player */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.audioCard, { backgroundColor: theme.color.surface }]}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.color.primary }]}
            onPress={playAudio}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="headphones" size={48} color="#fff" />
          </TouchableOpacity>
          <Text style={[theme.text.h3, { marginTop: 16, textAlign: 'center' }]}>
            Nghe và trả lời câu hỏi
          </Text>
          <TouchableOpacity onPress={playAudio} style={styles.replayBtn}>
            <Ionicons name="reload" size={20} color={theme.color.primary} />
            <Text style={[theme.text.secondary, { color: theme.color.primary, marginLeft: 6 }]}>
              Nghe lại
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Question */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.questionSection}>
          <Text style={[theme.text.h3, { marginBottom: 16 }]}>
            {currentQuestion.questionJP}
            {currentQuestion.questionEN && (
              <Text style={[theme.text.secondary, { fontSize: 14 }]}>
                {'\n'}{currentQuestion.questionEN}
              </Text>
            )}
          </Text>

          {/* Text Input for short_answer / fill_blank */}
          {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'fill_blank') ? (
            <View style={styles.textAnswerContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.color.surface,
                    borderColor: showResult 
                      ? (isCorrect ? '#4CAF50' : '#F44336') 
                      : theme.color.border,
                    color: theme.color.text,
                  }
                ]}
                value={textAnswer}
                onChangeText={setTextAnswer}
                placeholder="Nhập câu trả lời..."
                placeholderTextColor={theme.color.textMeta}
                editable={!showResult}
                multiline={currentQuestion.type === 'short_answer'}
                numberOfLines={currentQuestion.type === 'short_answer' ? 3 : 1}
              />
              {showResult && (
                <View style={styles.correctAnswerHint}>
                  <Text style={[theme.text.secondary, { color: isCorrect ? '#4CAF50' : '#F44336' }]}>
                    {isCorrect ? '✓ Chính xác!' : `✗ Đáp án đúng: ${currentQuestion.answer}`}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {questionOptions.map((option: any, index: number) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = option.isCorrect;
                
                let bgColor = theme.color.surface;
                let borderColor = theme.color.border;
                let textColor = theme.color.text;

                if (showResult) {
                  if (isCorrectOption) {
                    bgColor = '#4CAF50' + '20';
                    borderColor = '#4CAF50';
                    textColor = '#4CAF50';
                  } else if (isSelected && !isCorrect) {
                    bgColor = '#F44336' + '20';
                    borderColor = '#F44336';
                    textColor = '#F44336';
                  }
                } else if (isSelected) {
                  bgColor = theme.color.primary + '20';
                  borderColor = theme.color.primary;
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionCard,
                      { backgroundColor: bgColor, borderColor }
                    ]}
                    onPress={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.optionNumber, { backgroundColor: borderColor }]}>
                      <Text style={[styles.optionNumberText, { color: '#fff' }]}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[theme.text.body, { flex: 1, color: textColor, fontWeight: isSelected ? '600' : '400' }]}>
                      {option.text}
                    </Text>
                    {showResult && isCorrectOption && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>

        {/* Result Feedback */}
        {showResult && (
          <Animated.View 
            entering={FadeInUp}
            style={[
              styles.resultCard,
              { 
                backgroundColor: isCorrect ? '#4CAF50' + '20' : '#F44336' + '20',
                borderColor: isCorrect ? '#4CAF50' : '#F44336'
              }
            ]}
          >
            <Ionicons 
              name={isCorrect ? "checkmark-circle" : "close-circle"} 
              size={32} 
              color={isCorrect ? '#4CAF50' : '#F44336'} 
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.text.h3, { color: isCorrect ? '#4CAF50' : '#F44336' }]}>
                {isCorrect ? 'Chính xác! 🎉' : 'Chưa đúng 😅'}
              </Text>
              <Text style={[theme.text.secondary, { marginTop: 4 }]}>
                {currentItem.transcriptJP || currentItem.transcriptEN || ''}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Bottom Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.color.surface, borderTopColor: theme.color.border }]}>
        {!showResult ? (
          <TouchableOpacity
            style={[
              styles.fullBtn, 
              { 
                backgroundColor: theme.color.primary, 
                opacity: (currentQuestion?.type === 'short_answer' || currentQuestion?.type === 'fill_blank') 
                  ? (textAnswer.trim() ? 1 : 0.5)
                  : (selectedAnswer === null ? 0.5 : 1)
              }
            ]}
            onPress={handleCheckAnswer}
            disabled={
              (currentQuestion?.type === 'short_answer' || currentQuestion?.type === 'fill_blank') 
                ? !textAnswer.trim()
                : selectedAnswer === null
            }
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>Kiểm tra</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.fullBtn, { backgroundColor: theme.color.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>
              {currentQuestionIndex < currentItem.questions.length - 1 
                ? 'Câu tiếp theo' 
                : currentIndex === items.length - 1 
                  ? 'Hoàn thành' 
                  : 'Bài tiếp theo'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
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
    flex: 1,
    padding: 20,
  },
  audioCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  playButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
  },
  questionSection: {
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionNumberText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 12,
  },
  textAnswerContainer: {
    gap: 8,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  correctAnswerHint: {
    padding: 8,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  fullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  completionContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionCard: {
    width: '100%',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  completionScore: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  completionPercent: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  completeButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
