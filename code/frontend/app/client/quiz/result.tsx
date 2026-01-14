import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/client/ui/BackButton';
import { ResultCard } from '@/components/client/ResultCard';

export default function QuizResultScreen() {
  const { testId, scorePercent, passed, totalScore, totalPoints } = useLocalSearchParams();
  const { theme } = useAppTheme();
  const router = useRouter();

  const score = parseInt(scorePercent as string) || 0;
  const isPassed = passed === 'true';
  const score_val = parseInt(totalScore as string) || 0;
  const total = parseInt(totalPoints as string) || 0;

  const getColor = () => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#2196F3';
    return '#F44336';
  };

  const getEmoji = () => {
    if (score >= 90) return '🌟';
    if (score >= 70) return '😊';
    return '😢';
  };

  return (
    <View style={theme.surface.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={[theme.color.primary, theme.color.link]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <BackButton
            fallbackHref="/client/quiz"
            containerStyle={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            color="#fff"
          />
        </LinearGradient>

        {/* Result Card */}
        <ResultCard
          scorePercent={score}
          passed={isPassed}
          totalScore={score_val}
          totalPoints={total}
        />

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.color.surface, borderWidth: 2, borderColor: theme.color.border }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.color.primary} />
            <Text style={[theme.text.body, { color: theme.color.primary, fontWeight: '600', marginLeft: 8 }]}>
              Quay lại
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.color.primary }]}
            onPress={() => router.push(`/client/quiz/${testId}` as any)}
          >
            <Ionicons name="reload" size={20} color="#fff" />
            <Text style={[theme.text.body, { color: '#fff', fontWeight: '600', marginLeft: 8 }]}>
              Làm lại
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
});
