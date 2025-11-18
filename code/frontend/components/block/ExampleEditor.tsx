import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LabeledInput from '../ui/LabeledInput';
import { useAppTheme } from '../../hooks/use-app-theme'

export type FieldConfig<K extends string = string> = { key: K; label: string; multiline?: boolean };

export default function ExampleEditor<T extends Record<string, any>, K extends keyof T & string>({
  examples, onChange, fields,
}: {
  examples: T[]; onChange: (next: T[]) => void;
  fields: FieldConfig<K>[];
}) {
  const { theme } = useAppTheme();

  const set = (i: number, k: K, v: string) => {
    const a = [...examples]; a[i] = { ...a[i], [k]: v } as T; onChange(a);
  };
  const add = () => onChange([ ...examples, Object.fromEntries(fields.map(f => [f.key, ''])) as T ]);
  const remove = (i: number) => {
    const a = examples.filter((_, idx) => idx !== i);
    onChange(a.length ? a : [Object.fromEntries(fields.map(f => [f.key, ''])) as T]);
  };

  return (
    <>
      {examples.map((ex, i) => (
        <View key={i} style={{
          backgroundColor: theme.color.bgSubtle,
          borderRadius: theme.tokens.radius.md,
          borderWidth: 1, borderColor: theme.color.border,
          padding: theme.tokens.space.md, marginBottom: theme.tokens.space.sm,
        }}>
          {fields.map((f) => (
            <View key={f.key} style={{ marginTop: f === fields[0] ? 0 : theme.tokens.space.sm }}>
              <LabeledInput
                label={`${f.label} #${i+1}`}
                value={String(ex[f.key] || '')}
                onChangeText={(t)=>set(i, f.key, t)}
                multiline={f.multiline}
              />
            </View>
          ))}
          <View style={{ marginTop: 6, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => remove(i)} hitSlop={theme.utils.hitSlop}>
              <Text style={{ ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const }}>Xoá ví dụ</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={add}
        style={{ ...theme.button.ghost.container, alignSelf: 'flex-start', paddingHorizontal: theme.tokens.space.md }}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={{ ...theme.button.ghost.label, fontWeight: '700' as const }}>＋ Thêm ví dụ</Text>
      </TouchableOpacity>
    </>
  );
}
