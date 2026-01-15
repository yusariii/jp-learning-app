import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router, Href } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { appAlert, appError } from "@/helpers/appAlert";
import ContentCard from "@/components/admin/card/ContentCard";
import LabeledInput from "@/components/admin/ui/LabeledInput";
import RolePicker from "@/components/admin/ui/RolePicker";
import BackButton from "@/components/admin/ui/BackButton";
import { createAdmin, type AdminDoc } from "@/api/admin/admins";

export default function AdminCreateScreen() {
  const { theme } = useAppTheme();
  const { hasPermission, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/admin/auth/login' as Href);
      return;
    }
    if (!hasPermission('admin.create')) {
      router.replace('/admin/unauthorized' as Href);
    }
  }, [isLoading, isAuthenticated, hasPermission]);
  const [form, setForm] = useState<AdminDoc>({ email: "", password: "", fullName: "", roleId: "" });

  const submit = async () => {
    if (!form.email || !form.password || !form.roleId) {
      return appAlert("Thiếu dữ liệu", "Cần Email, Mật khẩu và Role.");
    }
    try {
      await createAdmin(form);
      appAlert("Đã tạo admin", "Tạo tài khoản quản trị viên thành công.", () => router.back());
    } catch (e:any) {
      appError(String(e?.message || e));
    }
  };

  return (
    <LayoutDefault title="Thêm quản trị viên">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/system/admins"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <LabeledInput label="Email *" value={form.email} onChangeText={(t)=>setForm(p=>({...p, email:t}))} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Mật khẩu *" value={form.password || ""} onChangeText={(t)=>setForm(p=>({...p, password:t}))} secureTextEntry />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Họ tên" value={form.fullName || ""} onChangeText={(t)=>setForm(p=>({...p, fullName:t}))} />
          <View style={{ height: theme.tokens.space.sm }} />
          <Text style={theme.text.h3}>Role *</Text>
          <View style={{ height: theme.tokens.space.xs }} />
          <RolePicker value={typeof form.roleId === "string" ? form.roleId : (form.roleId as any)?._id} onChange={(id)=>setForm(p=>({...p, roleId: id}))} />
        </ContentCard>

        <TouchableOpacity onPress={submit} style={[theme.button.primary.container, { marginTop: theme.tokens.space.md }]}>
          <Text style={theme.button.primary.label}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </LayoutDefault>
  );
}
