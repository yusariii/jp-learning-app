import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { appAlert, appError } from "@/helpers/appAlert";
import ContentCard from "@/components/admin/card/ContentCard";
import LabeledInput from "@/components/admin/ui/LabeledInput";
import DeleteButton from "@/components/admin/ui/DeleteButton";
import { getRole, updateRole, deleteRole, type RoleDoc } from "@/api/admin/roles";
import BackButton from "@/components/admin/ui/BackButton";

const isSuperAdminTitle = (title?: string) =>
  typeof title === 'string' && title.trim().toLowerCase() === 'superadmin';

export default function RoleEditScreen() {
  const { theme } = useAppTheme();
  const { hasPermission, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<RoleDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/admin/auth/login' as Href);
      return;
    }
    if (!hasPermission('role.update')) {
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
        setForm(it);
      }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const save = async () => {
    if (!form) return;
    if (!form.title?.trim()) return appAlert("Thiếu dữ liệu", "Cần nhập tiêu đề role.");
    if (isSuperAdminTitle(form.title)) return appAlert("Không hợp lệ", "Không thể đặt tên role là SuperAdmin.");
    try {
      await updateRole(String(form._id), { title: form.title.trim(), description: form.description?.trim() });
      appAlert("Đã lưu", "Cập nhật role thành công.");
    } catch (e:any) {
      appError(String(e?.message || e));
    }
  };

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa role">
        <View style={{ padding: theme.tokens.space.md }}><ActivityIndicator color={theme.color.textSub} /></View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa role">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/system/roles"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={(t)=>setForm(p=>p?{...p, title:t}:p)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Mô tả" value={form.description || ""} onChangeText={(t)=>setForm(p=>p?{...p, description:t}:p)} multiline />
        </ContentCard>

        <View style={{ flexDirection: "row", gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
          <TouchableOpacity onPress={save} style={[theme.button.primary.container, { flex: 1 }]}>
            <Text style={theme.button.primary.label}>Lưu</Text>
          </TouchableOpacity>
          {hasPermission('role.delete') && (
            <DeleteButton
              variant="solid"
              label="Xoá"
              onConfirm={async () => {
                await deleteRole(String(form._id));
                appAlert("Đã xoá", "Role đã được xoá.", () => router.back());
              }}
            />
          )}
        </View>
      </ScrollView>
    </LayoutDefault>
  );
}
