import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import { appAlert, appError } from '@/helpers/appAlert';
import LayoutDefault from '@/layout-default/layout-default';
import { createReading, type Reading } from '@/api/admin/content/reading';
import { useAppTheme } from '@/hooks/use-app-theme'
import FormSection from '@/components/ui/FormSection'
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';
import QuestionEditor from '@/components/block/QuestionEditor';
import BackButton from '@/components/ui/BackButton';
import { router } from 'expo-router';

type Form = Omit<Reading, '_id'|'createdAt'|'updatedAt'>;

export default function CreateReadingScreen() {
  const { theme } = useAppTheme();

  const [form, setForm] = useState<Form>({
    title: '',
    textJP: '',
    textEN: '',
    audioUrl: '',
    difficulty: 'easy',
    comprehension: [{
      questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: ''
    }],
  });

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }));
  const isValid = !!form.title.trim() && !!form.textJP.trim();

  const submit = async () => {
    if (!isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Nội dung JP”.');
    try { await createReading(form as any); appAlert('Đã tạo bài đọc'); router.back(); }
    catch (e:any) { appError(String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm bài đọc">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/reading"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t=>setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Nội dung (JP) *" value={form.textJP} onChangeText={t=>setField('textJP', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Nội dung (EN)" value={form.textEN || ''} onChangeText={t=>setField('textEN', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Audio URL" value={form.audioUrl || ''} onChangeText={t=>setField('audioUrl', t)} autoCapitalize="none" keyboardType="url" />
        </FormSection>

        <FormSection title="Độ khó">
          <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, flexWrap: 'wrap' }}>
            {(['easy','medium','hard'] as const).map(d => (
              <Chip key={d} label={d} active={form.difficulty === d} onPress={()=>setField('difficulty', d)} />
            ))}
          </View>
        </FormSection>

        <FormSection title="Câu hỏi hiểu bài">
          <QuestionEditor
            questions={form.comprehension}
            onChange={(next)=> setForm(p=>({ ...p, comprehension: next }))}
          />
        </FormSection>

        <TouchableOpacity
          onPress={submit}
          disabled={!isValid}
          style={[theme.button.primary.container, { paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}
        >
          <Text style={theme.button.primary.label}>Lưu bài đọc</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
