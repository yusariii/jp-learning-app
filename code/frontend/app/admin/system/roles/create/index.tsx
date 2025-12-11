import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import ContentCard from "@/components/card/ContentCard";
import LabeledInput from "@/components/ui/LabeledInput";
import { createRole, type RoleDoc } from "@/api/admin/roles";

export default function RoleCreateScreen() {
  const { theme } = useAppTheme();
  const [form, setForm] = useState<RoleDoc>({ title: "", description: "" });

  const submit = async () => {
    if (!form.title?.trim()) return Alert.alert("Thiếu dữ liệu", "Cần nhập tiêu đề role.");
    try { await createRole({ title: form.title.trim(), description: form.description?.trim() }); Alert.alert("Đã tạo role"); router.back(); }
    catch (e:any) { Alert.alert("Lỗi", String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm role">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
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
