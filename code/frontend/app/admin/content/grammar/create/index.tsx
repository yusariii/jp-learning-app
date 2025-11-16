import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { createGrammar, type Grammar } from '../../../../../api/admin/content/grammar';
import { useAppTheme } from '../../../../../hooks/use-app-theme'
import FormSection from '../../../../../components/ui/FormSection'
import LabeledInput from '../../../../../components/ui/LabeledInput';
import JLPTPicker from '../../../../../components/ui/JLPTPicker';
import ExampleEditor from '../../../../../components/ui/ExampleEditor';
import { router } from 'expo-router';

type Example = Grammar['examples'][number];
type Form = Omit<Grammar, '_id'|'createdAt'|'updatedAt'>;
const emptyEx: Example = { sentenceJP: '', readingKana: '', meaningVI: '', meaningEN: '' };

export default function CreateGrammarScreen() {
  const { theme } = useAppTheme();

  const [form, setForm] = useState<Form>({
    title: '', description: '',
    explanationJP: '', explanationEN: '',
    jlptLevel: '', examples: [{ ...emptyEx }],
  });

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }));
  const isValid = !!form.title.trim() && !!form.explanationJP.trim();

  const submit = async () => {
    if (!isValid) return Alert.alert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Giải thích (JP)”.');
    try { await createGrammar(form as any); Alert.alert('Đã lưu'); router.back(); }
    catch (e:any) { Alert.alert('Lỗi', String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm ngữ pháp">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">

        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t=>setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Mô tả" value={form.description} onChangeText={t=>setField('description', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Giải thích (JP) *" value={form.explanationJP} onChangeText={t=>setField('explanationJP', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Explanation (EN)" value={form.explanationEN} onChangeText={t=>setField('explanationEN', t)} multiline />
        </FormSection>

        <FormSection title="JLPT">
          <JLPTPicker value={form.jlptLevel} onChange={v=>setField('jlptLevel', v)} />
        </FormSection>

        <FormSection title="Ví dụ">
          <ExampleEditor
            examples={form.examples}
            onChange={(next)=> setForm(p=>({ ...p, examples: next }))}
            fields={[
              { key: 'sentenceJP', label: 'Câu JP' },
              { key: 'readingKana', label: 'Kana' },
              { key: 'meaningVI', label: 'Nghĩa (VI)' },
              { key: 'meaningEN', label: 'Meaning (EN)' },
            ]}
          />
        </FormSection>

        <TouchableOpacity
          onPress={submit}
          disabled={!isValid}
          style={[theme.button.primary.container, { paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}
        >
          <Text style={theme.button.primary.label}>Lưu mục ngữ pháp</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
