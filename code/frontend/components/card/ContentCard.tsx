import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ContentCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginVertical: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: '#eee' },
});
