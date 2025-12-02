import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appAlert, appError, appConfirm } from '@/helpers/appAlert';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { getReading, updateReading, deleteReading, type Reading } from '@/api/admin/content/reading';
import { useAppTheme } from '@/hooks/use-app-theme';
import FormSection from '@/components/ui/FormSection';
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';
import QuestionEditor from '@/components/block/QuestionEditor';
import BackButton from '@/components/ui/BackButton';

type Form = Reading;

export default function EditReadingScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await getReading(String(id));
        if (!alive) return;
        setForm({
          ...r,
          comprehension: r.comprehension?.length
            ? r.comprehension
            : [{ questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' }],
        });
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => (p ? { ...p, [k]: v } : p));
  const isValid = !!form?.title?.trim() && !!form?.textJP?.trim();

  const save = async () => {
    if (!form || !isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Nội dung JP”.');
    try {
      await updateReading(String(form._id), {
        title: form.title,
        textJP: form.textJP,
        textEN: form.textEN,
        audioUrl: form.audioUrl,
        difficulty: form.difficulty,
        comprehension: form.comprehension || [],
      });
      appAlert('Đã lưu', 'Cập nhật thành công.');
    } catch (e: any) { appError(String(e?.message || e)); }
  };

  const confirmDelete = () =>
    appConfirm('Xoá mục bài đọc', 'Bạn chắc chắn muốn xoá?', async () => {
              appConfirm(
                'Xoá bài đọc',
                'Bạn chắc chắn muốn xoá?',
                async () => {
                  try {
                    await deleteReading(String(form?._id));
                    appAlert('Đã xoá', 'Bài đọc đã được xoá.', () => {
                      router.replace('/admin/content/reading' as Href);
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
      <LayoutDefault title="Sửa bài đọc">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải…</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa bài đọc">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/reading"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={t => setField('title', t)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Nội dung (JP) *" value={form.textJP} onChangeText={t => setField('textJP', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Nội dung (EN)" value={form.textEN || ''} onChangeText={t => setField('textEN', t)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Audio URL" value={form.audioUrl || ''} onChangeText={t => setField('audioUrl', t)} autoCapitalize="none" keyboardType="url" />
        </FormSection>

        <FormSection title="Độ khó">
          <View style={{ flexDirection: 'row', gap: theme.tokens.space.xs, flexWrap: 'wrap' }}>
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <Chip key={d} label={d} active={form.difficulty === d} onPress={() => setField('difficulty', d)} />
            ))}
          </View>
        </FormSection>

        <FormSection title="Câu hỏi hiểu bài">
          <QuestionEditor
            questions={form.comprehension || []}
            onChange={(next) => setForm(p => (p ? { ...p, comprehension: next } : p))}
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
