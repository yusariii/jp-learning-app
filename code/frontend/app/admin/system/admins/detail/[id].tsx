import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import ContentCard from "@/components/card/ContentCard";
import { getAdmin, type AdminDoc } from "@/api/admin/admins";

export default function AdminDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<AdminDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const it = await getAdmin(String(id)); if (alive) setItem(it); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết quản trị viên">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
        </View>
      </LayoutDefault>
    );
  }
  if (!item) {
    return (
      <LayoutDefault title="Chi tiết quản trị viên">
        <View style={{ padding: theme.tokens.space.md }}>
          <Text style={theme.text.body}>Không tìm thấy dữ liệu.</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Chi tiết quản trị viên">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <ContentCard>
          <Text style={theme.text.h1}>{item.fullName || "(Chưa đặt tên)"}</Text>
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.email}</Text>
          <View style={{ height: theme.tokens.space.sm }} />
          <Text style={theme.text.meta}>Role: {(item.roleId as any)?.title || "—"}</Text>
          <View style={{ flexDirection: "row", gap: theme.tokens.space.sm, marginTop: theme.tokens.space.sm }}>
            <TouchableOpacity onPress={() => router.push(`/admin/system/admins/edit/${item._id}` as Href)} style={theme.button.primary.container}>
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()} style={theme.button.ghost.container}>
              <Text style={theme.button.ghost.label}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </ContentCard>
      </ScrollView>
    </LayoutDefault>
  );
}
