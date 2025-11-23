import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'
import LabeledInput from '../../components/ui/LabeledInput'
import Chip from '../../components/ui/Chip'

type Opt = { text?: string; isCorrect?: boolean };
export type LQuestion = {
  questionJP: string;
  questionEN?: string;
  type: 'mcq' | 'fill_blank' | 'true_false' | 'short_answer';
  options?: Opt[];
  answer?: any;
};

export default function ListeningQuestionEditor({
  questions, onChange,
}: { questions: LQuestion[]; onChange: (next: LQuestion[]) => void; }) {
  const { theme } = useAppTheme();

  const set = (i: number, patch: Partial<LQuestion>) => {
    const a = [...questions]; a[i] = { ...a[i], ...patch }; onChange(a);
  };
  const add = () => onChange([
    ...questions,
    { questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' }
  ]);
  const remove = (i: number) => {
    const a = questions.filter((_, idx) => idx !== i);
    onChange(a.length ? a : [{ questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' }]);
  };

  const setOption = (qi: number, oi: number, patch: Partial<Opt>) => {
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
          padding: theme.tokens.space.md, marginBottom: theme.tokens.space.sm,
        }}>
          <Text style={theme.text.meta}>Câu hỏi #{i + 1}</Text>

          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Câu hỏi (JP) *" value={q.questionJP} onChangeText={t=>set(i,{questionJP:t})} />
          </View>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Question (EN)" value={q.questionEN || ''} onChangeText={t=>set(i,{questionEN:t})} />
          </View>

          {/* Loại câu hỏi */}
          <View style={{ marginTop: theme.tokens.space.sm, flexDirection: 'row', gap: theme.tokens.space.xs, flexWrap: 'wrap' }}>
            {(['mcq','fill_blank','true_false','short_answer'] as const).map(t => (
              <Chip key={t} label={t} active={q.type === t} onPress={() => set(i, { type: t })} />
            ))}
          </View>

          {/* Nội dung theo type */}
          {q.type === 'mcq' && (
            <View style={{ marginTop: theme.tokens.space.sm }}>
              {(q.options || []).map((op, oi) => (
                <View key={oi} style={{ marginBottom: theme.tokens.space.xs }}>
                  <LabeledInput
                    label={`Phương án #${oi + 1}${op.isCorrect ? ' (Đúng)' : ''}`}
                    value={op.text || ''}
                    onChangeText={t=>setOption(i, oi, { text: t })}
                  />
                  <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip label="Đúng" active={op.isCorrect} onPress={() => setOption(i, oi, { isCorrect: true })} />
                    <Chip label="Sai"  active={!op.isCorrect} onPress={() => setOption(i, oi, { isCorrect: false })} />
                    <TouchableOpacity
                      onPress={() => removeOption(i, oi)}
                      style={[theme.chip.container, { height: theme.chip.height, backgroundColor: theme.color.surfaceAlt, borderColor: theme.color.danger, borderWidth: 1 }]}
                      hitSlop={theme.utils.hitSlop}
                    >
                      <Text style={[theme.chip.label, { color: theme.color.danger, fontWeight: '700' }]}>Xoá</Text>
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
          )}

          {q.type === 'fill_blank' && (
            <View style={{ marginTop: theme.tokens.space.sm }}>
              <LabeledInput
                label="Đáp án đúng (chuỗi cần điền)"
                value={String(q.answer ?? '')}
                onChangeText={t=>set(i, { answer: t })}
              />
            </View>
          )}

          {q.type === 'true_false' && (
            <View style={{ marginTop: theme.tokens.space.sm, flexDirection: 'row', gap: theme.tokens.space.xs }}>
              <Chip label="Đúng (True)" active={q.answer === true}  onPress={() => set(i, { answer: true })} />
              <Chip label="Sai (False)" active={q.answer === false} onPress={() => set(i, { answer: false })} />
            </View>
          )}

          {q.type === 'short_answer' && (
            <View style={{ marginTop: theme.tokens.space.sm }}>
              <LabeledInput label="Đáp án mẫu (tuỳ chọn)" value={String(q.answer ?? '')} onChangeText={t=>set(i, { answer: t })} multiline />
            </View>
          )}

          <View style={{ marginTop: 6, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => remove(i)} hitSlop={theme.utils.hitSlop}>
              <Text style={{ ...theme.text.link, color: theme.color.danger, fontWeight: '700' }}>Xoá câu hỏi</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={add} style={{ ...theme.button.ghost.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }} hitSlop={theme.utils.hitSlop}>
        <Text style={{ ...theme.button.ghost.label, fontWeight: '700' }}>＋ Thêm câu hỏi</Text>
      </TouchableOpacity>
    </>
  );
}
