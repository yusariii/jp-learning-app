import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'
import LabeledInput from '../ui/LabeledInput'
import Chip from '../ui/Chip'

type Option = { text?: string; isCorrect?: boolean };
export type Question = {
  questionJP: string;
  questionEN?: string;
  type: 'mcq'|'short_answer';
  options?: Option[];
  answer?: any;
};

export default function QuestionEditor({
  questions, onChange,
}: {
  questions: Question[];
  onChange: (next: Question[]) => void;
}) {
  const { theme } = useAppTheme();

  const set = (i: number, patch: Partial<Question>) => {
    const a = [...questions];
    a[i] = { ...a[i], ...patch };
    onChange(a);
  };
  const add = () => onChange([ ...questions, { questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' } ]);
  const remove = (i: number) => {
    const a = questions.filter((_, idx) => idx !== i);
    onChange(a.length ? a : [{ questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' }]);
  };

  const setOption = (qi: number, oi: number, patch: Partial<Option>) => {
    const a = [...questions];
    const ops = [...(a[qi].options || [])];
    ops[oi] = { ...ops[oi], ...patch };
    a[qi].options = ops;
    onChange(a);
  };
  const addOption = (qi: number) => {
    const a = [...questions];
    a[qi].options = [...(a[qi].options || []), { text: '', isCorrect: false }];
    onChange(a);
  };
  const removeOption = (qi: number, oi: number) => {
    const a = [...questions];
    const ops = (a[qi].options || []).filter((_, idx) => idx !== oi);
    a[qi].options = ops.length ? ops : [{ text: '', isCorrect: true }];
    onChange(a);
  };

  return (
    <>
      {questions.map((q, i) => (
        <View key={i} style={{
          backgroundColor: theme.color.bgSubtle,
          borderRadius: theme.tokens.radius.md,
          borderWidth: 1, borderColor: theme.color.border,
          padding: theme.tokens.space.md,
          marginBottom: theme.tokens.space.sm,
        }}>
          <Text style={theme.text.meta}>Câu hỏi #{i + 1}</Text>

          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Câu hỏi (JP) *" value={q.questionJP} onChangeText={t=>set(i, { questionJP: t })} />
          </View>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Question (EN)" value={q.questionEN || ''} onChangeText={t=>set(i, { questionEN: t })} />
          </View>

          <View style={{ marginTop: theme.tokens.space.sm, flexDirection: 'row', gap: theme.tokens.space.xs }}>
            <Chip label="MCQ" active={q.type === 'mcq'} onPress={() => set(i, { type: 'mcq' })} />
            <Chip label="Tự luận" active={q.type === 'short_answer'} onPress={() => set(i, { type: 'short_answer' })} />
          </View>

          {q.type === 'mcq' ? (
            <View style={{ marginTop: theme.tokens.space.sm }}>
              {(q.options || []).map((op, oi) => (
                <View key={oi} style={{ marginBottom: theme.tokens.space.xs }}>
                  <LabeledInput
                    label={`Phương án #${oi + 1}${op.isCorrect ? ' (Đúng)' : ''}`}
                    value={op.text || ''}
                    onChangeText={t=>setOption(i, oi, { text: t })}
                  />
                  <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, marginTop: 6 }}>
                    <Chip label="Đặt là Đúng" active={op.isCorrect} onPress={() => setOption(i, oi, { isCorrect: true })} />
                    <Chip label="Đặt là Sai" active={!op.isCorrect} onPress={() => setOption(i, oi, { isCorrect: false })} />
                    <TouchableOpacity onPress={() => removeOption(i, oi)} hitSlop={theme.utils.hitSlop}>
                      <Text style={{ ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const }}>Xoá phương án</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity onPress={() => addOption(i)} style={{ ...theme.button.ghost.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}>
                <Text style={theme.button.ghost.label}>＋ Thêm phương án</Text>
              </TouchableOpacity>
              <View style={{ marginTop: theme.tokens.space.sm }}>
                <LabeledInput label="Đáp án (tuỳ chọn)" value={String(q.answer ?? '')} onChangeText={t=>set(i, { answer: t })} />
              </View>
            </View>
          ) : (
            <View style={{ marginTop: theme.tokens.space.sm }}>
              <LabeledInput label="Đáp án (tự luận)" value={String(q.answer ?? '')} onChangeText={t=>set(i, { answer: t })} multiline />
            </View>
          )}

          <View style={{ marginTop: 6, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => remove(i)} hitSlop={theme.utils.hitSlop}>
              <Text style={{ ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const }}>Xoá câu hỏi</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => add()}
        style={{ ...theme.button.ghost.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={{ ...theme.button.ghost.label, fontWeight: '700' as const }}>＋ Thêm câu hỏi</Text>
      </TouchableOpacity>
    </>
  );
}
