import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { getWord, editWord, deleteWord, type Word } from '../../../../../api/admin/content/word';
import { useAppTheme } from '../../../../../hooks/use-app-theme';
import FormSection from '../../../../../components/ui/FormSection';
import LabeledInput from '../../../../../components/ui/LabeledInput';
import JLPTPicker from '../../../../../components/ui/JLPTPicker';
import TagsEditor from '../../../../../components/ui/TagsEditor';
import ExampleEditor from '../../../../../components/block/ExampleEditor';

type Example = Word['examples'][number];
type Form = Word;

export default function EditWordScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [tagDraft, setTagDraft] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const w = await getWord(String(id));
        if (!alive) return;
        // đảm bảo có mảng examples/tags
        setForm({ ...w, tags: w.tags || [], examples: w.examples?.length ? w.examples : [{ sentenceJP: '', readingKana: '', meaningVI: '' }] });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => (p ? { ...p, [k]: v } : p));
  const isValid = !!form?.termJP?.trim();

  const save = async () => {
    if (!form || !isValid) return Alert.alert('Thiếu dữ liệu', 'Cần “Từ (JP)”.');
    try {
      await editWord(String(form._id), {
        termJP: form.termJP,
        hiraKata: form.hiraKata,
        romaji: form.romaji,
        meaningVI: form.meaningVI,
        meaningEN: form.meaningEN,
        kanji: form.kanji,
        audioUrl: form.audioUrl,
        jlptLevel: form.jlptLevel,
        tags: form.tags || [],
        examples: form.examples || [],
      });
      Alert.alert('Đã lưu', 'Cập nhật thành công.');
    } catch (e: any) {
      Alert.alert('Lỗi', String(e?.message || e));
    }
  };

  const confirmDelete = () =>
    Alert.alert('Xoá từ vựng', 'Bạn chắc chắn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: del },
    ]);

  const del = async () => {
    try { await deleteWord(String(form?._id)); Alert.alert('Đã xoá'); router.back(); }
    catch (e: any) { Alert.alert('Lỗi', String(e?.message || e)); }
  };

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa từ vựng">
        <View style={{ padding: theme.tokens.space.md }}>
          <ActivityIndicator color={theme.color.textSub} />
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.sm }]}>Đang tải…</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa từ vựng">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }} keyboardShouldPersistTaps="handled">

        <FormSection title="Cơ bản">
          <LabeledInput label="Từ (JP) *" value={form.termJP} onChangeText={t=>setField('termJP', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Hiragana/Katakana" value={form.hiraKata || ''} onChangeText={t=>setField('hiraKata', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Romaji" value={form.romaji || ''} onChangeText={t=>setField('romaji', t)} autoCapitalize="none" />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Kanji" value={form.kanji || ''} onChangeText={t=>setField('kanji', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Nghĩa (VI)" value={form.meaningVI || ''} onChangeText={t=>setField('meaningVI', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Meaning (EN)" value={form.meaningEN || ''} onChangeText={t=>setField('meaningEN', t)} />
          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Audio URL" value={form.audioUrl || ''} onChangeText={t=>setField('audioUrl', t)} autoCapitalize="none" keyboardType="url" />
        </FormSection>

        <FormSection title="JLPT">
          <JLPTPicker value={form.jlptLevel || ''} onChange={v=>setField('jlptLevel', v)} />
        </FormSection>

        <FormSection title="Tags">
          <TagsEditor
            tags={form.tags || []}
            draft={tagDraft}
            onDraftChange={setTagDraft}
            onAdd={() => {
              const v = tagDraft.trim();
              if (!v) return;
              if ((form.tags || []).includes(v)) return setTagDraft('');
              setForm(p => (p ? { ...p, tags: [...(p.tags || []), v] } : p));
              setTagDraft('');
            }}
            onRemove={(t)=> setForm(p => (p ? { ...p, tags: (p.tags || []).filter(x => x !== t) } : p))}
          />
        </FormSection>

        <FormSection title="Ví dụ">
          <ExampleEditor
            examples={form.examples || []}
            onChange={(next)=> setForm(p => (p ? { ...p, examples: next } : p))}
            fields={[
              { key: 'sentenceJP', label: 'Câu JP' },
              { key: 'readingKana', label: 'Kana' },
              { key: 'meaningVI', label: 'Nghĩa (VI)' },
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
