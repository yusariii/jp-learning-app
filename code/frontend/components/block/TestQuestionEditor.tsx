import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';

export type BaseQuestion = {
  questionText: string;
  contextJP?: string;
  mediaUrl?: string;
  options: { label?: string; text?: string }[];
  correctIndex: number;
  points?: number;
};

export default function TestQuestionEditor({
  value, onChange, title,
  enableContext = true,
  enableMedia = true,
}: {
  title: string;
  value: BaseQuestion[];
  onChange: (next: BaseQuestion[]) => void;
  enableContext?: boolean;
  enableMedia?: boolean;
}) {
  const { theme } = useAppTheme();

  const addQ = () =>
    onChange([
      ...value,
      {
        questionText: '',
        contextJP: '',
        mediaUrl: '',
        options: [{ label: 'A', text: '' }, { label: 'B', text: '' }, { label: 'C', text: '' }, { label: 'D', text: '' }],
        correctIndex: 0,
        points: 1,
      },
    ]);

  const setQ = (i: number, patch: Partial<BaseQuestion>) => {
    const a = [...value];
    a[i] = { ...a[i], ...patch };
    onChange(a);
  };

  const delQ = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const setOpt = (qi: number, oi: number, patch: Partial<{ label?: string; text?: string }>) => {
    const a = [...value];
    const ops = [...a[qi].options];
    ops[oi] = { ...ops[oi], ...patch };
    a[qi].options = ops;
    onChange(a);
  };

  const addOpt = (qi: number) => {
    const a = [...value];
    a[qi].options = [...a[qi].options, { label: String.fromCharCode(65 + a[qi].options.length), text: '' }];
    onChange(a);
  };

  const delOpt = (qi: number, oi: number) => {
    const a = [...value];
    const ops = a[qi].options.filter((_, idx) => idx !== oi);
    a[qi].options = ops.length ? ops : [{ label: 'A', text: '' }];
    if (a[qi].correctIndex >= a[qi].options.length) a[qi].correctIndex = 0;
    onChange(a);
  };

  return (
    <View style={{ gap: theme.tokens.space.sm }}>
      <Text style={theme.text.h3}>{title}</Text>

      {value.map((q, i) => (
        <View
          key={i}
          style={{
            backgroundColor: theme.color.bgSubtle,
            borderRadius: theme.tokens.radius.md,
            borderWidth: 1, borderColor: theme.color.border,
            padding: theme.tokens.space.md, gap: theme.tokens.space.sm,
          }}
        >
          <Text style={theme.text.meta}>Câu #{i + 1}</Text>

          <LabeledInput label="Câu hỏi *" value={q.questionText} onChangeText={(t) => setQ(i, { questionText: t })} />

          {enableContext && (
            <LabeledInput
              label="Ngữ cảnh / đoạn văn (JP)"
              value={q.contextJP || ''}
              onChangeText={(t) => setQ(i, { contextJP: t })}
              multiline
            />
          )}

          {enableMedia && (
            <LabeledInput
              label="Media URL (audio/hình) — dùng cho Listening"
              value={q.mediaUrl || ''}
              onChangeText={(t) => setQ(i, { mediaUrl: t })}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}

          <View style={{ gap: theme.tokens.space.xs }}>
            <Text style={theme.text.meta}>Phương án</Text>
            {q.options.map((op, oi) => (
              <View key={oi} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs }}>
                  <LabeledInput
                    style={{ flex: 0.2 }}
                    label="Label"
                    value={op.label || String.fromCharCode(65 + oi)}
                    onChangeText={(t) => setOpt(i, oi, { label: t })}
                  />
                  <LabeledInput
                    style={{ flex: 1 }}
                    label={`Nội dung đáp án #${oi + 1}`}
                    value={op.text || ''}
                    onChangeText={(t) => setOpt(i, oi, { text: t })}
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip label="Đúng" active={q.correctIndex === oi} onPress={() => setQ(i, { correctIndex: oi })} />
                  <TouchableOpacity
                    onPress={() => delOpt(i, oi)}
                    style={[theme.chip.container, { height: theme.chip.height, borderColor: theme.color.danger, borderWidth: 1 }]}
                    hitSlop={theme.utils.hitSlop}
                  >
                    <Text style={[theme.chip.label, { color: theme.color.danger }]}>Xoá phương án</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addOpt(i)}
              style={{ ...theme.button.ghost.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}
            >
              <Text style={theme.button.ghost.label}>＋ Thêm phương án</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs }}>
            <LabeledInput
              style={{ flex: 1 }}
              label="Điểm"
              keyboardType="numeric"
              value={String(q.points ?? 1)}
              onChangeText={(t) => setQ(i, { points: Number(t) || 1 })}
            />
            <TouchableOpacity onPress={() => delQ(i)} style={[theme.button.ghost.container, { alignSelf: 'flex-end' }]}>
              <Text style={[theme.button.ghost.label, { color: theme.color.danger }]}>Xoá câu hỏi</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={addQ}
        style={{ ...theme.button.primary.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={theme.button.primary.label}>＋ Thêm câu hỏi</Text>
      </TouchableOpacity>
    </View>
  );
}
