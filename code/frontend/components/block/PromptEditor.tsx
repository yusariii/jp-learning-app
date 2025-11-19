import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';
import LabeledInput from '../ui/LabeledInput';

export type Prompt = { promptJP: string; promptEN?: string; expectedSample?: string };

export default function PromptsEditor({
  prompts, onChange,
}: { prompts: Prompt[]; onChange: (next: Prompt[]) => void }) {
  const { theme } = useAppTheme();

  const set = (i: number, patch: Partial<Prompt>) => {
    const a = [...prompts]; a[i] = { ...a[i], ...patch }; onChange(a);
  };
  const add = () => onChange([...prompts, { promptJP: '', promptEN: '', expectedSample: '' }]);
  const remove = (i: number) => {
    const a = prompts.filter((_, idx) => idx !== i);
    onChange(a.length ? a : [{ promptJP: '', promptEN: '', expectedSample: '' }]);
  };

  return (
    <>
      {prompts.map((p, i) => (
        <View key={i} style={{
          backgroundColor: theme.color.bgSubtle,
          borderRadius: theme.tokens.radius.md,
          borderWidth: 1, borderColor: theme.color.border,
          padding: theme.tokens.space.md, marginBottom: theme.tokens.space.sm,
        }}>
          <Text style={theme.text.meta}>Prompt #{i + 1}</Text>

          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Prompt (JP) *" value={p.promptJP} onChangeText={t=>set(i,{promptJP:t})} />
          </View>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Prompt (EN)" value={p.promptEN || ''} onChangeText={t=>set(i,{promptEN:t})} />
          </View>
          <View style={{ marginTop: theme.tokens.space.sm }}>
            <LabeledInput label="Mẫu kỳ vọng" value={p.expectedSample || ''} onChangeText={t=>set(i,{expectedSample:t})} multiline />
          </View>

          <View style={{ marginTop: 6, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => remove(i)} hitSlop={theme.utils.hitSlop}>
              <Text style={{ ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const }}>Xoá prompt</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={add}
        style={{ ...theme.button.ghost.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={{ ...theme.button.ghost.label, fontWeight: '700' as const }}>＋ Thêm prompt</Text>
      </TouchableOpacity>
    </>
  );
}
