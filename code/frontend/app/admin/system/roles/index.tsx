import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter, Href } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import SearchBar from "@/components/ui/SearchBar";
import ContentCard from "@/components/card/ContentCard";
import { listRoles, type RoleDoc } from "@/api/admin/roles";
import BackButton from "@/components/ui/BackButton";

export default function RoleListScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RoleDoc[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listRoles({ q, page: 1, limit: 100 }) as any;
      setRows(res.data);
    } finally { setLoading(false); }
  }, [q]);

  useEffect(() => { reload(); }, [reload]);

  return (
    <LayoutDefault title="Role (vai trò)">
      <View style={{ padding: theme.tokens.space.md, gap: theme.tokens.space.sm }}>
        <BackButton
          fallbackHref="/admin"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <SearchBar value={q} onChangeText={setQ} onSubmit={reload} placeholder="Tìm theo tiêu đề/mô tả…" />
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity onPress={() => router.push("/admin/system/roles/create" as Href)} style={theme.button.primary.container}>
            <Text style={theme.button.primary.label}>＋ Thêm role</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ padding: theme.tokens.space.md }}><ActivityIndicator color={theme.color.textSub} /></View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it) => it._id || it.title}
          contentContainerStyle={{ padding: theme.tokens.space.md, gap: theme.tokens.space.sm }}
          renderItem={({ item }) => (
            <ContentCard>
              <Text style={theme.text.title}>{item.title}</Text>
              {!!item.description && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.description}</Text>}
              <View style={{ marginTop: theme.tokens.space.sm, flexDirection: "row", gap: theme.tokens.space.sm }}>
                <TouchableOpacity onPress={() => router.push(`/admin/system/roles/detail/${item._id}` as Href)} style={theme.button.ghost.container}>
                  <Text style={theme.button.ghost.label}>Chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/admin/system/roles/update/${item._id}` as Href)} style={theme.button.primary.container}>
                  <Text style={theme.button.primary.label}>Sửa</Text>
                </TouchableOpacity>
              </View>
            </ContentCard>
          )}
          ListEmptyComponent={<Text style={{ padding: theme.tokens.space.md }}>Chưa có role.</Text>}
        />
      )}
    </LayoutDefault>
  );
}
