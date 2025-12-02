import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { appAlert, appError } from '@/helpers/appAlert';
import LayoutDefault from '@/layout-default/layout-default';
import { createSpeaking, type Speaking } from '@/api/admin/content/speaking';
import { useAppTheme } from '@/hooks/use-app-theme';
import FormSection from '@/components/ui/FormSection';
import LabeledInput from '@/components/ui/LabeledInput';
import PromptsEditor from '@/components/block/PromptsEditor';
import BackButton from '@/components/ui/BackButton';
import { router } from 'expo-router';

type Form = Omit<Speaking, '_id'|'createdAt'|'updatedAt'>;

export default function CreateSpeakingScreen() {
  const { theme } = useAppTheme();
  const [form, setForm] = useState<Form>({
    title: '',
    prompts: [{ promptJP: '', promptEN: '', expectedSample: '' }],
    guidance: '',
    sampleAudioUrl: '',
  });
  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }));
  const isValid = !!form.title.trim() && form.prompts.some(p => p.promptJP.trim());

  const submit = async () => {
    if (!isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và ít nhất 1 Prompt (JP).');
    try { await createSpeaking(form as any); appAlert('Đã tạo chủ đề'); router.back(); }
    catch (e:any) { appError(String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm chủ đề nói">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/speaking"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t=>setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Hướng dẫn" value={form.guidance || ''} onChangeText={t=>setField('guidance', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Sample Audio URL" value={form.sampleAudioUrl || ''} onChangeText={t=>setField('sampleAudioUrl', t)} autoCapitalize="none" keyboardType="url" />
        </FormSection>

        <FormSection title="Prompts">
          <PromptsEditor
            prompts={form.prompts}
            onChange={(next)=> setForm(p=>({ ...p, prompts: next }))}
          />
        </FormSection>

        <TouchableOpacity
          onPress={submit}
          disabled={!isValid}
          style={[theme.button.primary.container, { paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}
        >
          <Text style={theme.button.primary.label}>Lưu chủ đề nói</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
