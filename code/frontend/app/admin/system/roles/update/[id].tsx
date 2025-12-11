import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import LayoutDefault from "@/layout-default/layout-default";
import { useAppTheme } from "@/hooks/use-app-theme";
import ContentCard from "@/components/card/ContentCard";
import LabeledInput from "@/components/ui/LabeledInput";
import DeleteButton from "@/components/ui/DeleteButton";
import { getRole, updateRole, deleteRole, type RoleDoc } from "@/api/admin/roles";
import BackButton from "@/components/ui/BackButton";

export default function RoleEditScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<RoleDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const it = await getRole(String(id)); if (alive) setForm(it); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const save = async () => {
    if (!form) return;
    if (!form.title?.trim()) return Alert.alert("Thiếu dữ liệu", "Cần nhập tiêu đề role.");
    try { await updateRole(String(form._id), { title: form.title.trim(), description: form.description?.trim() }); Alert.alert("Đã lưu"); }
    catch (e:any) { Alert.alert("Lỗi", String(e?.message || e)); }
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
          fallbackHref="/admin/system/admins"
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
          <DeleteButton
            variant="solid"
            label="Xoá"
            onConfirm={async () => { await deleteRole(String(form._id)); Alert.alert("Đã xoá"); router.back(); }}
          />
        </View>
      </ScrollView>
    </LayoutDefault>
  );
}
