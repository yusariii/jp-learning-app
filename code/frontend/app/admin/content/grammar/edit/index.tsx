import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';
import { getGrammar, editGrammar, deleteGrammar, type Grammar } from '../../../../../api/admin/content/grammar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '../../../../../hooks/use-app-theme';

type Example = Grammar['examples'][number];
const JLPTS: Array<Grammar['jlptLevel']> = ['', 'N5','N4','N3','N2','N1'];
const emptyEx: Example = { sentenceJP: '', readingKana: '', meaningVI: '', meaningEN: '' };

export default function EditGrammarScreen() {
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Grammar | null>(null);

  useEffect(() => {
    let m = true;
    (async () => {
      try { const w = await getGrammar(String(params.id)); if (m) setForm(w); }
      finally { if (m) setLoading(false); }
    })();
    return () => { m = false; };
  }, [params.id]);

  const setField = <K extends keyof Grammar>(k: K, v: Grammar[K]) => setForm(prev => prev ? ({ ...prev, [k]: v }) : prev);
  const setEx = (i: number, k: keyof Example, v: string) =>
    setForm(prev => {
      if (!prev) return prev;
      const a = [...prev.examples]; a[i] = { ...a[i], [k]: v };
      return { ...prev, examples: a };
    });

  const addEx = () => setForm(prev => prev ? ({ ...prev, examples: [...prev.examples, { ...emptyEx }] }) : prev);
  const removeEx = (i: number) =>
    setForm(prev => {
      if (!prev) return prev;
      const a = prev.examples.filter((_, idx) => idx !== i);
      return { ...prev, examples: a.length ? a : [{ ...emptyEx }] };
    });

  const isValid = !!form?.title?.trim() && !!form?.explanationJP?.trim();

  const save = async () => {
    if (!form || !isValid) { Alert.alert('Thiếu dữ liệu', 'Cần "Tiêu đề" và "Giải thích (JP)".'); return; }
    try { await editGrammar(String(form._id), form); Alert.alert('Đã lưu', 'Cập nhật thành công.'); }
    catch (e: any) { Alert.alert('Lỗi', String(e?.message || e)); }
  };

  const confirmDelete = () => Alert.alert('Xoá mục ngữ pháp', 'Bạn chắc chắn muốn xoá?', [
    { text: 'Huỷ', style: 'cancel' },
    { text: 'Xoá', style: 'destructive', onPress: del },
  ]);
  const del = async () => {
    try { await deleteGrammar(String(form?._id)); Alert.alert('Đã xoá'); router.back(); }
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
    deleteBtn: { ...theme.button.primary.container, backgroundColor: theme.color.danger, paddingVertical: 14, borderRadius: theme.tokens.radius.lg },
    deleteBtnText: { ...theme.button.primary.label },
  }), [theme.mode]);

  if (loading || !form) {
    return (
      <LayoutDefault title="Sửa ngữ pháp">
        <View style={{ padding: theme.tokens.space.md }}>
          <Text style={theme.text.body}>Đang tải...</Text>
        </View>
      </LayoutDefault>
    );
  }

  return (
    <LayoutDefault title="Sửa ngữ pháp">
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
              <Text style={styles.label}>Câu JP #{i+1}</Text>
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

        <View style={{ flexDirection: 'row', gap: theme.tokens.space.sm }}>
          <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={save} disabled={!isValid} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.submitBtnText}>Lưu thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete} hitSlop={theme.utils.hitSlop}>
            <Text style={styles.deleteBtnText}>Xoá</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: theme.tokens.space.xl }} />
      </ScrollView>
    </LayoutDefault>
  );
}
