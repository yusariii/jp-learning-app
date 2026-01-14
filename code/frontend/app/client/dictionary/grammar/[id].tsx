import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getGrammarDetail } from '@/api/client/dictionary';
import BackButton from '@/components/client/ui/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Grammar {
  _id: string;
  title: string;
  description?: string;
  explanationJP: string;
  explanationEN?: string;
  jlptLevel?: string;
  examples?: {
    sentenceJP: string;
    readingKana: string;
    meaningVI: string;
    meaningEN: string;
  }[];
}

export default function GrammarDetailScreen() {
  const { theme } = useAppTheme();
  const colors = theme.color;
  const { id } = useLocalSearchParams();
  const [grammar, setGrammar] = useState<Grammar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadGrammarDetail();
    }
  }, [id]);

  const loadGrammarDetail = async () => {
    try {
      setLoading(true);
      const data = await getGrammarDetail(String(id));
      setGrammar(data);
    } catch (error) {
      console.error('Error loading grammar:', error);
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
            title: 'Chi tiết ngữ pháp',
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

  if (!grammar) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Chi tiết ngữ pháp',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerLeft: () => <BackButton />,
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.textSub }]}>
            Không tìm thấy ngữ pháp
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
          title: grammar.title || 'Chi tiết ngữ pháp',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerLeft: () => <BackButton />,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title & Level */}
        <LinearGradient
          colors={[colors.primary + '15', colors.surface]}
          style={[styles.card, styles.mainCard]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons name="school" size={28} color={colors.primary} />
              <Text style={[styles.mainTitle, { color: colors.text }]}>{grammar.title}</Text>
            </View>
            {grammar.jlptLevel && (
              <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.levelText}>{grammar.jlptLevel}</Text>
              </View>
            )}
          </View>

          {grammar.description && (
            <View style={[styles.descriptionBox, { backgroundColor: colors.primary + '08' }]}>
              <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
              <Text style={[styles.description, { color: colors.text }]}>
                {grammar.description}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Explanation */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Giải thích</Text>
          </View>
          <View style={[styles.explanationBox, { borderLeftColor: colors.primary }]}>
            <Text style={[styles.explanationJP, { color: colors.text }]}>
              {grammar.explanationJP}
            </Text>
          </View>
          {grammar.explanationEN && (
            <View style={[styles.explanationEnBox, { backgroundColor: colors.primary + '08' }]}>
              <MaterialCommunityIcons name="translate" size={18} color={colors.textSub} />
              <Text style={[styles.explanationEN, { color: colors.textSub }]}>
                {grammar.explanationEN}
              </Text>
            </View>
          )}
        </View>

        {/* Examples */}
        {grammar.examples && grammar.examples.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Ví dụ</Text>
            </View>
            {grammar.examples.map((example, index) => (
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
                    <View style={styles.meaningRow}>
                      <Text style={styles.flag}>🇻🇳</Text>
                      <Text style={[styles.exampleMeaning, { color: colors.textSub }]}>
                        {example.meaningVI}
                      </Text>
                    </View>
                  )}
                  {example.meaningEN && (
                    <View style={styles.meaningRow}>
                      <Text style={styles.flag}>🇬🇧</Text>
                      <Text style={[styles.exampleMeaning, { color: colors.textSub }]}>
                        {example.meaningEN}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mainTitle: {
    fontSize: 30,
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
  descriptionBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
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
  explanationBox: {
    paddingLeft: 16,
    borderLeftWidth: 3,
  },
  explanationJP: {
    fontSize: 17,
    lineHeight: 28,
  },
  explanationEnBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  explanationEN: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    flex: 1,
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
  meaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 16,
  },
  exampleMeaning: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
