import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chip from '../ui/Chip';

type Props = {
  jlptLevels: Array<'' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'>;
  selected: '' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  onSelect: (lv: Props['selected']) => void;
  sorts?: Array<'updatedAt'|'createdAt'|'termJP'>;
  sort?: 'updatedAt'|'createdAt'|'termJP';
  onSort?: (s: Props['sort']) => void;
};
export default function FilterBar({ jlptLevels, selected, onSelect, sorts=['updatedAt','createdAt','termJP'], sort='updatedAt', onSort }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {jlptLevels.map(lv => <Chip key={lv||'none'} label={lv || '—'} active={selected===lv} onPress={() => onSelect(lv)} />)}
      </View>
      <View style={[styles.row, { marginLeft: 'auto' }]}>
        {sorts.map(s => (
          <Chip key={s}
            label={s==='updatedAt' ? 'Sửa gần nhất' : s==='createdAt' ? 'Mới tạo' : 'A→Z'}
            active={sort===s}
            onPress={() => onSort?.(s)}
          />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
});
