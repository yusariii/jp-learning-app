import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appAlert, appError, appConfirm } from '@/helpers/appAlert';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { getListening, updateListening, deleteListening, type Listening } from '@/api/admin/content/listening';
import { useAppTheme } from '@/hooks/use-app-theme';
import FormSection from '@/components/ui/FormSection';
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';
import ListeningQuestionEditor from '@/components/block/ListeningQuestionEditor';
import BackButton from '@/components/ui/BackButton';

type Form = Listening;

export default function EditListeningScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const it = await getListening(String(id));
        if (!alive) return;
        setForm({
          ...it,
          questions: it.questions?.length
            ? it.questions
            : [{ questionJP: '', questionEN: '', type: 'mcq', options: [{ text: '', isCorrect: true }], answer: '' }],
        });
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => (p ? { ...p, [k]: v } : p));
  const isValid = !!form?.title?.trim() && !!form?.audioUrl?.trim();

  const save = async () => {
    if (!form || !isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Audio URL”.');
    try {
      await updateListening(String(form._id), {
        title: form.title, audioUrl: form.audioUrl, transcriptJP: form.transcriptJP,
        transcriptEN: form.transcriptEN, difficulty: form.difficulty, questions: form.questions || [],
      });
      appAlert('Đã lưu', 'Cập nhật thành công.');
    } catch (e:any) { appError(String(e?.message || e)); }
  };

  const confirmDelete = () =>
    appConfirm('Xoá mục bài nghe', 'Bạn chắc chắn muốn xoá?', async () => {
          appConfirm(
            'Xoá bài nghe',
            'Bạn chắc chắn muốn xoá?',
            async () => {
              try {
                await deleteListening(String(form?._id));
                appAlert('Đã xoá', 'Bài nghe đã được xoá.', () => {
                  router.replace('/admin/content/listening' as Href);
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
      <LayoutDefault title="Sửa bài nghe">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải…</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa bài nghe">
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
            questions={form.questions || []}
            onChange={(next)=> setForm(p => (p ? { ...p, questions: next } : p))}
          />
        </FormSection>

        <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
          <TouchableOpacity onPress={save} disabled={!isValid} style={[theme.button.primary.container, { flex: 1, paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}>
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
