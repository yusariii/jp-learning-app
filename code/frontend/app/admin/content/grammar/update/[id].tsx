import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appAlert, appError, appConfirm } from '@/helpers/appAlert';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { getGrammar, updateGrammar, deleteGrammar, type Grammar } from '../../../../../api/admin/content/grammar';
import { useAppTheme } from '../../../../../hooks/use-app-theme';
import FormSection from '../../../../../components/ui/FormSection';
import LabeledInput from '../../../../../components/ui/LabeledInput';
import JLPTPicker from '../../../../../components/ui/JLPTPicker';
import ExampleEditor from '../../../../../components/block/ExampleEditor';
import BackButton from '@/components/ui/BackButton';

type Example = Grammar['examples'][number];
type Form = Grammar;

export default function EditGrammarScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const g = await getGrammar(String(id));
        if (!alive) return;
        setForm({ ...g, examples: g.examples?.length ? g.examples : [{ sentenceJP: '', readingKana: '', meaningVI: '', meaningEN: '' }] });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => (p ? { ...p, [k]: v } : p));
  const isValid = !!form?.title?.trim() && !!form?.explanationJP?.trim();

  const save = async () => {
    if (!form || !isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Giải thích (JP)”.');
    try {
      await updateGrammar(String(form._id), {
        title: form.title,
        description: form.description,
        explanationJP: form.explanationJP,
        explanationEN: form.explanationEN,
        jlptLevel: form.jlptLevel,
        examples: form.examples || [],
      });
      appAlert('Đã lưu', 'Cập nhật thành công.');
    } catch (e: any) {
      appError(String(e?.message || e));
    }
  };

  const confirmDelete = () =>
    appConfirm('Xoá mục ngữ pháp', 'Bạn chắc chắn muốn xoá?', async () => {
      appConfirm(
        'Xoá ngữ pháp',
        'Bạn chắc chắn muốn xoá?',
        async () => {
          try {
            await deleteGrammar(String(form?._id));
            appAlert('Đã xoá', 'Ngữ pháp đã được xoá.', () => {
              router.replace('/admin/content/grammar' as Href);
            });
          } catch (e: any) {
            appError(String(e?.message || e));
          }
        },
        () => {
        },
      );
    });

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa ngữ pháp">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải…</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa ngữ pháp">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/grammar"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t => setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Mô tả" value={form.description || ''} onChangeText={t => setField('description', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Giải thích (JP) *" value={form.explanationJP} onChangeText={t => setField('explanationJP', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Explanation (EN)" value={form.explanationEN || ''} onChangeText={t => setField('explanationEN', t)} multiline />
        </FormSection>

        <FormSection title="JLPT">
          <JLPTPicker value={form.jlptLevel || ''} onChange={v => setField('jlptLevel', v)} />
        </FormSection>

        <FormSection title="Ví dụ">
          <ExampleEditor
            examples={form.examples || []}
            onChange={(next) => setForm(p => (p ? { ...p, examples: next } : p))}
            fields={[
              { key: 'sentenceJP', label: 'Câu JP' },
              { key: 'readingKana', label: 'Kana' },
              { key: 'meaningVI', label: 'Nghĩa (VI)' },
              { key: 'meaningEN', label: 'Meaning (EN)' },
            ]}
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

          <TouchableOpacity onPress={confirmDelete} style={[theme.button.primary.container, { backgroundColor: theme.color.danger, paddingVertical: 14, borderRadius: theme.tokens.radius.lg }]}>
            <Text style={theme.button.primary.label}>Xoá</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
