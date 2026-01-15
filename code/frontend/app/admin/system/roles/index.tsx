import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter, Href, useFocusEffect } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import SearchBar from "@/components/admin/ui/SearchBar";
import ContentCard from "@/components/admin/card/ContentCard";
import { listRoles, type RoleDoc } from "@/api/admin/roles";
import BackButton from "@/components/admin/ui/BackButton";

const isSuperAdminTitle = (title?: string) =>
  typeof title === 'string' && title.trim().toLowerCase() === 'superadmin';

export default function RoleListScreen() {
  const { theme } = useAppTheme();
  const { role, hasPermission, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/admin/auth/login' as Href);
      return;
    }
    if (!hasPermission('role.view')) {
      router.replace('/admin/unauthorized' as Href);
    }
  }, [isLoading, isAuthenticated, hasPermission, router]);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RoleDoc[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listRoles({ q, page: 1, limit: 100 }) as any;
      setRows((res.data || []).filter((r: RoleDoc) => !isSuperAdminTitle(r?.title)));
    } finally { setLoading(false); }
  }, [q]);

  useEffect(() => { reload(); }, [reload]);

  // When navigating back from create/update screens, this list screen is usually kept mounted.
  // useFocusEffect ensures we refresh data when it becomes active again.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return (
    <LayoutDefault title="Role (vai trò)">
      <View style={{ padding: theme.tokens.space.md, gap: theme.tokens.space.sm }}>
        <BackButton
          fallbackHref="/admin"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <SearchBar value={q} onChangeText={setQ} onSubmit={reload} placeholder="Tìm theo tiêu đề/mô tả…" />
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          {hasPermission('role.create') && (
            <TouchableOpacity onPress={() => router.push("/admin/system/roles/create" as Href)} style={theme.button.primary.container}>
              <Text style={theme.button.primary.label}>＋ Thêm role</Text>
            </TouchableOpacity>
          )}
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
                {hasPermission('role.update') && (
                  <TouchableOpacity onPress={() => router.push(`/admin/system/roles/update/${item._id}` as Href)} style={theme.button.primary.container}>
                    <Text style={theme.button.primary.label}>Sửa</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ContentCard>
          )}
          ListEmptyComponent={<Text style={{ padding: theme.tokens.space.md }}>Chưa có role.</Text>}
        />
      )}
    </LayoutDefault>
  );
}
