import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, onSubmit, placeholder }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
      <View style={{ ...theme.surface.input, flex: 1 }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder || 'Tìm kiếm...'}
          returnKeyType="search"
          placeholderTextColor={theme.color.textMeta}
          style={{ ...theme.text.body, paddingVertical: 0 }}
        />
      </View>
      <TouchableOpacity
        onPress={onSubmit}
        style={{
          minHeight: theme.tokens.touch.min,
          paddingHorizontal: theme.tokens.space.md,
          paddingVertical: 12,
          borderRadius: theme.tokens.radius.md,
          backgroundColor: theme.color.surface,
          borderWidth: 1,
          borderColor: theme.color.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={{ ...theme.text.body, fontWeight: '700', color: theme.color.text }}>Tìm</Text>
      </TouchableOpacity>
    </View>
  );
}
