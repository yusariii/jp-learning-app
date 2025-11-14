import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LayoutDefault from '../../../../../layout-default/layout-default';

import { getWord, editWord, deleteWord, type Word } from '../../../../../api/admin/content/word/index';
import { useAppTheme } from '../../../../../hooks/use-app-theme'; 

type Example = Word['examples'][number];

const JLPT_LEVELS: Array<Word['jlptLevel']> = ['', 'N5', 'N4', 'N3', 'N2', 'N1'];
const initialExample: Example = { sentenceJP: '', readingKana: '', meaningVI: '' };

export default function EditVocabScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Word | null>(null);
  const [tagDraft, setTagDraft] = useState('');

  const isValid = useMemo(() => !!form?.termJP?.trim(), [form?.termJP]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = String(params.id);
        const w = await getWord(id);
        if (mounted) setForm(w as Word);
      } catch (e: any) {
        Alert.alert('Lỗi', String(e?.message || e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params.id]);

  const setField = <K extends keyof Word>(key: K, value: Word[K]) => {
    setForm(prev => prev ? ({ ...prev, [key]: value }) : prev);
  };

  const setExampleField = (index: number, key: keyof Example, value: string) => {
    setForm(prev => {
      if (!prev) return prev;
      const next = [...prev.examples];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, examples: next };
    });
  };

  const addExample = () => setForm(prev => prev ? ({ ...prev, examples: [...prev.examples, { ...initialExample }] }) : prev);
  const removeExample = (index: number) => setForm(prev => {
    if (!prev) return prev;
    const next = prev.examples.filter((_, i) => i !== index);
    return { ...prev, examples: next.length ? next : [ { ...initialExample } ] };
  });

  const addTag = () => {
    const v = tagDraft.trim();
    if (!v || !form) return;
    if (form.tags.includes(v)) { setTagDraft(''); return; }
    setForm(prev => prev ? ({ ...prev, tags: [...prev.tags, v] }) : prev);
    setTagDraft('');
  };

  const removeTag = (value: string) => setForm(prev => prev ? ({ ...prev, tags: prev.tags.filter(t => t !== value) }) : prev);
  const selectJLPT = (lv: Word['jlptLevel']) => setField('jlptLevel', lv);

  const save = async () => {
    if (!isValid || !form) {
      Alert.alert('Thiếu dữ liệu', 'Trường "termJP" là bắt buộc.');
      return;
    }
    try {
      await editWord(String(form._id), form);
      Alert.alert('Đã lưu', 'Cập nhật từ vựng thành công.');
    } catch (e: any) {
      Alert.alert('Lỗi', String(e?.message || e));
    }
  };

  const confirmDelete = () => {
    Alert.alert('Xoá từ vựng', 'Bạn có chắc chắn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: del },
    ]);
  };

  const del = async () => {
    try {
      await deleteWord(String(form?._id));
      Alert.alert('Đã xoá', 'Từ vựng đã được xoá.');
      router.back();
    } catch (e: any) {
      Alert.alert('Lỗi', String(e?.message || e));
    }
  };

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa từ vựng">
        <View style={{ padding: theme.tokens.space.md }}>
          <Text style={theme.text.body}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }

  const styles = StyleSheet.create({
    container: { padding: theme.tokens.space.md },
    section: { ...theme.surface.card, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.md },
    sectionTitle: { ...theme.text.h2, marginBottom: theme.tokens.space.sm }, 
    label: { ...theme.text.secondary, marginBottom: 6 },                     
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.sm },
    tagRow: { flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, marginBottom: theme.tokens.space.sm },
    chip: { ...theme.chip.container, height: theme.chip.height, flexDirection: 'row', alignItems: 'center' },
    chipActive: { ...(theme.chip.active.container as any) },
    chipText: { ...theme.chip.label },
    chipTextActive: { ...(theme.chip.active.label as any) },
    tagChip: { ...theme.chip.container, height: theme.chip.height, backgroundColor: theme.color.surfaceAlt, borderColor: theme.color.border, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
    removeX: { ...theme.text.title, fontSize: 18, lineHeight: 18 },
    exampleCard: {
      backgroundColor: theme.color.bgSubtle,
      borderRadius: theme.tokens.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.color.border,
      padding: theme.tokens.space.md,
      marginBottom: theme.tokens.space.sm,
    },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    linkDanger: { ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const },
    btnGhost: { alignSelf: 'flex-start', ...theme.button.ghost.container, paddingHorizontal: theme.tokens.space.md },
    btnGhostText: { ...theme.button.ghost.label, fontWeight: '700' as const },

    addBtn: { ...theme.button.primary.container, paddingHorizontal: theme.tokens.space.md, paddingVertical: 12, borderRadius: theme.tokens.radius.md },
    addBtnText: { ...theme.button.primary.label },

    submitBtn: { ...theme.button.primary.container, paddingVertical: 14, borderRadius: theme.tokens.radius.lg },
    submitBtnText: { ...theme.button.primary.label },

    deleteBtn: { ...theme.button.primary.container, backgroundColor: theme.color.danger, paddingVertical: 14, paddingHorizontal: theme.tokens.space.lg, borderRadius: theme.tokens.radius.lg },
    deleteBtnText: { ...theme.button.primary.label },
  });

  return (
    <LayoutDefault title="Sửa từ vựng">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Section title="Cơ bản" styles={styles} theme={theme}>
          <Field label="Từ (JP) *" styles={styles} theme={theme}>
            <TextInput
              placeholder="食べる"
              value={form.termJP}
              onChangeText={(t) => setField('termJP', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Hiragana/Katakana" styles={styles} theme={theme}>
            <TextInput
              placeholder="たべる"
              value={form.hiraKata}
              onChangeText={(t) => setField('hiraKata', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Romaji" styles={styles} theme={theme}>
            <TextInput
              placeholder="taberu"
              value={form.romaji}
              onChangeText={(t) => setField('romaji', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
              autoCapitalize="none"
            />
          </Field>

          <Field label="Kanji chính" styles={styles} theme={theme}>
            <TextInput
              placeholder="食/食べる"
              value={form.kanji}
              onChangeText={(t) => setField('kanji', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Nghĩa (VI)" styles={styles} theme={theme}>
            <TextInput
              placeholder="ăn"
              value={form.meaningVI}
              onChangeText={(t) => setField('meaningVI', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Meaning (EN)" styles={styles} theme={theme}>
            <TextInput
              placeholder="to eat"
              value={form.meaningEN}
              onChangeText={(t) => setField('meaningEN', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Audio URL" styles={styles} theme={theme}>
            <TextInput
              placeholder="https://.../audio.mp3"
              value={form.audioUrl}
              onChangeText={(t) => setField('audioUrl', t)}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
              placeholderTextColor={theme.color.textMeta}
              autoCapitalize="none"
              keyboardType="url"
            />
          </Field>
        </Section>

        <Section title="JLPT Level" styles={styles} theme={theme}>
          <View style={styles.rowWrap}>
            {JLPT_LEVELS.map(lv => {
              const active = form.jlptLevel === lv;
              return (
                <TouchableOpacity
                  key={lv || 'none'}
                  onPress={() => selectJLPT(lv)}
                  style={[styles.chip, active && styles.chipActive]}
                  hitSlop={theme.utils.hitSlop}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{lv || '—'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section title="Tags" styles={styles} theme={theme}>
          <View style={styles.tagRow}>
            <TextInput
              placeholder="nhập tag rồi nhấn +"
              value={tagDraft}
              onChangeText={setTagDraft}
              style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0, flex: 1 }}
              placeholderTextColor={theme.color.textMeta}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addTag} hitSlop={theme.utils.hitSlop}>
              <Text style={styles.addBtnText}>＋</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowWrap}>
            {form.tags.map(t => (
              <View key={t} style={styles.tagChip}>
                <Text style={styles.chipText}>{t}</Text>
                <TouchableOpacity onPress={() => removeTag(t)} hitSlop={theme.utils.hitSlop}>
                  <Text style={[styles.removeX, { marginLeft: 6 }]}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Ví dụ minh hoạ" styles={styles} theme={theme}>
          {form.examples.map((ex, i) => (
            <View key={i} style={styles.exampleCard}>
              <Field label={`Câu JP #${i + 1}`} styles={styles} theme={theme}>
                <TextInput
                  placeholder="私は寿司を食べる。"
                  value={ex.sentenceJP}
                  onChangeText={(t) => setExampleField(i, 'sentenceJP', t)}
                  style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
                  placeholderTextColor={theme.color.textMeta}
                />
              </Field>

              <Field label="Kana" styles={styles} theme={theme}>
                <TextInput
                  placeholder="わたしは すしを たべる。"
                  value={ex.readingKana}
                  onChangeText={(t) => setExampleField(i, 'readingKana', t)}
                  style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
                  placeholderTextColor={theme.color.textMeta}
                />
              </Field>

              <Field label="Nghĩa (VI)" styles={styles} theme={theme}>
                <TextInput
                  placeholder="Tôi ăn sushi."
                  value={ex.meaningVI}
                  onChangeText={(t) => setExampleField(i, 'meaningVI', t)}
                  style={{ ...theme.surface.input, ...theme.text.body, paddingVertical: 0 }}
                  placeholderTextColor={theme.color.textMeta}
                />
              </Field>

              <View style={[styles.rowBetween, { marginTop: 6 }]}>
                <TouchableOpacity onPress={() => removeExample(i)} hitSlop={theme.utils.hitSlop}>
                  <Text style={styles.linkDanger}>Xoá ví dụ</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.btnGhost} onPress={addExample} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.btnGhostText}>＋ Thêm ví dụ</Text>
          </TouchableOpacity>
        </Section>

        <View style={{ height: theme.tokens.space.md }} />

        <View style={styles.rowBetween}>
          <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={save} disabled={!isValid} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.submitBtnText}>Lưu thay đổi</Text>
          </TouchableOpacity>

          <View style={{ width: theme.tokens.space.sm }} />

          <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.deleteBtnText}>Xoá</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}

function Section({ title, children, styles, theme }: { title: string; children: React.ReactNode; styles: any; theme: any }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, children, styles, theme }: { label: string; children: React.ReactNode; styles: any; theme: any }) {
  return (
    <View style={{ marginBottom: theme.tokens.space.md }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}
