import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { createGrammar, type Grammar } from '../../../../../api/admin/content/grammar';
import { useAppTheme } from '../../../../../hooks/use-app-theme';
import { router } from 'expo-router';

type Example = Grammar['examples'][number];
type Form = Omit<Grammar, '_id' | 'createdAt' | 'updatedAt'>;
const JLPTS: Array<Form['jlptLevel']> = ['', 'N5', 'N4', 'N3', 'N2', 'N1'];
const emptyEx: Example = { sentenceJP: '', readingKana: '', meaningVI: '', meaningEN: '' };

export default function CreateGrammarScreen() {
  const { theme } = useAppTheme();
  const [form, setForm] = useState<Form>({
    title: '', description: '', explanationJP: '', explanationEN: '', jlptLevel: '',
    examples: [{ ...emptyEx }],
  });

  const isValid = form.title.trim() && form.explanationJP.trim();
  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm(prev => ({ ...prev, [k]: v }));
  const setEx = (i: number, k: keyof Example, v: string) =>
    setForm(prev => { const a = [...prev.examples]; a[i] = { ...a[i], [k]: v }; return { ...prev, examples: a }; });

  const addEx = () => setForm(prev => ({ ...prev, examples: [...prev.examples, { ...emptyEx }] }));
  const removeEx = (i: number) =>
    setForm(prev => { const a = prev.examples.filter((_, idx) => idx !== i); return { ...prev, examples: a.length ? a : [{ ...emptyEx }] }; });

  const submit = async () => {
    if (!isValid) { Alert.alert('Thiếu dữ liệu', 'Cần "Tiêu đề" và "Giải thích (JP)".'); return; }
    try { await createGrammar(form as any); Alert.alert('Thành công', 'Đã tạo mục ngữ pháp.'); router.back(); }
    catch (e: any) { Alert.alert('Lỗi', String(e?.message || e)); }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { padding: theme.tokens.space.md },
    section: { ...theme.surface.card, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.md },
    title: { ...theme.text.h2, marginBottom: theme.tokens.space.sm },
    label: { ...theme.text.secondary, marginBottom: 6 },
    input: { ...theme.surface.input, ...theme.text.body, paddingVertical: 0 },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.tokens.space.sm },
    chip: { ...theme.chip.container, height: theme.chip.height, flexDirection: 'row', alignItems: 'center' },
    chipActive: { ...(theme.chip.active.container as any) },
    chipText: { ...theme.chip.label },
    chipTextActive: { ...(theme.chip.active.label as any) },
    exCard: { backgroundColor: theme.color.bgSubtle, borderRadius: theme.tokens.radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.color.border, padding: theme.tokens.space.md, marginBottom: theme.tokens.space.sm },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    linkDanger: { ...theme.text.link, color: theme.color.danger, fontWeight: '700' as const },
    btnGhost: { alignSelf: 'flex-start', ...theme.button.ghost.container, paddingHorizontal: theme.tokens.space.md },
    btnGhostText: { ...theme.button.ghost.label, fontWeight: '700' as const },
    submitBtn: { ...theme.button.primary.container, paddingVertical: 14, borderRadius: theme.tokens.radius.lg, alignItems: 'center' },
    submitBtnText: { ...theme.button.primary.label },
    submitBtnDisabled: { opacity: 0.5 },
  }), [theme.mode]);

  return (
    <LayoutDefault title="Thêm ngữ pháp">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.title}>Cơ bản</Text>

          <Text style={styles.label}>Tiêu đề *</Text>
          <TextInput placeholder="〜ながら" value={form.title} onChangeText={t => setField('title', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} />

          <Text style={[styles.label, { marginTop: theme.tokens.space.sm }]}>Mô tả</Text>
          <TextInput placeholder="Thói quen/đồng thời làm..." value={form.description} onChangeText={t => setField('description', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} />

          <Text style={[styles.label, { marginTop: theme.tokens.space.sm }]}>Giải thích (JP) *</Text>
          <TextInput placeholder="二つの動作が..." value={form.explanationJP} onChangeText={t => setField('explanationJP', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} multiline />

          <Text style={[styles.label, { marginTop: theme.tokens.space.sm }]}>Explanation (EN)</Text>
          <TextInput placeholder="Two actions simultaneously..." value={form.explanationEN} onChangeText={t => setField('explanationEN', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} multiline />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>JLPT</Text>
          <View style={styles.rowWrap}>
            {JLPTS.map(lv => {
              const active = form.jlptLevel === lv;
              return (
                <TouchableOpacity key={lv || 'none'} onPress={() => setField('jlptLevel', lv)} style={[styles.chip, active && styles.chipActive]} hitSlop={theme.utils.hitSlop}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{lv || '—'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Ví dụ</Text>
          {form.examples.map((ex, i) => (
            <View key={i} style={styles.exCard}>
              <Text style={styles.label}>Câu JP #{i + 1}</Text>
              <TextInput placeholder="友達と話しながら..." value={ex.sentenceJP} onChangeText={t => setEx(i, 'sentenceJP', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} />

              <Text style={[styles.label, { marginTop: theme.tokens.space.sm }]}>Kana</Text>
              <TextInput placeholder="ともだちと はなしながら..." value={ex.readingKana} onChangeText={t => setEx(i, 'readingKana', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} />

              <Text style={[styles.label, { marginTop: theme.tokens.space.sm }]}>Nghĩa (VI)</Text>
              <TextInput placeholder="Vừa nói chuyện với bạn..." value={ex.meaningVI} onChangeText={t => setEx(i, 'meaningVI', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} />

              <Text style={[styles.label, { marginTop: theme.tokens.space.sm }]}>Meaning (EN)</Text>
              <TextInput placeholder="While talking with a friend..." value={ex.meaningEN} onChangeText={t => setEx(i, 'meaningEN', t)} style={styles.input} placeholderTextColor={theme.color.textMeta} />

              <View style={[styles.rowBetween, { marginTop: 6 }]}>
                <TouchableOpacity onPress={() => removeEx(i)} hitSlop={theme.utils.hitSlop}>
                  <Text style={styles.linkDanger}>Xoá ví dụ</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.btnGhost} onPress={addEx} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.btnGhostText}>＋ Thêm ví dụ</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]} onPress={submit} disabled={!isValid} hitSlop={theme.utils.hitSlop}>
          <Text style={styles.submitBtnText}>Lưu mục ngữ pháp</Text>
        </TouchableOpacity>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
