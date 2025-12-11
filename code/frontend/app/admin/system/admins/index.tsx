import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, Href } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import SearchBar from "@/components/ui/SearchBar";
import ContentCard from "@/components/card/ContentCard";
import Chip from "@/components/ui/Chip";
import { listAdmins, type AdminDoc } from "@/api/admin/admins";

export default function AdminListScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [data, setData] = useState<AdminDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { const res = await listAdmins({ q, page: 1, limit: 50 }) as any; setData(res.data); }
    finally { setLoading(false); }
  }, [q]);

  useEffect(() => { reload(); }, [reload]);

  return (
    <LayoutDefault title="Quản trị viên">
      <View style={{ padding: theme.tokens.space.md, gap: theme.tokens.space.sm }}>
        <SearchBar value={q} onChangeText={setQ} onSubmit={reload} placeholder="Tìm email / họ tên…" />
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity onPress={() => router.push("/admin/system/admins/create" as Href)} style={theme.button.primary.container}>
            <Text style={theme.button.primary.label}>＋ Thêm admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ padding: theme.tokens.space.md }}><ActivityIndicator color={theme.color.textSub} /></View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(it) => it._id || it.email}
          contentContainerStyle={{ padding: theme.tokens.space.md, gap: theme.tokens.space.sm }}
          renderItem={({ item }) => (
            <ContentCard>
              <Text style={theme.text.title}>{item.fullName || "(Chưa đặt tên)"}</Text>
              <Text style={theme.text.secondary}>{item.email}</Text>
              <View style={{ marginTop: theme.tokens.space.xs, flexDirection: "row", gap: theme.tokens.space.xs, alignItems: "center" }}>
                <Text style={theme.text.meta}>Role:</Text>
                <Chip label={(item.roleId as any)?.title || "—"} active />
              </View>
              <View style={{ marginTop: theme.tokens.space.sm, flexDirection: "row", gap: theme.tokens.space.sm }}>
                <TouchableOpacity onPress={() => router.push(`/admin/system/admins/detail/${item._id}` as Href)} style={theme.button.ghost.container}>
                  <Text style={theme.button.ghost.label}>Chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/admin/system/admins/update/${item._id}` as Href)} style={theme.button.primary.container}>
                  <Text style={theme.button.primary.label}>Sửa</Text>
                </TouchableOpacity>
              </View>
            </ContentCard>
          )}
        />
      )}
    </LayoutDefault>
  );
}
