import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';

import { useAppTheme } from '../../hooks/use-app-theme';
import ContentCard from '../card/ContentCard';
import LabeledInput from '../ui/LabeledInput';
import Chip from '../ui/Chip';
import { get } from '../../helpers/http';

export type LinkedItem = {
  _id: string;
  title?: string;
  termJP?: string;      // word / grammar
  textJP?: string;      // reading
  questionJP?: string;  // speaking / listening
};

const labelOf = (it: LinkedItem) =>
  it.title || it.termJP || it.textJP || it.questionJP || it._id;

type Props = {
  title: string;
  apiPath: string;
  createHref: string;
  selectedIds: string[];
  onChangeSelected: (ids: string[]) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
};

const LinkedContentSelector: React.FC<Props> = ({
  title,
  apiPath,
  createHref,
  selectedIds,
  onChangeSelected,
  searchLabel = 'Tìm',
  searchPlaceholder,
}) => {
  const { theme } = useAppTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<LinkedItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await get<{ data: LinkedItem[] }>(
          `${apiPath}?page=1&limit=1000`,
        );
        if (!alive) return;
        setOptions(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [apiPath]);

  const filtered = useMemo(
    () =>
      options.filter((item) =>
        labelOf(item).toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  const toggle = (id: string) => {
    const exists = selectedIds.includes(id);
    const next = exists
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChangeSelected(next);
  };

  return (
    <ContentCard>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.tokens.space.xs,
        }}
      >
        <Text style={theme.text.h2}>{title}</Text>
        <TouchableOpacity
          onPress={() => router.push(createHref as Href)}
          hitSlop={theme.utils.hitSlop}
        >
          <Text style={theme.button.ghost.label}>＋ Tạo mới</Text>
        </TouchableOpacity>
      </View>

      <LabeledInput
        label={searchLabel}
        value={search}
        onChangeText={setSearch}
        placeholder={searchPlaceholder}
      />

      {loading ? (
        <View
          style={{
            paddingVertical: theme.tokens.space.sm,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.tokens.space.xs,
          }}
        >
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={theme.text.secondary}>Đang tải...</Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.tokens.space.xs,
            marginTop: theme.tokens.space.xs,
          }}
        >
          {filtered.map((item) => {
            const selected = selectedIds.includes(item._id);
            return (
              <Chip
                key={item._id}
                label={labelOf(item)}
                active={selected}
                onPress={() => toggle(item._id)}
              />
            );
          })}

          {!filtered.length && (
            <Text style={theme.text.secondary}>Không có mục phù hợp.</Text>
          )}
        </View>
      )}
    </ContentCard>
  );
};

export default LinkedContentSelector;
