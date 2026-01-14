import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { listTests, TestListItem } from '@/api/client/test';
import { TestCard } from '@/components/client/TestCard';
import BackButton from '@/components/client/ui/BackButton';

export default function QuizListScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();

  const [tests, setTests] = useState<TestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listTests({ limit: 50 });
      setTests(data.tests || []);
    } catch (e: any) {
      setError(e?.message || 'Không tải được danh sách bài test');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId: string, testTitle: string) => {
    router.push(`/client/quiz/${testId}?title=${encodeURIComponent(testTitle)}` as any);
  };

  const renderTestCard = ({ item }: { item: TestListItem }) => (
    <TestCard
      testId={item._id}
      title={item.title}
      description={item.description}
      jlptLevel={item.jlptLevel}
      totalTime={item.totalTime}
      passingScorePercent={item.passingScorePercent}
      onPress={() => handleStartTest(item._id, item.title)}
    />
  );

  if (loading) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[theme.surface.screen, styles.center]}>
        <Ionicons name="alert-circle" size={64} color={theme.color.danger} />
        <Text style={[theme.text.h2, { marginTop: 16, color: theme.color.danger }]}>
          Lỗi
        </Text>
        <Text style={[theme.text.body, { marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: theme.color.primary }]}
          onPress={loadTests}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={theme.surface.screen}>
      <LinearGradient
        colors={[theme.color.primary, theme.color.link]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <BackButton 
          fallbackHref="/client/tabs"
          containerStyle={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.25)' }}
          color="#fff"
        />
        <Text style={styles.headerTitle}>📝 Bài Kiểm Tra</Text>
        <Text style={styles.headerSub}>Kiểm tra kiến thức JLPT của bạn</Text>
      </LinearGradient>

      {tests.length === 0 ? (
        <View style={[styles.center, { flex: 1 }]}>
          <Ionicons name="document-outline" size={64} color={theme.color.textMeta} />
          <Text style={[theme.text.body, { marginTop: 16 }]}>
            Chưa có bài test nào
          </Text>
        </View>
      ) : (
        <FlatList
          data={tests}
          renderItem={renderTestCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 60,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  retryBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
});
