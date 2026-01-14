import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/use-app-theme';

export interface TestCardProps {
  testId: string;
  title: string;
  description?: string;
  jlptLevel: string;
  totalTime: number;
  passingScorePercent: number;
  onPress: () => void;
}

export const TestCard: React.FC<TestCardProps> = ({
  title,
  description,
  jlptLevel,
  totalTime,
  passingScorePercent,
  onPress,
}) => {
  const { theme } = useAppTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'N5':
        return '#4CAF50';
      case 'N4':
        return '#2196F3';
      case 'N3':
        return '#FF9800';
      case 'N2':
        return '#F44336';
      case 'N1':
        return '#9C27B0';
      default:
        return '#999';
    }
  };

  const levelColor = getLevelColor(jlptLevel);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.color.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[levelColor, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[theme.text.h3, { flex: 1 }]}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: levelColor }]}>
            <Text style={styles.badgeText}>{jlptLevel}</Text>
          </View>
        </View>

        {description && (
          <Text
            style={[theme.text.secondary, { marginVertical: 8 }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color={theme.color.textMeta} />
            <Text style={[theme.text.meta, { marginLeft: 4 }]}>
              {totalTime} phút
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="star-outline" size={16} color={theme.color.textMeta} />
            <Text style={[theme.text.meta, { marginLeft: 4 }]}>
              {passingScorePercent}% để đạt
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.color.primary }]}
          onPress={onPress}
        >
          <Ionicons name="play-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
