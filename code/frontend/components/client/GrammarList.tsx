import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

export type GrammarItem = {
  _id?: string;
  title: string;
  description?: string;
  explanationJP: string;
  explanationEN?: string;
  examples?: Array<{
    sentenceJP: string;
    readingKana?: string;
    meaningVI?: string;
    meaningEN?: string;
  }>;
  jlptLevel?: string;
};

export default function GrammarList({ grammars = [] as GrammarItem[] }) {
  const { theme } = useAppTheme();
  if (!grammars.length) return null;

  return (
    <View style={styles.container}>
      <Text style={[theme.text.h3, styles.title]}>Ngữ pháp</Text>
      {grammars.map((g) => (
        <View key={g._id || g.title} style={[styles.item, { backgroundColor: theme.color.surface }]}> 
          <Text style={[theme.text.title, styles.grammarTitle]}>{g.title}</Text>
          {g.description ? <Text style={theme.text.body}>{g.description}</Text> : null}
          <Text style={[theme.text.secondary, { marginTop: 4 }]}>{g.explanationJP}</Text>
          {g.explanationEN ? (
            <Text style={theme.text.meta}>EN: {g.explanationEN}</Text>
          ) : null}
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
  grammarTitle: { fontWeight: '800', marginBottom: 4 },
});
