// components/lesson/LinkedContentList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme';
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
  apiPath: string;     // "word", "reading", "grammar", ...
  ids: string[];
  emptyText: string;
};

const LinkedContentList: React.FC<Props> = ({ title, apiPath, ids, emptyText }) => {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LinkedItem[]>([]);

  useEffect(() => {
    let alive = true;

    // Không có id nào → không cần gọi API
    if (!ids.length) {
      setItems([]);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await get<{ data: LinkedItem[] }>(
          `${apiPath}?page=1&limit=1000`,
        );
        if (!alive) return;

        const list = res.data || [];
        const map = new Map(list.map((it) => [it._id, it]));
        const ordered = ids
          .map((id) => map.get(id))
          .filter(Boolean) as LinkedItem[];

        setItems(ordered);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [apiPath, ids.join(',')]); // join để deps đơn giản

  return (
    <View style={{ marginTop: theme.tokens.space.md }}>
      <Text style={theme.text.h3}>{title}</Text>

      {loading ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.tokens.space.xs,
            marginTop: theme.tokens.space.xs,
          }}
        >
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={theme.text.secondary}>Đang tải...</Text>
        </View>
      ) : (
        <View style={{ marginTop: theme.tokens.space.xs }}>
          {items.length ? (
            items.map((it) => (
              <Text key={it._id} style={theme.text.body}>
                • {labelOf(it)}
              </Text>
            ))
          ) : (
            <Text style={theme.text.secondary}>{emptyText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default LinkedContentList;
