import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

export interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const { theme } = useAppTheme();
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.color.border }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
            backgroundColor: theme.color.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
