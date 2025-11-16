import React from 'react';
import { View } from 'react-native';
import Chip from './Chip';
import { useAppTheme } from '../../hooks/use-app-theme'

type JLPT = ''|'N5'|'N4'|'N3'|'N2'|'N1';
export default function JLPTPicker({
  value, onChange, levels = ['', 'N5','N4','N3','N2','N1'],
}: { value: JLPT; onChange: (v: JLPT) => void; levels?: JLPT[] }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.xs }}>
      {levels.map(lv => (
        <Chip key={lv || 'none'} label={lv || '—'} active={value === lv} onPress={() => onChange(lv)} />
      ))}
    </View>
  );
}
