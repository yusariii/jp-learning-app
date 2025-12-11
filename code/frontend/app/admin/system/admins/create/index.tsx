import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import ContentCard from "@/components/card/ContentCard";
import LabeledInput from "@/components/ui/LabeledInput";
import RolePicker from "@/components/ui/RolePicker";
import { createAdmin, type AdminDoc } from "@/api/admin/admins";

export default function AdminCreateScreen() {
  const { theme } = useAppTheme();
  const [form, setForm] = useState<AdminDoc>({ email: "", password: "", fullName: "", roleId: "" });

  const submit = async () => {
    if (!form.email || !form.password || !form.roleId) {
      return Alert.alert("Thiếu dữ liệu", "Cần Email, Mật khẩu và Role.");
    }
    try { await createAdmin(form); Alert.alert("Đã tạo admin"); router.back(); }
    catch (e:any) { Alert.alert("Lỗi", String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm quản trị viên">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
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
