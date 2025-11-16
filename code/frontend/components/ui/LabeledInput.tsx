import React from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'

export default function LabeledInput({
  label, multiline, style, ...rest
}: { label: string } & TextInputProps) {
  const { theme } = useAppTheme();
  return (
    <>
      <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>{label}</Text>
      <TextInput
        {...rest}
        multiline={multiline}
        style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0, ...(style as object) }}
        placeholderTextColor={theme.color.textMeta}
      />
    </>
  );
}
