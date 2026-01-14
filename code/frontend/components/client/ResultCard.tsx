import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/use-app-theme';

export interface ResultCardProps {
  scorePercent: number;
  passed: boolean;
  totalScore: number;
  totalPoints: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  scorePercent,
  passed,
  totalScore,
  totalPoints,
}) => {
  const { theme } = useAppTheme();

  const getColor = () => {
    if (scorePercent >= 90) return '#4CAF50';
    if (scorePercent >= 70) return '#2196F3';
    return '#F44336';
  };

  const getEmoji = () => {
    if (scorePercent >= 90) return '🌟';
    if (scorePercent >= 70) return '😊';
    return '😢';
  };

  const correctCount = totalScore;
  const wrongCount = totalPoints - totalScore;

  return (
    <View style={[styles.card, { backgroundColor: theme.color.surface }]}>
      <View style={styles.center}>
        <Text style={styles.emoji}>{getEmoji()}</Text>
        <Text style={[theme.text.h2, { marginTop: 16, textAlign: 'center' }]}>
          {passed ? 'Chúc mừng!' : 'Cần cố gắng hơn'}
        </Text>
        <Text style={[theme.text.secondary, { marginTop: 8, textAlign: 'center' }]}>
          {passed ? 'Bạn đã vượt qua bài test' : 'Bạn chưa đạt được điểm cần thiết'}
        </Text>
      </View>

      <View style={[styles.scoreContainer, { borderColor: theme.color.border }]}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreText, { color: getColor() }]}>{scorePercent}</Text>
          <Text style={[theme.text.meta, { color: getColor() }]}>%</Text>
        </View>

        <View style={styles.scoreDetails}>
          <View style={styles.detailRow}>
            <Text style={theme.text.secondary}>Tổng điểm:</Text>
            <Text style={[theme.text.body, { fontWeight: 'bold' }]}>
              {totalScore}/{totalPoints}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={theme.text.secondary}>Trạng thái:</Text>
            <Text
              style={[
                theme.text.body,
                { fontWeight: 'bold', color: getColor() },
              ]}
            >
              {passed ? '✅ Đạt' : '❌ Chưa đạt'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: theme.color.bg }]}>
          <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          <Text style={[theme.text.h3, { marginTop: 8 }]}>{correctCount}</Text>
          <Text style={theme.text.meta}>Đúng</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.color.bg }]}>
          <Ionicons name="close-circle" size={32} color="#F44336" />
          <Text style={[theme.text.h3, { marginTop: 8 }]}>{wrongCount}</Text>
          <Text style={theme.text.meta}>Sai</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.color.bg }]}>
          <Ionicons name="star" size={32} color="#FFD700" />
          <Text style={[theme.text.h3, { marginTop: 8 }]}>
            {Math.round((correctCount / totalPoints) * 100)}%
          </Text>
          <Text style={theme.text.meta}>Chính xác</Text>
        </View>
      </View>

      {!passed && (
        <View style={[styles.tipsBox, { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: '#F44336' }]}>
          <Ionicons name="information-circle" size={20} color="#F44336" />
          <Text style={[theme.text.body, { marginLeft: 12, flex: 1, color: '#F44336' }]}>
            Hãy ôn tập lại và làm bài test lần nữa
          </Text>
        </View>
      )}

      {passed && (
        <View style={[styles.tipsBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50' }]}>
          <Ionicons name="star" size={20} color="#4CAF50" />
          <Text style={[theme.text.body, { marginLeft: 12, flex: 1, color: '#4CAF50' }]}>
            Xuất sắc! Bạn đã nắm vững kiến thức này
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  center: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: 20,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreDetails: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
});
