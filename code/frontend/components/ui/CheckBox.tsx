import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function Checkbox({
  checked, onChange, label, disabled,
}: { checked: boolean; onChange: (v:boolean)=>void; label?: string; disabled?: boolean }) {
  const { theme } = useAppTheme();
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      style={{ flexDirection:'row', alignItems:'center', gap: theme.tokens.space.xs, opacity: disabled ? 0.6 : 1 }}
    >
      <View style={{
        width: 20, height: 20, borderRadius: 6,
        borderWidth: 2, borderColor: checked ? theme.color.primary : theme.color.border,
        backgroundColor: checked ? theme.color.primarySoft : theme.color.bgBase,
        alignItems:'center', justifyContent:'center'
      }}>
        {checked && <View style={{ width: 10, height: 10, backgroundColor: theme.color.primary, borderRadius: 2 }} />}
      </View>
      {label ? <Text style={theme.text.body}>{label}</Text> : null}
    </Pressable>
  );
}
