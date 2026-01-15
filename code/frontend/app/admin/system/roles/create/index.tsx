import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, Href } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { appAlert, appError } from "@/helpers/appAlert";
import ContentCard from "@/components/admin/card/ContentCard";
import LabeledInput from "@/components/admin/ui/LabeledInput";
import { createRole, type RoleDoc } from "@/api/admin/roles";
import BackButton from "@/components/admin/ui/BackButton";

const isSuperAdminTitle = (title?: string) =>
  typeof title === 'string' && title.trim().toLowerCase() === 'superadmin';

export default function RoleCreateScreen() {
  const { theme } = useAppTheme();
  const { hasPermission, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/admin/auth/login' as Href);
      return;
    }
    if (!hasPermission('role.create')) {
      router.replace('/admin/unauthorized' as Href);
    }
  }, [isLoading, isAuthenticated, hasPermission]);
  const [form, setForm] = useState<RoleDoc>({ title: "", description: "" });

  const submit = async () => {
    if (!form.title?.trim()) return appAlert("Thiếu dữ liệu", "Cần nhập tiêu đề role.");
    if (isSuperAdminTitle(form.title)) return appAlert("Không hợp lệ", "Không thể tạo role có tên SuperAdmin.");
    try {
      await createRole({ title: form.title.trim(), description: form.description?.trim() });
      appAlert("Đã tạo role", undefined, () => router.back());
    } catch (e:any) {
      appError(String(e?.message || e));
    }
  };

  return (
    <LayoutDefault title="Thêm role">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/system/roles"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={(t)=>setForm(p=>({ ...p, title: t }))} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Mô tả" value={form.description || ""} onChangeText={(t)=>setForm(p=>({ ...p, description: t }))} multiline />
        </ContentCard>

        <TouchableOpacity onPress={submit} style={[theme.button.primary.container, { marginTop: theme.tokens.space.md }]}>
          <Text style={theme.button.primary.label}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </LayoutDefault>
  );
}
