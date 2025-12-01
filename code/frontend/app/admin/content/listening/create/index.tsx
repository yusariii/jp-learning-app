import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { appAlert, appError } from '@/helpers/appAlert';
import LayoutDefault from '@/layout-default/layout-default';
import { createListening, type Listening } from '@/api/admin/content/listening';
import { useAppTheme } from '@/hooks/use-app-theme'
import FormSection from '@/components/ui/FormSection';
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';
import ListeningQuestionEditor from '@/components/block/ListeningQuestionEditor';
import BackButton from '@/components/ui/BackButton';
import { router } from 'expo-router';

type Form = Omit<Listening, '_id'|'createdAt'|'updatedAt'>;

export default function CreateListeningScreen() {
  const { theme } = useAppTheme();
  const [form, setForm] = useState<Form>({
    title: '', audioUrl: '', transcriptJP: '', transcriptEN: '',
    difficulty: 'easy',
    questions: [{ questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' }],
  });

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }));
  const isValid = !!form.title.trim() && !!form.audioUrl.trim();

  const submit = async () => {
    if (!isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Audio URL”.');
    try { await createListening(form as any); appAlert('Đã tạo bài nghe'); router.back(); }
    catch (e:any) { appError(String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm bài nghe">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/listening"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t=>setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Audio URL *" value={form.audioUrl} onChangeText={t=>setField('audioUrl', t)} autoCapitalize="none" keyboardType="url" />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Transcript (JP)" value={form.transcriptJP || ''} onChangeText={t=>setField('transcriptJP', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Transcript (EN)" value={form.transcriptEN || ''} onChangeText={t=>setField('transcriptEN', t)} multiline />
        </FormSection>

        <FormSection title="Độ khó">
          <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, flexWrap: 'wrap' }}>
            {(['easy','medium','hard'] as const).map(d => (
              <Chip key={d} label={d} active={form.difficulty === d} onPress={()=>setField('difficulty', d)} />
            ))}
          </View>
        </FormSection>

        <FormSection title="Câu hỏi nghe hiểu">
          <ListeningQuestionEditor
            questions={form.questions}
            onChange={(next)=> setForm(p=>({ ...p, questions: next }))}
          />
        </FormSection>

        <TouchableOpacity
          onPress={submit}
          disabled={!isValid}
          style={[theme.button.primary.container, { paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}
        >
          <Text style={theme.button.primary.label}>Lưu bài nghe</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
