import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TagPills({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <View style={styles.wrap}>
      {tags.map(t => (
        <View key={t} style={styles.pill}><Text style={styles.txt}>{t}</Text></View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#f3f3f3' },
  txt: { fontSize: 12 },
});
