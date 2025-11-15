import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};
export default function SearchBar({ value, onChangeText, onSubmit, placeholder }: Props) {
  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder || 'Tìm kiếm...'}
        returnKeyType="search"
        style={styles.input}
      />
      <TouchableOpacity onPress={onSubmit} style={styles.btn}>
        <Text style={styles.btnText}>Tìm</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: '#d9d9d9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fafafa' },
  btn: { paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth, borderColor: '#d9d9d9', justifyContent: 'center' },
  btnText: { fontWeight: '700' },
});
