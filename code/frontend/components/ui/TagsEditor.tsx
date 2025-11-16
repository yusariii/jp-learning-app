import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';

export default function TagsEditor({
  tags, onAdd, onRemove, draft, onDraftChange,
}: {
  tags: string[]; onAdd: () => void; onRemove: (t:string)=>void;
  draft: string; onDraftChange: (v:string)=>void;
}) {
  const { theme } = useAppTheme();
  return (
    <>
      <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm, alignItems: 'center' }}>
        <TextInput
          placeholder="nhập tag rồi nhấn +"
          value={draft}
          onChangeText={onDraftChange}
          style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0, flex: 1 }}
          placeholderTextColor={theme.color.textMeta}
        />
        <TouchableOpacity onPress={onAdd} style={theme.button.primary.container} hitSlop={theme.utils.hitSlop}>
          <Text style={theme.button.primary.label}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.xs, marginTop: theme.tokens.space.sm }}>
        {tags.map(t => (
          <View key={t} style={{
            ...theme.chip.container, height: theme.chip.height,
            backgroundColor: theme.color.surfaceAlt, borderColor: theme.color.border, borderWidth: 1,
            flexDirection: 'row', alignItems: 'center', gap: 6,
          }}>
            <Text style={theme.chip.label}>{t}</Text>
            <TouchableOpacity onPress={() => onRemove(t)} hitSlop={theme.utils.hitSlop}>
              <Text style={{ ...theme.text.title, fontSize: 18, lineHeight: 18 }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );
}
