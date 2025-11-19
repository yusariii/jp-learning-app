import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { getSpeaking, updateSpeaking, deleteSpeaking, type Speaking } from '../../../../../api/admin/content/speaking';
import { useAppTheme } from '../../../../../hooks/use-app-theme';
import FormSection from '../../../../../components/ui/FormSection';
import LabeledInput from '../../../../../components/ui/LabeledInput';
import PromptsEditor from '../../../../../components/block/PromptsEditor';

type Form = Speaking;

export default function EditSpeakingScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getSpeaking(String(id));
        if (!alive) return;
        setForm({
          ...s,
          prompts: s.prompts?.length ? s.prompts : [{ promptJP: '', promptEN: '', expectedSample: '' }],
        });
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => (p ? { ...p, [k]: v } : p));
  const isValid = !!form?.title?.trim() && (form?.prompts || []).some(p => p.promptJP?.trim());

  const save = async () => {
    if (!form || !isValid) return Alert.alert('Thiếu dữ liệu', 'Cần “Tiêu đề” và ít nhất 1 Prompt (JP).');
    try {
      await updateSpeaking(String(form._id), {
        title: form.title,
        guidance: form.guidance,
        sampleAudioUrl: form.sampleAudioUrl,
        prompts: form.prompts || [],
      });
      Alert.alert('Đã lưu', 'Cập nhật thành công.');
    } catch (e:any) { Alert.alert('Lỗi', String(e?.message || e)); }
  };

  const confirmDelete = () =>
    Alert.alert('Xoá chủ đề', 'Bạn chắc chắn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: del },
    ]);

  const del = async () => {
    try { await deleteSpeaking(String(form?._id)); Alert.alert('Đã xoá'); router.back(); }
    catch (e:any) { Alert.alert('Lỗi', String(e?.message || e)); }
  };

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa chủ đề nói">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải…</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa chủ đề nói">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t=>setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Hướng dẫn" value={form.guidance || ''} onChangeText={t=>setField('guidance', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Sample Audio URL" value={form.sampleAudioUrl || ''} onChangeText={t=>setField('sampleAudioUrl', t)} autoCapitalize="none" keyboardType="url" />
        </FormSection>

        <FormSection title="Prompts">
          <PromptsEditor
            prompts={form.prompts || []}
            onChange={(next)=> setForm(p => (p ? { ...p, prompts: next } : p))}
          />
        </FormSection>

        <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
          <TouchableOpacity
            onPress={save}
            disabled={!isValid}
            style={[theme.button.primary.container, { flex: 1, paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}
          >
            <Text style={theme.button.primary.label}>Lưu thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmDelete}
            style={[theme.button.primary.container, { backgroundColor: theme.color.danger, paddingVertical: 14, borderRadius: theme.tokens.radius.lg }]}
          >
            <Text style={theme.button.primary.label}>Xoá</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
