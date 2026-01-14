import React from 'react';
import { View, StyleSheet } from 'react-native';
import DictionaryScreen from '../dictionary/index';

export default function DictionaryTab() {
  return (
    <View style={styles.container}>
      <DictionaryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
