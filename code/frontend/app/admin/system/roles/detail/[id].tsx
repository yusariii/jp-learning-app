import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import ContentCard from "@/components/admin/card/ContentCard";
import { getRole, type RoleDoc } from "@/api/admin/roles";
import BackButton from "@/components/admin/ui/BackButton";

const isSuperAdminTitle = (title?: string) =>
  typeof title === 'string' && title.trim().toLowerCase() === 'superadmin';

export default function RoleDetailScreen() {
  const { theme } = useAppTheme();
  const { hasPermission, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<RoleDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/admin/auth/login' as Href);
      return;
    }
    if (!hasPermission('role.view')) {
      router.replace('/admin/unauthorized' as Href);
    }
  }, [authLoading, isAuthenticated, hasPermission, router]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const it = await getRole(String(id));
        if (!alive) return;
        if (isSuperAdminTitle(it?.title)) {
          router.replace('/admin/system/roles' as Href);
          return;
        }
        setItem(it);
      }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <LayoutDefault title="Chi tiết role">
        <View style={{ padding: theme.tokens.space.md }}><ActivityIndicator color={theme.color.textSub} /></View>
      </LayoutDefault>
    );
  }
  if (!item) {
    return (
      <LayoutDefault title="Chi tiết role">
        <View style={{ padding: theme.tokens.space.md }}><Text>Không tìm thấy dữ liệu.</Text></View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Chi tiết role">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/system/roles"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <Text style={theme.text.h1}>{item.title}</Text>
          {!!item.description && <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.xs }]}>{item.description}</Text>}
          <View style={{ height: theme.tokens.space.sm }} />
          {/* Nút đi tới trang phân quyền riêng */}
          <TouchableOpacity onPress={() => router.push(`/admin/system/roles/${item._id}/permissions` as Href)} style={theme.button.ghost.container}>
            <Text style={theme.button.ghost.label}>Quản lý phân quyền (màn riêng)</Text>
          </TouchableOpacity>
          <View style={{ height: theme.tokens.space.sm }} />
          {hasPermission('role.update') && (
            <TouchableOpacity onPress={() => router.push(`/admin/system/roles/update/${item._id}` as Href)} style={theme.button.primary.container}>
              <Text style={theme.button.primary.label}>Sửa</Text>
            </TouchableOpacity>
          )}
        </ContentCard>
      </ScrollView>
    </LayoutDefault>
  );
}
