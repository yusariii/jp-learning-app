import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';

export default function ListeningQuestionBlock({
  q, index,
}: {
  q: {
    questionJP: string; questionEN?: string;
    type: 'mcq'|'fill_blank'|'true_false'|'short_answer';
    options?: { text?: string; isCorrect?: boolean }[];
    answer?: any;
  };
  index: number;
}) {
  const { theme } = useAppTheme();
  return (
    <View style={{
      backgroundColor: theme.color.bgSubtle,
      borderRadius: theme.tokens.radius.md,
      borderWidth: 1, borderColor: theme.color.border,
      padding: theme.tokens.space.md, marginBottom: theme.tokens.space.sm, gap: 6,
    }}>
      <Text style={theme.text.meta}>Q{index + 1} ・ {q.type}</Text>
      <Text style={theme.text.title}>{q.questionJP}</Text>
      {!!q.questionEN && <Text style={theme.text.secondary}>{q.questionEN}</Text>}

      {q.type === 'mcq' && q.options?.length ? (
        <View style={{ marginTop: theme.tokens.space.xs, gap: 4 }}>
          {q.options.map((op, i) => (
            <Text key={i} style={op.isCorrect ? { ...theme.text.body, fontWeight: '700' as const } : theme.text.body}>
              • {op.text || ''}
            </Text>
          ))}
        </View>
      ) : null}

      {!!(q.answer !== undefined) && (
        <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>
          Đáp án: {typeof q.answer === 'boolean' ? (q.answer ? 'Đúng' : 'Sai') : String(q.answer)}
        </Text>
      )}
    </View>
  );
}
