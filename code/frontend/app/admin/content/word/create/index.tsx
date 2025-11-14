import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { createWord, type Word } from '../../../../../api/admin/content/word/index';
import { router } from 'expo-router';

import { useAppTheme } from '../../../../../hooks/use-app-theme';

type Example = Word['examples'][number];
type Form = Omit<Word, '_id' | 'createdAt' | 'updatedAt'>;

const JLPT_LEVELS: Array<Form['jlptLevel']> = ['', 'N5', 'N4', 'N3', 'N2', 'N1'];
const initialExample: Example = { sentenceJP: '', readingKana: '', meaningVI: '' };

export default function CreateVocabScreen() {
  const { theme } = useAppTheme();

  const [form, setForm] = useState<Form>({
    termJP: '', hiraKata: '', romaji: '',
    meaningVI: '', meaningEN: '', kanji: '',
    examples: [{ ...initialExample }], audioUrl: '',
    tags: [], jlptLevel: '',
  });

  const [tagDraft, setTagDraft] = useState('');
  const isValid = useMemo(() => form.termJP.trim().length > 0, [form.termJP]);

  const setField = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setExampleField = (index: number, key: keyof Example, value: string) => {
    setForm(prev => {
      const next = [...prev.examples];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, examples: next };
    });
  };

  const addExample = () =>
    setForm(prev => ({ ...prev, examples: [...prev.examples, { ...initialExample }] }));

  const removeExample = (index: number) => {
    setForm(prev => {
      const next = prev.examples.filter((_, i) => i !== index);
      return { ...prev, examples: next.length ? next : [{ ...initialExample }] };
    });
  };

  const addTag = () => {
    const v = tagDraft.trim();
    if (!v) return;
    if (form.tags.includes(v)) { setTagDraft(''); return; }
    setForm(prev => ({ ...prev, tags: [...prev.tags, v] }));
    setTagDraft('');
  };

  const removeTag = (value: string) =>
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== value) }));

  const selectJLPT = (lv: Form['jlptLevel']) => setField('jlptLevel', lv);

  const submit = async () => {
    if (!isValid) {
      Alert.alert('Thiếu dữ liệu', 'Trường "termJP" là bắt buộc.');
      return;
    }
    try {
      await createWord(form as Word);
      Alert.alert('Thành công', 'Đã thêm từ vựng!');
      setForm({
        termJP: '',
        hiraKata: '',
        romaji: '',
        meaningVI: '',
        meaningEN: '',
        kanji: '',
        examples: [{ ...initialExample }],
        audioUrl: '',
        tags: [],
        jlptLevel: '',
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Lỗi', String(err?.message || err));
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { padding: theme.tokens.space.md },

    // Section/card theo theme: bg surface, radius 12, padding 12–16, border/elevation chuẩn
    section: { ...theme.surface.card, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.md },
    sectionTitle: { ...theme.text.h2, marginBottom: theme.tokens.space.sm }, // 20/26, 700
    label: { ...theme.text.secondary, marginBottom: 6 },                      // 14/20, textSub

    // Input theo preset: bgSubtle, border hairline, radius 10, paddingV 12, paddingH 12
    input: { ...theme.surface.input, ...theme.text.body, paddingVertical: 0 },

    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.sm },
    tagRow: { flexDirection: 'row', alignItems: 'center', gap: theme.tokens.space.sm, marginBottom: theme.tokens.space.sm },

    // Chip/filter theo tokens
    chip: { ...theme.chip.container, height: theme.chip.height, flexDirection: 'row', alignItems: 'center' },
    chipActive: { ...(theme.chip.active.container as any) },
    chipText: { ...theme.chip.label },
    chipTextActive: { ...(theme.chip.active.label as any) },

    // Tag chip (màu nền nhẹ hơn)
    tagChip: {
      ...theme.chip.container,
      height: theme.chip.height,
      backgroundColor: theme.color.surfaceAlt,
      borderColor: theme.color.border,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    removeX: { ...theme.text.title, fontSize: 18, lineHeight: 18 },

    // Card nhỏ cho mỗi ví dụ
    exampleCard: {
      backgroundColor: theme.color.bgSubtle,
      borderRadius: theme.tokens.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.color.border,
      padding: theme.tokens.space.md,
      marginBottom: theme.tokens.space.sm,
    },

    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

    // Link danger (xoá ví dụ)
    linkDanger: { ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const },

    // Buttons
    btnGhost: { alignSelf: 'flex-start', ...theme.button.ghost.container, paddingHorizontal: theme.tokens.space.md },
    btnGhostText: { ...theme.button.ghost.label, fontWeight: '700' as const },

    addBtn: { ...theme.button.primary.container, paddingHorizontal: theme.tokens.space.md, paddingVertical: 12, borderRadius: theme.tokens.radius.md },
    addBtnText: { ...theme.button.primary.label },

    submitBtn: { ...theme.button.primary.container, paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center' },
    submitBtnDisabled: { opacity: 0.5 },
    submitBtnText: { ...theme.button.primary.label },
  }), [theme.mode]);

  return (
    <LayoutDefault title="Thêm từ vựng">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <Section title="Cơ bản" styles={styles}>
          <Field label="Từ (JP) *" styles={styles}>
            <TextInput
              placeholder="食べる"
              value={form.termJP}
              onChangeText={(t) => setField('termJP', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Hiragana/Katakana" styles={styles}>
            <TextInput
              placeholder="たべる"
              value={form.hiraKata}
              onChangeText={(t) => setField('hiraKata', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Romaji" styles={styles}>
            <TextInput
              placeholder="taberu"
              value={form.romaji}
              onChangeText={(t) => setField('romaji', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
              autoCapitalize="none"
            />
          </Field>

          <Field label="Kanji chính" styles={styles}>
            <TextInput
              placeholder="食/食べる"
              value={form.kanji}
              onChangeText={(t) => setField('kanji', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Nghĩa (VI)" styles={styles}>
            <TextInput
              placeholder="ăn"
              value={form.meaningVI}
              onChangeText={(t) => setField('meaningVI', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Meaning (EN)" styles={styles}>
            <TextInput
              placeholder="to eat"
              value={form.meaningEN}
              onChangeText={(t) => setField('meaningEN', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
            />
          </Field>

          <Field label="Audio URL" styles={styles}>
            <TextInput
              placeholder="https://.../audio.mp3"
              value={form.audioUrl}
              onChangeText={(t) => setField('audioUrl', t)}
              style={styles.input}
              placeholderTextColor={theme.color.textMeta}
              autoCapitalize="none"
              keyboardType="url"
            />
          </Field>
        </Section>

        <Section title="JLPT Level" styles={styles}>
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

        <Section title="Tags" styles={styles}>
          <View style={styles.tagRow}>
            <TextInput
              placeholder="nhập tag rồi nhấn +"
              value={tagDraft}
              onChangeText={setTagDraft}
              style={[styles.input, { flex: 1 }]}
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

        <Section title="Ví dụ minh hoạ" styles={styles}>
          {form.examples.map((ex, i) => (
            <View key={i} style={styles.exampleCard}>
              <Field label={`Câu JP #${i + 1}`} styles={styles}>
                <TextInput
                  placeholder="私は寿司を食べる。"
                  value={ex.sentenceJP}
                  onChangeText={(t) => setExampleField(i, 'sentenceJP', t)}
                  style={styles.input}
                  placeholderTextColor={theme.color.textMeta}
                />
              </Field>

              <Field label="Kana" styles={styles}>
                <TextInput
                  placeholder="わたしは すしを たべる。"
                  value={ex.readingKana}
                  onChangeText={(t) => setExampleField(i, 'readingKana', t)}
                  style={styles.input}
                  placeholderTextColor={theme.color.textMeta}
                />
              </Field>

              <Field label="Nghĩa (VI)" styles={styles}>
                <TextInput
                  placeholder="Tôi ăn sushi."
                  value={ex.meaningVI}
                  onChangeText={(t) => setExampleField(i, 'meaningVI', t)}
                  style={styles.input}
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

        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
          onPress={submit}
          disabled={!isValid}
          hitSlop={theme.utils.hitSlop}
        >
          <Text style={styles.submitBtnText}>Lưu từ vựng</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}

// --- Subcomponents ---
function Section({ title, styles, children }: { title: string; styles: any; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
function Field({ label, styles, children }: { label: string; styles: any; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}
