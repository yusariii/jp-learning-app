// ui/test/ReadingGroupEditor.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import LabeledInput from '@/components/ui/LabeledInput';
import ContentCard from '@/components/card/ContentCard';
import TestQuestionEditor from './TestQuestionEditor';

export type BaseQuestion = {
  questionText: string;
  options: { label?: string; text?: string }[];
  correctIndex: number;
  points?: number;
  contextJP?: string;
  mediaUrl?: string;
};

export type ReadingPassage = {
  _id?: string;
  title?: string;
  passageJP: string;
  passageEN?: string;
  instructionsJP?: string;      // đề bài riêng của đoạn
  instructionsEN?: string;
  questions: BaseQuestion[];
};

export default function ReadingGroupEditor({
  value,
  onChange,
  title = 'Đoạn văn (Reading)',
}: {
  value: ReadingPassage[];
  onChange: (next: ReadingPassage[]) => void;
  title?: string;
}) {
  const { theme } = useAppTheme();

  const addGroup = () =>
    onChange([
      ...value,
      {
        title: '',
        passageJP: '',
        passageEN: '',
        instructionsJP: '',
        instructionsEN: '',
        questions: [],
      },
    ]);

  const setGroup = (i: number, patch: Partial<ReadingPassage>) => {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const deleteGroup = (i: number) => {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
  };

  const moveGroup = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [g] = next.splice(from, 1);
    next.splice(to, 0, g);
    onChange(next);
  };

  return (
    <View style={{ gap: theme.tokens.space.md }}>
      <Text style={theme.text.h3}>{title}</Text>

      {value.length === 0 && (
        <Text style={theme.text.secondary}>Chưa có đoạn nào. Nhấn “＋ Thêm đoạn văn”.</Text>
      )}

      {value.map((g, i) => (
        <ContentCard key={i}>
          {/* Header đoạn + action */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.tokens.space.xs,
              justifyContent: 'space-between',
            }}
          >
            <Text style={theme.text.h3}>Đoạn #{i + 1}{g.title ? ` — ${g.title}` : ''}</Text>
            <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs }}>
              <TouchableOpacity
                onPress={() => moveGroup(i, i - 1)}
                style={theme.button.ghost.container}
                hitSlop={theme.utils.hitSlop}
              >
                <Text style={theme.button.ghost.label}>↑</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveGroup(i, i + 1)}
                style={theme.button.ghost.container}
                hitSlop={theme.utils.hitSlop}
              >
                <Text style={theme.button.ghost.label}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteGroup(i)}
                style={[theme.button.ghost.container, { borderColor: theme.color.danger, borderWidth: 1 }]}
                hitSlop={theme.utils.hitSlop}
              >
                <Text style={[theme.button.ghost.label, { color: theme.color.danger }]}>Xoá đoạn</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: theme.tokens.space.sm }} />

          {/* Meta đoạn */}
          <LabeledInput
            label="Tiêu đề đoạn (tuỳ chọn)"
            value={g.title || ''}
            onChangeText={(t) => setGroup(i, { title: t })}
          />
          <View style={{ height: theme.tokens.space.xs }} />
          <LabeledInput
            label="Đề bài đoạn (JP)"
            value={g.instructionsJP || ''}
            onChangeText={(t) => setGroup(i, { instructionsJP: t })}
            multiline
          />
          <View style={{ height: theme.tokens.space.xs }} />
          <LabeledInput
            label="Đề bài đoạn (EN) (tuỳ chọn)"
            value={g.instructionsEN || ''}
            onChangeText={(t) => setGroup(i, { instructionsEN: t })}
            multiline
          />
          <View style={{ height: theme.tokens.space.xs }} />
          <LabeledInput
            label="Đoạn văn (JP) *"
            value={g.passageJP}
            onChangeText={(t) => setGroup(i, { passageJP: t })}
            multiline
          />
          <View style={{ height: theme.tokens.space.xs }} />
          <LabeledInput
            label="Đoạn văn (EN) (tuỳ chọn)"
            value={g.passageEN || ''}
            onChangeText={(t) => setGroup(i, { passageEN: t })}
            multiline
          />

          <View style={{ height: theme.tokens.space.sm }} />

          {/* Câu hỏi của đoạn */}
          <TestQuestionEditor
            title="Câu hỏi của đoạn"
            value={g.questions}
            onChange={(qs) => setGroup(i, { questions: qs })}
            enableContext={false}
            enableMedia={false}
          />
        </ContentCard>
      ))}

      {/* Add đoạn */}
      <TouchableOpacity
        onPress={addGroup}
        style={{ ...theme.button.primary.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={theme.button.primary.label}>＋ Thêm đoạn văn</Text>
      </TouchableOpacity>
    </View>
  );
}
