import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LayoutDefault from '../../../../../layout-default/layout-default';

type Example = { sentenceJP: string; readingKana: string; meaningVI: string; };

type WordInput = {
    termJP: string;
    hiraKata?: string;
    romaji?: string;
    meaningVI?: string;
    meaningEN?: string;
    kanji?: string;
    examples: Example[];
    audioUrl?: string;
    tags: string[];
    jlptLevel: '' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    createdBy?: { adminId?: string };
    updatedBy?: { adminId?: string };
};

const JLPT_LEVELS: Array<WordInput['jlptLevel']> = ['', 'N5', 'N4', 'N3', 'N2', 'N1'];
const initialExample: Example = { sentenceJP: '', readingKana: '', meaningVI: '' };

export default function CreateVocabScreen() {
    const [form, setForm] = useState<WordInput>({
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

    const [tagDraft, setTagDraft] = useState('');
    const isValid = useMemo(() => form.termJP.trim().length > 0, [form.termJP]);

    const setField = <K extends keyof WordInput>(key: K, value: WordInput[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const setExampleField = (index: number, key: keyof Example, value: string) => {
        setForm(prev => {
            const next = [...prev.examples];
            next[index] = { ...next[index], [key]: value };
            return { ...prev, examples: next };
        });
    };

    const addExample = () => setForm(prev => ({ ...prev, examples: [...prev.examples, { ...initialExample }] }));
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

    const removeTag = (value: string) => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== value) }));
    const selectJLPT = (lv: WordInput['jlptLevel']) => setField('jlptLevel', lv);

    const submit = async () => {
        if (!isValid) {
            Alert.alert('Thiếu dữ liệu', 'Trường "termJP" là bắt buộc.');
            return;
        }
        try {
            const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${API_URL}/admin/words`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `HTTP ${res.status}`);
            }
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
        } catch (err: any) {
            Alert.alert('Lỗi', String(err?.message || err));
        }
    };

    return (
        <LayoutDefault title="Thêm từ vựng">
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Section title="Cơ bản">
                    <Field label="Từ (JP) *">
                        <TextInput placeholder="食べる" value={form.termJP} onChangeText={(t) => setField('termJP', t)} style={styles.input} />
                    </Field>
                    <Field label="Hiragana/Katakana">
                        <TextInput placeholder="たべる" value={form.hiraKata} onChangeText={(t) => setField('hiraKata', t)} style={styles.input} />
                    </Field>
                    <Field label="Romaji">
                        <TextInput placeholder="taberu" value={form.romaji} onChangeText={(t) => setField('romaji', t)} style={styles.input} autoCapitalize="none" />
                    </Field>
                    <Field label="Kanji chính">
                        <TextInput placeholder="食/食べる" value={form.kanji} onChangeText={(t) => setField('kanji', t)} style={styles.input} />
                    </Field>
                    <Field label="Nghĩa (VI)">
                        <TextInput placeholder="ăn" value={form.meaningVI} onChangeText={(t) => setField('meaningVI', t)} style={styles.input} />
                    </Field>
                    <Field label="Meaning (EN)">
                        <TextInput placeholder="to eat" value={form.meaningEN} onChangeText={(t) => setField('meaningEN', t)} style={styles.input} />
                    </Field>
                    <Field label="Audio URL">
                        <TextInput placeholder="https://.../audio.mp3" value={form.audioUrl} onChangeText={(t) => setField('audioUrl', t)} style={styles.input} autoCapitalize="none" />
                    </Field>
                </Section>

                <Section title="JLPT Level">
                    <View style={styles.rowWrap}>
                        {JLPT_LEVELS.map(lv => (
                            <TouchableOpacity key={lv || 'none'} onPress={() => selectJLPT(lv)} style={[styles.chip, form.jlptLevel === lv && styles.chipActive]}>
                                <Text style={[styles.chipText, form.jlptLevel === lv && styles.chipTextActive]}>{lv || '—'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Section>

                <Section title="Tags">
                    <View style={styles.tagRow}>
                        <TextInput placeholder="nhập tag rồi nhấn +" value={tagDraft} onChangeText={setTagDraft} style={[styles.input, { flex: 1 }]} />
                        <TouchableOpacity style={styles.addBtn} onPress={addTag}><Text style={styles.addBtnText}>＋</Text></TouchableOpacity>
                    </View>
                    <View style={styles.rowWrap}>
                        {form.tags.map(t => (
                            <View key={t} style={[styles.chip, styles.tagChip]}>
                                <Text style={styles.chipText}>{t}</Text>
                                <TouchableOpacity onPress={() => removeTag(t)} style={{ marginLeft: 6 }}><Text style={styles.removeX}>×</Text></TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </Section>

                <Section title="Ví dụ minh hoạ">
                    {form.examples.map((ex, i) => (
                        <View key={i} style={styles.exampleCard}>
                            <Field label={`Câu JP #${i + 1}`}><TextInput placeholder="私は寿司を食べる。" value={ex.sentenceJP} onChangeText={(t) => setExampleField(i, 'sentenceJP', t)} style={styles.input} /></Field>
                            <Field label="Kana"><TextInput placeholder="わたしは すしを たべる。" value={ex.readingKana} onChangeText={(t) => setExampleField(i, 'readingKana', t)} style={styles.input} /></Field>
                            <Field label="Nghĩa (VI)"><TextInput placeholder="Tôi ăn sushi." value={ex.meaningVI} onChangeText={(t) => setExampleField(i, 'meaningVI', t)} style={styles.input} /></Field>
                            <View style={[styles.rowBetween, { marginTop: 6 }]}><TouchableOpacity onPress={() => removeExample(i)}><Text style={styles.linkDanger}>Xoá ví dụ</Text></TouchableOpacity></View>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.btnGhost} onPress={addExample}><Text style={styles.btnGhostText}>＋ Thêm ví dụ</Text></TouchableOpacity>
                </Section>

                <View style={{ height: 12 }} />
                <TouchableOpacity style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]} onPress={submit} disabled={!isValid}>
                    <Text style={styles.submitBtnText}>Lưu từ vựng</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </LayoutDefault>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (<View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>);
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (<View style={{ marginBottom: 12 }}><Text style={styles.label}>{label}</Text>{children}</View>);
}

const styles = StyleSheet.create({
    container: { padding: 12 },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
    label: { fontSize: 13, color: '#444', marginBottom: 6 },
    input: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#d9d9d9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, backgroundColor: '#fafafa' },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: '#d9d9d9', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
    chipActive: { backgroundColor: '#212121', borderColor: '#212121' },
    chipText: { fontSize: 14 },
    chipTextActive: { color: '#fff', fontWeight: '700' },
    tagChip: { backgroundColor: '#f3f3f3' },
    removeX: { fontSize: 18, lineHeight: 18 },
    exampleCard: { padding: 10, borderRadius: 10, backgroundColor: '#fafafa', borderWidth: StyleSheet.hairlineWidth, borderColor: '#eaeaea', marginBottom: 8 },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    linkDanger: { color: '#c62828', fontWeight: '600' },
    btnGhost: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 12 },
    btnGhostText: { fontWeight: '700', fontSize: 15 },
    addBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    submitBtn: { backgroundColor: '#111', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    submitBtnDisabled: { opacity: 0.5 },
    submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
