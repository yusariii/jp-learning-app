import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

// Hiển thị danh sách từ vựng theo cấu trúc Word model
export type WordItem = {
  _id?: string;
  termJP: string;
  hiraKata?: string;
  romaji?: string;
  meaningVI?: string;
  meaningEN?: string;
  kanji?: string;
  examples?: Array<{
    sentenceJP?: string;
    readingKana?: string;
    meaningVI?: string;
  }>;
};

export default function WordList({ words = [] as WordItem[] }) {
  const { theme } = useAppTheme();
  if (!words.length) return null;

  return (
    <View style={styles.container}>
      <Text style={[theme.text.h3, styles.title]}>Từ vựng</Text>
      {words.map((w) => (
        <View key={w._id || w.termJP} style={[styles.item, { backgroundColor: theme.color.surface }]}> 
          <View style={styles.row}>
            <Text style={[theme.text.title, styles.term]}>{w.termJP}</Text>
            {w.kanji ? <Text style={[theme.text.secondary, styles.kanji]}>{w.kanji}</Text> : null}
          </View>
          {w.hiraKata ? <Text style={theme.text.meta}>{w.hiraKata}</Text> : null}
          {w.romaji ? <Text style={theme.text.meta}>{w.romaji}</Text> : null}
          {w.meaningVI ? <Text style={theme.text.body}>• {w.meaningVI}</Text> : null}
          {!w.meaningVI && w.meaningEN ? <Text style={theme.text.body}>• {w.meaningEN}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { marginBottom: 8 },
  item: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  term: { fontWeight: '800' },
  kanji: { fontSize: 14 },
});
