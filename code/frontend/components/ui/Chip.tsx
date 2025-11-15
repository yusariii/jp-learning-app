import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void; }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: '#d9d9d9', backgroundColor: '#fff', marginRight: 8, marginBottom: 8 },
  active: { backgroundColor: '#212121', borderColor: '#212121' },
  text: { fontSize: 13 },
  textActive: { color: '#fff', fontWeight: '700' },
});
