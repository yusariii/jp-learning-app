// app/admin/content/test/edit/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appAlert, appConfirm, appError } from '@/helpers/appAlert';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';

import LayoutDefault from '@/layout-default/layout-default';
import { useAppTheme } from '@/hooks/use-app-theme';
import LabeledInput from '@/components/ui/LabeledInput';
import FormSection from '@/components/ui/FormSection';
import Chip from '@/components/ui/Chip';
import BackButton from '@/components/ui/BackButton';

import { getTest, updateTest, deleteTest, type TestDoc } from '@/api/admin/content/test';
import SimpleUnitEditor from '@/components/block/SimpleUnitEditor';
import ReadingUnitEditor from '@/components/block/ReadingUnitEditor';
import ListeningUnitEditor from '@/components/block/ListeningUnitEditor';
import JLPTPicker from '@/components/ui/JLPTPicker';


export default function EditTestScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<TestDoc | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const it = await getTest(String(id)); if (!alive) return; setForm(it); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const isValid = !!form?.title?.trim() && !!form?.jlptLevel;

  const save = async () => {
    if (!form || !isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Level”.');
    try {
      await updateTest(String(form._id), {
        title: form.title, description: form.description, jlptLevel: form.jlptLevel, published: !!form.published,
        passingScorePercent: form.passingScorePercent ?? 70,
        vocabSection: form.vocabSection,
        grammarReadingSection: form.grammarReadingSection,
        listeningSection: form.listeningSection,
      });
      appAlert('Đã lưu thay đổi');
    } catch (e: any) { appError(String(e?.message || e)); }
  };

  const confirmDelete = async () => {
    if (!form?._id) return;
    appConfirm('Xoá bài kiểm tra', 'Bạn chắc chắn muốn xoá?', async () => {
      try {
        await deleteTest(String(form._id));
        appAlert('Đã xoá', 'Bài kiểm tra đã được xoá.', () => {
          router.replace('/admin/content/test' as Href)
        }
        );
      } catch (e: any) {
        appError(String(e?.message || e));
      }
    },
    );
  };

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa đề thi">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải…</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa đề thi">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/test"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Thông tin cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={(t) => setForm(p => p ? { ...p, title: t } : p)} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Mô tả" value={form.description || ''} onChangeText={(t) => setForm(p => p ? { ...p, description: t } : p)} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
        </FormSection>

        <FormSection title='JLPT'>
          <JLPTPicker value={form.jlptLevel || ''} onChange={(v) => setForm(p => p ? ({ ...p, jlptLevel: v as TestDoc['jlptLevel'] }) : p)} />
        </FormSection>

        <FormSection title="Hiển thị">
          <View
            style={{
              flexDirection: 'row',
              gap: theme.tokens.space.xs,
              alignItems: 'center',
            }}
          >
            <Chip
              label={form.published ? 'Đã publish' : 'Nháp'}
              active={form.published}
              onPress={() => setForm(p => p ? { ...p, published: !p.published } : p)}
            />
            <Text style={theme.text.secondary}>
              {form.published ? 'Hiển thị với user' : 'Chỉ lưu ở admin'}
            </Text>
          </View>
        </FormSection>

        <FormSection title="Phần 1 — 文字・語彙 (Vocabulary)">
          <SimpleUnitEditor
            title="Danh sách BÀI (Vocabulary)"
            value={form.vocabSection?.vocabUnits || []}
            onChange={(units) => setForm(p => p ? { ...p, vocabSection: { ...(p.vocabSection || {}), vocabUnits: units } } : p)}
          />
        </FormSection>

        <FormSection title="Phần 2a — 文法 (Grammar)">
          <SimpleUnitEditor
            title="Danh sách BÀI (Grammar)"
            value={form.grammarReadingSection?.grammarUnits || []}
            onChange={(units) => setForm(p => p ? { ...p, grammarReadingSection: { ...(p.grammarReadingSection || {}), grammarUnits: units } } : p)}
          />
        </FormSection>

        <FormSection title="Phần 2b — 読解 (Reading)">
          <ReadingUnitEditor
            value={form.grammarReadingSection?.readingUnits || []}
            onChange={(units) => setForm(p => p ? { ...p, grammarReadingSection: { ...(p.grammarReadingSection || {}), readingUnits: units } } : p)}
          />
        </FormSection>

        <FormSection title="Phần 3 — 聴解 (Listening)">
          <ListeningUnitEditor
            value={form.listeningSection?.listeningUnits || []}
            onChange={(units) => setForm(p => p ? { ...p, listeningSection: { ...(p.listeningSection || {}), listeningUnits: units } } : p)}
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
