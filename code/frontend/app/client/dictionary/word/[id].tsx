import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getWordDetail } from '@/api/client/dictionary';
import BackButton from '@/components/client/ui/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Word {
  _id: string;
  termJP: string;
  hiraKata?: string;
  romaji?: string;
  meaningVI?: string;
  meaningEN?: string;
  kanji?: string;
  jlptLevel?: string;
  examples?: {
    sentenceJP: string;
    readingKana: string;
    meaningVI: string;
  }[];
  audioUrl?: string;
}

export default function WordDetailScreen() {
  const { theme } = useAppTheme();
  const colors = theme.color;
  const { id } = useLocalSearchParams();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadWordDetail();
    }
  }, [id]);

  const loadWordDetail = async () => {
    try {
      setLoading(true);
      const data = await getWordDetail(String(id));
      setWord(data);
    } catch (error) {
      console.error('Error loading word:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Chi tiết từ vựng',
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

  if (!word) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Chi tiết từ vựng',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerLeft: () => <BackButton />,
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.textSub }]}>
            Không tìm thấy từ vựng
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: word.termJP || 'Chi tiết từ vựng',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerLeft: () => <BackButton />,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Word */}
        <LinearGradient
          colors={[colors.primary + '15', colors.surface]}
          style={[styles.card, styles.mainCard]}
        >
          <View style={styles.header}>
            <View style={styles.wordContainer}>
              <MaterialCommunityIcons name="book-open-variant" size={28} color={colors.primary} />
              <Text style={[styles.mainWord, { color: colors.text }]}>{word.termJP}</Text>
            </View>
            {word.jlptLevel && (
              <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.levelText}>{word.jlptLevel}</Text>
              </View>
            )}
          </View>

          {word.hiraKata && (
            <Text style={[styles.hiragana, { color: colors.textSub }]}>{word.hiraKata}</Text>
          )}

          {word.romaji && (
            <Text style={[styles.romaji, { color: colors.textSub }]}>{word.romaji}</Text>
          )}

          {word.kanji && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="ideogram-cjk" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Kanji</Text>
              </View>
              <Text style={[styles.kanjiText, { color: colors.text }]}>{word.kanji}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Meanings */}
        {(word.meaningVI || word.meaningEN) && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="translate" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Nghĩa</Text>
            </View>
            {word.meaningVI && (
              <View style={[styles.meaningItem, { backgroundColor: colors.primary + '08' }]}>
                <Text style={[styles.meaningFlag]}>🇻🇳</Text>
                <View style={styles.meaningContent}>
                  <Text style={[styles.meaningLabel, { color: colors.textSub }]}>Tiếng Việt</Text>
                  <Text style={[styles.meaningText, { color: colors.text }]}>{word.meaningVI}</Text>
                </View>
              </View>
            )}
            {word.meaningEN && (
              <View style={[styles.meaningItem, { backgroundColor: colors.primary + '08' }]}>
                <Text style={[styles.meaningFlag]}>🇬🇧</Text>
                <View style={styles.meaningContent}>
                  <Text style={[styles.meaningLabel, { color: colors.textSub }]}>English</Text>
                  <Text style={[styles.meaningText, { color: colors.text }]}>{word.meaningEN}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Examples */}
        {word.examples && word.examples.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Ví dụ</Text>
            </View>
            {word.examples.map((example, index) => (
              <View key={index} style={[styles.exampleItem, { borderLeftColor: colors.primary }]}>
                <View style={styles.exampleNumber}>
                  <Text style={[styles.exampleNumberText, { color: colors.primary }]}>{index + 1}</Text>
                </View>
                <View style={styles.exampleContent}>
                  <Text style={[styles.exampleJP, { color: colors.text }]}>
                    {example.sentenceJP}
                  </Text>
                  {example.readingKana && (
                    <Text style={[styles.exampleReading, { color: colors.textSub }]}>
                      {example.readingKana}
                    </Text>
                  )}
                  {example.meaningVI && (
                    <View style={styles.exampleMeaningRow}>
                      <MaterialCommunityIcons name="arrow-right" size={16} color={colors.primary} />
                      <Text style={[styles.exampleMeaning, { color: colors.textSub }]}>
                        {example.meaningVI}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
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
  mainCard: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mainWord: {
    fontSize: 36,
    fontWeight: '700',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  hiragana: {
    fontSize: 22,
    marginTop: 4,
  },
  romaji: {
    fontSize: 18,
    marginTop: 4,
  },
  section: {
    gap: 8,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  kanjiText: {
    fontSize: 28,
    fontWeight: '500',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  meaningItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  meaningFlag: {
    fontSize: 24,
  },
  meaningContent: {
    flex: 1,
    gap: 4,
  },
  meaningLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  meaningText: {
    fontSize: 17,
    lineHeight: 24,
  },
  exampleItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
    marginBottom: 12,
  },
  exampleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  exampleContent: {
    flex: 1,
    gap: 6,
  },
  exampleJP: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
  },
  exampleReading: {
    fontSize: 15,
    lineHeight: 22,
  },
  exampleMeaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exampleMeaning: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
