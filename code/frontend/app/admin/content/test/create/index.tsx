// app/admin/content/test/create/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { appAlert, appError } from '@/helpers/appAlert';
import { router } from 'expo-router';

import LayoutDefault from '@/layout-default/layout-default';
import { useAppTheme } from '@/hooks/use-app-theme';
import LabeledInput from '@/components/ui/LabeledInput';
import ContentCard from '@/components/card/ContentCard';
import FormSection from '@/components/ui/FormSection';
import Chip from '@/components/ui/Chip';
import BackButton from '@/components/ui/BackButton';

import { createTest, type TestDoc } from '@/api/admin/content/test';
import SimpleUnitEditor from '@/components/block/SimpleUnitEditor';
import ReadingUnitEditor from '@/components/block/ReadingUnitEditor';
import ListeningUnitEditor from '@/components/block/ListeningUnitEditor';
import JLPTPicker from '@/components/ui/JLPTPicker';

export default function CreateTestScreen() {
  const { theme } = useAppTheme();

  const [form, setForm] = useState<TestDoc>({
    title: '', jlptLevel: 'N5', description: '', published: false, passingScorePercent: 70,
    vocabSection: { vocabUnits: [] },
    grammarReadingSection: { grammarUnits: [], readingUnits: [] },
    listeningSection: { listeningUnits: [] },
  });

  const isValid = !!form.title.trim() && !!form.jlptLevel;

  const submit = async () => {
    if (!isValid) return appAlert('Thiếu dữ liệu', 'Cần “Tiêu đề” và “Level”.');
    try {
      const created = await createTest(form);
      appAlert('Thành công', 'Đã tạo đề mới.',
        () => {
          router.replace(`/admin/content/test/detail/${created._id}`);
        });
    }
    catch (e: any) { appError(String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Tạo đề thi (Test)">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/test"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Thông tin cơ bản">
          <LabeledInput label="Tiêu đề *" value={form.title} onChangeText={(t) => setForm(p => ({ ...p, title: t }))} />
          <View style={{ height: theme.tokens.space.sm }} />
          <LabeledInput label="Mô tả" value={form.description || ''} onChangeText={(t) => setForm(p => ({ ...p, description: t }))} multiline />
          <View style={{ height: theme.tokens.space.sm }} />
        </FormSection>

        <FormSection title='JLPT'>
          <JLPTPicker value={form.jlptLevel || ''} onChange={(v) => setForm(p => ({ ...p, jlptLevel: v as TestDoc['jlptLevel'] }))} />
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
              label={form.published ? 'Publish' : 'Nháp'}
              active={form.published}
              onPress={() => setForm(p => ({ ...p, published: !p.published }))}
            />
            <Text style={theme.text.secondary}>
              {form.published ? 'Hiển thị với user' : 'Chỉ lưu ở admin'}
            </Text>
          </View>
        </FormSection>

        {/* Vocab units: Đề bài -> Câu hỏi */}
        <FormSection title="Phần 1 — 文字・語彙 (Vocabulary)">
          <SimpleUnitEditor
            title="Danh sách BÀI (Vocabulary)"
            value={form.vocabSection.vocabUnits}
            onChange={(units) => setForm(p => ({ ...p, vocabSection: { ...p.vocabSection, vocabUnits: units } }))}
          />
        </FormSection>

        {/* Grammar units: Đề bài -> Câu hỏi */}
        <FormSection title="Phần 2a — 文法 (Grammar)">
          <SimpleUnitEditor
            title="Danh sách BÀI (Grammar)"
            value={form.grammarReadingSection.grammarUnits}
            onChange={(units) => setForm(p => ({ ...p, grammarReadingSection: { ...p.grammarReadingSection, grammarUnits: units } }))}
          />
        </FormSection>

        {/* Reading: Đề bài -> Đoạn văn -> Câu hỏi */}
        <FormSection title="Phần 2b — 読解 (Reading)">
          <ReadingUnitEditor
            value={form.grammarReadingSection.readingUnits}
            onChange={(units) => setForm(p => ({ ...p, grammarReadingSection: { ...p.grammarReadingSection, readingUnits: units } }))}
          />
        </FormSection>

        {/* Listening: Đề bài -> URL -> Câu hỏi */}
        <FormSection title="Phần 3 — 聴解 (Listening)">
          <ListeningUnitEditor
            value={form.listeningSection.listeningUnits}
            onChange={(units) => setForm(p => ({ ...p, listeningSection: { ...p.listeningSection, listeningUnits: units } }))}
          />
        </FormSection>

        <TouchableOpacity onPress={submit} disabled={!isValid} style={[theme.button.primary.container, { paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}>
          <Text style={theme.button.primary.label}>Lưu đề thi</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
