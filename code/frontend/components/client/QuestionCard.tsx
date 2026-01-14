import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

export interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  contextJP?: string;
  passageJP?: string;
  options: Array<{ label: string; text: string }>;
  selectedIndex?: number;
  onSelectOption: (index: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  questionText,
  contextJP,
  passageJP,
  options,
  selectedIndex,
  onSelectOption,
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.color.surface }]}>
      <View style={styles.header}>
        <Text style={[theme.text.body, { fontWeight: '600' }]}>Câu {questionNumber}</Text>
        {contextJP && <Text style={[theme.text.meta, { marginTop: 4 }]}>{contextJP}</Text>}
      </View>

      {passageJP && (
        <View style={[styles.passage, { borderColor: theme.color.border }]}>
          <Text style={theme.text.body}>{passageJP}</Text>
        </View>
      )}

      <Text style={[theme.text.h3, { marginBottom: 12 }]}>{questionText}</Text>

      {options.map((option, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <TouchableOpacity
            key={idx}
            style={[
              styles.optionBtn,
              {
                borderColor: isSelected ? theme.color.primary : theme.color.border,
                backgroundColor: isSelected ? theme.color.primary : theme.color.surface,
              },
            ]}
            onPress={() => onSelectOption(idx)}
          >
            <View
              style={[
                styles.optionRadio,
                {
                  borderColor: isSelected ? theme.color.primary : theme.color.border,
                  backgroundColor: isSelected ? theme.color.primary : 'transparent',
                },
              ]}
            >
              {isSelected && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text
              style={[
                theme.text.body,
                { flex: 1, color: isSelected ? '#fff' : theme.color.text },
              ]}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  passage: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 12,
    paddingVertical: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
