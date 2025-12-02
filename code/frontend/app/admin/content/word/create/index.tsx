import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { appAlert, appError } from '@/helpers/appAlert';
import LayoutDefault from '@/layout-default/layout-default';
import { createWord, type Word } from '@/api/admin/content/word';
import { useAppTheme } from '@/hooks/use-app-theme'
import FormSection from '@/components/ui/FormSection'
import LabeledInput from '@/components/ui/LabeledInput';
import JLPTPicker from '@/components/ui/JLPTPicker';
import TagsEditor from '@/components/ui/TagsEditor';
import ExampleEditor from '@/components/block/ExampleEditor';
import BackButton from '@/components/ui/BackButton';
import { router } from 'expo-router';

type Example = Word['examples'][number];
type Form = Omit<Word, '_id'|'createdAt'|'updatedAt'>;
const emptyEx: Example = { sentenceJP: '', readingKana: '', meaningVI: '' };

export default function CreateWordScreen() {
  const { theme } = useAppTheme();

  const [form, setForm] = useState<Form>({
    termJP: '', hiraKata: '', romaji: '',
    meaningVI: '', meaningEN: '', kanji: '',
    audioUrl: '', jlptLevel: '', tags: [],
    examples: [ { ...emptyEx } ],
  });
  const [tagDraft, setTagDraft] = useState('');

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }));
  const isValid = !!form.termJP.trim();

  const submit = async () => {
    if (!isValid) return appAlert('Thiếu dữ liệu', 'Cần “Từ (JP)”.');
    try { await createWord(form as any); appAlert('Đã lưu'); router.back(); }
    catch (e:any) { appError(String(e?.message || e)); }
  };

  return (
    <LayoutDefault title="Thêm từ vựng">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">
        <BackButton
          fallbackHref="/admin/content/word"
          containerStyle={{ marginBottom: theme.tokens.space.sm }}
        />
        <FormSection title="Cơ bản">
          <LabeledInput label="Từ (JP) *" value={form.termJP} onChangeText={t=>setField('termJP', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Hiragana/Katakana" value={form.hiraKata} onChangeText={t=>setField('hiraKata', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Romaji" value={form.romaji} onChangeText={t=>setField('romaji', t)} autoCapitalize="none" />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Kanji" value={form.kanji} onChangeText={t=>setField('kanji', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Nghĩa (VI)" value={form.meaningVI} onChangeText={t=>setField('meaningVI', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Meaning (EN)" value={form.meaningEN} onChangeText={t=>setField('meaningEN', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Audio URL" value={form.audioUrl} onChangeText={t=>setField('audioUrl', t)} autoCapitalize="none" keyboardType="url" />
        </FormSection>

        <FormSection title="JLPT">
          <JLPTPicker value={form.jlptLevel} onChange={v=>setField('jlptLevel', v)} />
        </FormSection>

        <FormSection title="Tags">
          <TagsEditor
            tags={form.tags}
            draft={tagDraft}
            onDraftChange={setTagDraft}
            onAdd={() => {
              const v = tagDraft.trim();
              if (!v) return;
              if (form.tags.includes(v)) return setTagDraft('');
              setForm(p => ({ ...p, tags: [...p.tags, v] }));
              setTagDraft('');
            }}
            onRemove={(t)=> setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))}
          />
        </FormSection>

        <FormSection title="Ví dụ">
          <ExampleEditor
            examples={form.examples}
            onChange={(next)=> setForm(p=>({ ...p, examples: next }))}
            fields={[
              { key: 'sentenceJP', label: 'Câu JP' },
              { key: 'readingKana', label: 'Kana' },
              { key: 'meaningVI', label: 'Nghĩa (VI)' },
            ]}
          />
        </FormSection>

        <TouchableOpacity
          onPress={submit}
          disabled={!isValid}
          style={[theme.button.primary.container, { paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center', opacity: isValid ? 1 : 0.5 }]}
        >
          <Text style={theme.button.primary.label}>Lưu từ vựng</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
