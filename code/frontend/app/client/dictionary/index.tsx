import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Href, Stack, useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { searchWords, searchGrammar } from '@/api/client/dictionary';
import BackButton from '@/components/client/ui/BackButton';

type TabType = 'word' | 'grammar';

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

export default function DictionaryScreen() {
  const { theme } = useAppTheme();
  const colors = theme.color;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('word');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordResults, setWordResults] = useState<Word[]>([]);
  const [grammarResults, setGrammarResults] = useState<Grammar[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined);

  const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce 500ms

      return () => clearTimeout(timer);
    } else {
      setWordResults([]);
      setGrammarResults([]);
    }
  }, [searchQuery, activeTab, selectedLevel]);

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) return;

    setLoading(true);
    try {
      if (activeTab === 'word') {
        const result = await searchWords(searchQuery, selectedLevel);
        setWordResults(result.data);
      } else {
        const result = await searchGrammar(searchQuery, selectedLevel);
        setGrammarResults(result.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/client/dictionary/word/${item._id}` as Href)}
    >
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>{item.termJP}</Text>
        {item.jlptLevel && (
          <View style={[styles.levelBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.levelText, { color: colors.primary }]}>{item.jlptLevel}</Text>
          </View>
        )}
      </View>
      
      {item.hiraKata && (
        <Text style={[styles.hiragana, { color: colors.textSub }]}>{item.hiraKata}</Text>
      )}
      
      {item.meaningVI && (
        <Text style={[styles.meaning, { color: colors.text }]} numberOfLines={2}>
          {item.meaningVI}
        </Text>
      )}
      
      {item.kanji && (
        <Text style={[styles.type, { color: colors.textSub }]}>
          Kanji: {item.kanji}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderGrammarItem = ({ item }: { item: Grammar }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/client/dictionary/grammar/${item._id}` as Href)}
    >
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>{item.title}</Text>
        {item.jlptLevel && (
          <View style={[styles.levelBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.levelText, { color: colors.primary }]}>{item.jlptLevel}</Text>
          </View>
        )}
      </View>
      
      {item.explanationJP && (
        <Text style={[styles.meaning, { color: colors.text }]} numberOfLines={2}>
          {item.explanationJP}
        </Text>
      )}
      
      {item.description && (
        <Text style={[styles.usage, { color: colors.textSub }]} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const results = activeTab === 'word' ? wordResults : grammarResults;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Từ điển',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'word' && { backgroundColor: colors.primary + '20' },
          ]}
          onPress={() => setActiveTab('word')}
        >
          <Ionicons
            name="book-outline"
            size={20}
            color={activeTab === 'word' ? colors.primary : colors.textSub}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'word' ? colors.primary : colors.textSub },
            ]}
          >
            Từ vựng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'grammar' && { backgroundColor: colors.primary + '20' },
          ]}
          onPress={() => setActiveTab('grammar')}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={activeTab === 'grammar' ? colors.primary : colors.textSub}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'grammar' ? colors.primary : colors.textSub },
            ]}
          >
            Ngữ pháp
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSub} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={
            activeTab === 'word'
              ? 'Tìm từ vựng (tiếng Nhật hoặc tiếng Việt)...'
              : 'Tìm ngữ pháp...'
          }
          placeholderTextColor={colors.textSub}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSub} />
          </TouchableOpacity>
        )}
      </View>

      {/* JLPT Level Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedLevel && { backgroundColor: colors.primary },
            selectedLevel && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
          ]}
          onPress={() => setSelectedLevel(undefined)}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: !selectedLevel ? '#fff' : colors.textSub },
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        {jlptLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterChip,
              selectedLevel === level && { backgroundColor: colors.primary },
              selectedLevel !== level && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
            ]}
            onPress={() => setSelectedLevel(level)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedLevel === level ? '#fff' : colors.textSub },
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : searchQuery.trim().length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color={colors.textSub} />
          <Text style={[styles.emptyText, { color: colors.textSub }]}>
            Nhập từ khóa để tìm kiếm
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="file-tray-outline" size={64} color={colors.textSub} />
          <Text style={[styles.emptyText, { color: colors.textSub }]}>
            Không tìm thấy kết quả
          </Text>
        </View>
      ) : (
        <FlatList
          data={results as any[]}
          renderItem={(info) => activeTab === 'word' ? renderWordItem(info as any) : renderGrammarItem(info as any)}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    marginTop: 12,
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  resultItem: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hiragana: {
    fontSize: 16,
  },
  meaning: {
    fontSize: 16,
  },
  type: {
    fontSize: 14,
  },
  usage: {
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
  },
});

