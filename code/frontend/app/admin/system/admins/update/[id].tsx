import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { appAlert, appError } from "@/helpers/appAlert";
import ContentCard from "@/components/admin/card/ContentCard";
import LabeledInput from "@/components/admin/ui/LabeledInput";
import RolePicker from "@/components/admin/ui/RolePicker";
import { getAdmin, updateAdmin, deleteAdmin, type AdminDoc } from "@/api/admin/admins";
import DeleteButton from "@/components/admin/ui/DeleteButton";
import BackButton from "@/components/admin/ui/BackButton";

export default function AdminEditScreen() {
  const { theme } = useAppTheme();
  const { hasPermission, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<AdminDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/admin/auth/login' as Href);
      return;
    }
    if (!hasPermission('admin.update')) {
      router.replace('/admin/unauthorized' as Href);
    }
  }, [authLoading, isAuthenticated, hasPermission, router]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const it = await getAdmin(String(id)); if (alive) setForm(it); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const save = async () => {
    if (!form) return;
    try {
      await updateAdmin(String(form._id), {
        email: form.email,
        fullName: form.fullName,
        roleId: typeof form.roleId === "string" ? form.roleId : (form.roleId as any)._id,
        ...(form.password ? { password: form.password } : {}),
      });
      appAlert("Đã lưu", "Cập nhật quản trị viên thành công.");
    } catch (e:any) {
      appError(String(e?.message || e));
    }
  };

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa quản trị viên">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa quản trị viên">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        <BackButton
          fallbackHref="/admin/system/admins"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <ContentCard>
          <LabeledInput label="Email *" value={form.email} onChangeText={(t)=>setForm(p=>p?{...p, email:t}:p)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Đổi mật khẩu (để trống nếu không đổi)" value={form.password || ""} onChangeText={(t)=>setForm(p=>p?{...p, password:t}:p)} secureTextEntry />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Họ tên" value={form.fullName || ""} onChangeText={(t)=>setForm(p=>p?{...p, fullName:t}:p)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <Text style={theme.text.h3}>Role *</Text>
          <View style={{ height: theme.tokens.space.xs }} />
          <RolePicker
            value={typeof form.roleId === "string" ? form.roleId : (form.roleId as any)?._id}
            onChange={(id)=>setForm(p=>p?{...p, roleId: id}:p)}
          />
        </ContentCard>

        <View style={{ flexDirection: "row", gap: theme.tokens.space.sm, marginTop: theme.tokens.space.md }}>
          <TouchableOpacity onPress={save} style={[theme.button.primary.container, { flex: 1 }]}>
            <Text style={theme.button.primary.label}>Lưu</Text>
          </TouchableOpacity>
          {hasPermission('admin.delete') && (
            <DeleteButton
              variant="solid"
              label="Xoá"
              onConfirm={async () => {
                await deleteAdmin(String(form._id));
                appAlert("Đã xoá", "Quản trị viên đã được xoá.", () => router.back());
              }}
            />
          )}
        </View>
      </ScrollView>
    </LayoutDefault>
  );
}
