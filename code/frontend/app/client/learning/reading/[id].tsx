import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import BackButton from '@/components/client/ui/BackButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getReadingByLesson } from '@/api/client/reading';
import { updateSectionProgress } from '@/api/client/user';
import { getUser } from '@/helpers/storage';

export default function ReadingScreen() {
  const { theme } = useAppTheme();
  const colors = theme.color;
  const { id } = useLocalSearchParams(); // This is lessonId
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reading, setReading] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);
  const [showQuestionResult, setShowQuestionResult] = useState(false);

  useEffect(() => {
    if (id) {
      loadReading();
    }
  }, [id]);

  const loadReading = async () => {
    try {
      setLoading(true);
      const data = await getReadingByLesson(String(id));
      // Get first reading from the list
      if (data.readings && data.readings.length > 0) {
        setReading(data.readings[0]);
      } else {
        setReading(null);
      }
    } catch (error) {
      console.error('Error loading reading:', error);
      setReading(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (showQuestionResult) return;
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleTextAnswer = (text: string) => {
    if (showQuestionResult) return;
    setAnswers({ ...answers, [currentQuestion]: text });
  };

  const handleCheckAnswer = () => {
    const currentAnswer = answers[currentQuestion];
    if (currentAnswer === undefined || currentAnswer === null || currentAnswer === '') {
      return;
    }
    setShowQuestionResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < reading.comprehension.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowQuestionResult(false);
    } else {
      // Mark reading section as completed
      if (id) {
        getUser().then(user => {
          if (!user?._id) return;
          const userId = user._id;
          return updateSectionProgress(String(id), 'reading', userId);
        })
          .then(() => console.log('Reading section completed'))
          .catch(e => console.error('Failed to update progress:', e));
      }
      setShowResults(true);
    }
  };

  const isCurrentQuestionCorrect = () => {
    if (!reading) return false;
    const q = reading.comprehension[currentQuestion];
    const userAnswer = answers[currentQuestion];
    
    if (q.type === 'mcq') {
      return q.options && q.options[userAnswer]?.isCorrect;
    } else {
      return userAnswer?.toLowerCase().trim() === q.answer?.toLowerCase().trim();
    }
  };

  const calculateScore = () => {
    if (!reading) return 0;
    let correct = 0;
    reading.comprehension.forEach((q: any, idx: number) => {
      if (q.type === 'mcq') {
        if (q.options && q.options[answers[idx]]?.isCorrect) correct++;
      } else {
        if (answers[idx]?.toLowerCase().trim() === q.answer?.toLowerCase().trim()) correct++;
      }
    });
    return correct;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Đọc hiểu',
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

  if (!reading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Đọc hiểu',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerLeft: () => <BackButton />,
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.textSub }]}>
            Không tìm thấy bài đọc
          </Text>
        </View>
      </View>
    );
  }

  const question = reading.comprehension[currentQuestion];

  if (showResults) {
    const score = calculateScore();
    const total = reading.comprehension.length;

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
          <LinearGradient
            colors={score === total ? ['#4CAF50', '#45a049'] : ['#2196F3', '#1976D2']}
            style={styles.resultsCard}
          >
            <MaterialCommunityIcons
              name={score === total ? 'trophy' : 'check-circle'}
              size={80}
              color="#fff"
            />
            <Text style={styles.resultsTitle}>Hoàn thành!</Text>
            <Text style={styles.resultsScore}>
              {score}/{total} câu đúng
            </Text>
            <Text style={styles.resultsPercent}>{Math.round((score / total) * 100)}%</Text>
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

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: reading.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerLeft: () => <BackButton />,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Reading Text */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Bài đọc</Text>
          </View>
          <Text style={[styles.readingText, { color: colors.text }]}>{reading.textJP}</Text>
          <View style={[styles.translationBox, { backgroundColor: colors.primary + '08' }]}>
            <Text style={[styles.translationText, { color: colors.textSub }]}>
              {reading.textEN}
            </Text>
          </View>
        </View>

        {/* Question */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.questionHeader}>
            <Text style={[styles.questionNumber, { color: colors.primary }]}>
              Câu {currentQuestion + 1}/{reading.comprehension.length}
            </Text>
          </View>

          <Text style={[styles.questionText, { color: colors.text }]}>
            {question.questionJP}
          </Text>
          {question.questionEN && (
            <Text style={[styles.questionSubText, { color: colors.textSub }]}>
              {question.questionEN}
            </Text>
          )}

          {question.type === 'mcq' && question.options ? (
            <View style={styles.optionsContainer}>
              {question.options.map((option: any, idx: number) => {
                const isSelected = answers[currentQuestion] === idx;
                const isCorrectOption = option.isCorrect;
                
                let bgColor = colors.bg;
                let borderColor = colors.border;
                let textColor = colors.text;

                if (showQuestionResult) {
                  if (isCorrectOption) {
                    bgColor = '#4CAF50' + '20';
                    borderColor = '#4CAF50';
                    textColor = '#4CAF50';
                  } else if (isSelected && !isCurrentQuestionCorrect()) {
                    bgColor = '#F44336' + '20';
                    borderColor = '#F44336';
                    textColor = '#F44336';
                  }
                } else if (isSelected) {
                  bgColor = colors.primary + '20';
                  borderColor = colors.primary;
                  textColor = colors.primary;
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.option, { backgroundColor: bgColor, borderColor }]}
                    onPress={() => handleSelectOption(idx)}
                    disabled={showQuestionResult}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>
                      {option.text}
                    </Text>
                    {showQuestionResult && isCorrectOption && (
                      <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                    )}
                    {showQuestionResult && isSelected && !isCurrentQuestionCorrect() && (
                      <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View>
              <TextInput
                style={[
                  styles.textInput, 
                  { 
                    backgroundColor: colors.bg, 
                    color: colors.text, 
                    borderColor: showQuestionResult 
                      ? (isCurrentQuestionCorrect() ? '#4CAF50' : '#F44336')
                      : colors.border
                  }
                ]}
                placeholder="Nhập câu trả lời..."
                placeholderTextColor={colors.textSub}
                value={answers[currentQuestion] || ''}
                onChangeText={handleTextAnswer}
                editable={!showQuestionResult}
              />
              {showQuestionResult && (
                <Text style={[styles.correctAnswerText, { 
                  color: isCurrentQuestionCorrect() ? '#4CAF50' : '#F44336',
                  marginTop: 8
                }]}>
                  {isCurrentQuestionCorrect() 
                    ? '✓ Chính xác!' 
                    : `✗ Đáp án đúng: ${question.answer}`
                  }
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Result Feedback */}
        {showQuestionResult && (
          <View style={[
            styles.resultCard,
            { 
              backgroundColor: isCurrentQuestionCorrect() ? '#4CAF50' + '20' : '#F44336' + '20',
              borderColor: isCurrentQuestionCorrect() ? '#4CAF50' : '#F44336',
              borderWidth: 2,
              borderRadius: 12,
              padding: 16,
              marginHorizontal: 16,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center'
            }
          ]}>
            <MaterialCommunityIcons 
              name={isCurrentQuestionCorrect() ? "check-circle" : "close-circle"} 
              size={32} 
              color={isCurrentQuestionCorrect() ? '#4CAF50' : '#F44336'} 
            />
            <Text style={[
              styles.resultText,
              { 
                color: isCurrentQuestionCorrect() ? '#4CAF50' : '#F44336',
                marginLeft: 12,
                fontSize: 18,
                fontWeight: '600'
              }
            ]}>
              {isCurrentQuestionCorrect() ? 'Chính xác! 🎉' : 'Chưa đúng 😅'}
            </Text>
          </View>
        )}

        {!showQuestionResult ? (
          <TouchableOpacity
            style={[styles.button, { 
              backgroundColor: answers[currentQuestion] !== undefined && answers[currentQuestion] !== '' 
                ? colors.primary 
                : colors.textMeta,
              opacity: answers[currentQuestion] !== undefined && answers[currentQuestion] !== '' ? 1 : 0.5,
              marginHorizontal: 16,
              marginBottom: 16
            }]}
            onPress={handleCheckAnswer}
            disabled={answers[currentQuestion] === undefined || answers[currentQuestion] === ''}
          >
            <Text style={styles.buttonText}>Kiểm tra</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { 
              backgroundColor: colors.primary,
              marginHorizontal: 16,
              marginBottom: 16
            }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {currentQuestion < reading.comprehension.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
            </Text>
          </TouchableOpacity>
        )}
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
  card: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  readingText: {
    fontSize: 18,
    lineHeight: 32,
  },
  translationBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 22,
  },
  questionHeader: {
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  questionSubText: {
    fontSize: 15,
    marginTop: 4,
  },
  optionsContainer: {
    gap: 12,
    marginTop: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  textInput: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 16,
  },
  correctAnswerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  resultsPercent: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
});
