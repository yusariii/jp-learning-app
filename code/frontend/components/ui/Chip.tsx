import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';

type Props = { label: string; active?: boolean; onPress?: () => void; };

export default function Chip({ label, active, onPress }: Props) {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        theme.chip.container,
        { height: theme.chip.height },
        active && theme.chip.active.container,
      ]}
      hitSlop={theme.utils.hitSlop}
      activeOpacity={0.7}
    >
      <Text style={[theme.chip.label, active && theme.chip.active.label]}>{label}</Text>
    </TouchableOpacity>
  );
}
