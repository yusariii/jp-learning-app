import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import ContentCard from "@/components/card/ContentCard";
import LabeledInput from "@/components/ui/LabeledInput";
import RolePicker from "@/components/ui/RolePicker";
import { getAdmin, updateAdmin, deleteAdmin, type AdminDoc } from "@/api/admin/admins";
import DeleteButton from "@/components/ui/DeleteButton";

export default function AdminEditScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<AdminDoc | null>(null);
  const [loading, setLoading] = useState(true);

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
    try { await updateAdmin(String(form._id), { email: form.email, fullName: form.fullName, roleId: typeof form.roleId === "string" ? form.roleId : (form.roleId as any)._id, ...(form.password ? { password: form.password } : {}) }); Alert.alert("Đã lưu"); }
    catch (e:any) { Alert.alert("Lỗi", String(e?.message || e)); }
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
          <DeleteButton
            variant="solid"
            label="Xoá"
            onConfirm={async () => { await deleteAdmin(String(form._id)); Alert.alert("Đã xoá"); router.back(); }}
          />
        </View>
      </ScrollView>
    </LayoutDefault>
  );
}
