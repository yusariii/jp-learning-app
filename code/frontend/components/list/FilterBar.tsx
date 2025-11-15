import React from 'react';
import { View } from 'react-native';
import Chip from '../ui/Chip';
import { useAppTheme } from '../../hooks/use-app-theme'

// Dùng cho cả Word & Grammar
export type SortKey = 'updatedAt' | 'createdAt' | 'termJP' | 'title';

type JLPT = '' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

type Props = {
  jlptLevels: JLPT[];
  selected: JLPT;
  onSelect: (lv: JLPT) => void;
  sorts?: SortKey[];           // Word: ['updatedAt','createdAt','termJP']; Grammar: ['updatedAt','createdAt','title']
  sort?: SortKey;
  onSort?: (s: SortKey) => void;
};

export default function FilterBar({
  jlptLevels,
  selected,
  onSelect,
  sorts = ['updatedAt', 'createdAt', 'termJP'],
  sort = 'updatedAt',
  onSort,
}: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.tokens.space.xs }}>
        {jlptLevels.map(lv => (
          <Chip
            key={lv || 'none'}
            label={lv || '—'}
            active={selected === lv}
            onPress={() => onSelect(lv)}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.tokens.space.xs, marginLeft: 'auto' }}>
        {sorts.map(s => (
          <Chip
            key={s}
            label={s === 'updatedAt' ? 'Sửa gần nhất' : s === 'createdAt' ? 'Mới tạo' : s === 'termJP' ? 'A→Z' : 'A→Z'}
            active={sort === s}
            onPress={() => onSort?.(s)}
          />
        ))}
      </View>
    </View>
  );
}
