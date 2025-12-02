import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appAlert, appConfirm, appError } from '@/helpers/appAlert';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { getLesson, updateLesson, deleteLesson, type Lesson, } from '@/api/admin/content/lesson';
import { useAppTheme } from '@/hooks/use-app-theme';
import FormSection from '@/components/ui/FormSection';
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';
import LinkedContentSelector from '@/components/block/LinkedContentSelector';
import BackButton from '@/components/ui/BackButton';

type JLPT = Lesson['jlptLevel'] | '';

type Form = {
    title: string;
    lessonNumber: string;
    description: string;
    jlptLevel: JLPT;
    durationMinutes: string;
    published: boolean;
    tags: string;
    wordIds: string[];
    readingIds: string[];
    speakingIds: string[];
    grammarIds: string[];
    listeningIds: string[];
};

const parseTags = (raw: string) =>
    raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

const buildPayload = (form: Form): Partial<Lesson> => {
    const lessonNumber = Number(form.lessonNumber);
    const duration = Number(form.durationMinutes);

    return {
        title: form.title.trim(),
        lessonNumber: Number.isNaN(lessonNumber) ? 0 : lessonNumber,
        description: form.description.trim() || undefined,
        jlptLevel: form.jlptLevel || '',
        durationMinutes: Number.isNaN(duration) ? 0 : duration,
        published: form.published,
        tags: parseTags(form.tags),
        wordIds: form.wordIds.map((id) => ({ wordId: id })) as any,
        readingIds: form.readingIds.map((id) => ({ readingId: id })) as any,
        speakingIds: form.speakingIds.map((id) => ({ speakingId: id })) as any,
        grammarIds: form.grammarIds.map((id) => ({ grammarId: id })) as any,
        listeningIds: form.listeningIds.map((id) => ({ listeningId: id })) as any,
    };
};

export default function EditLessonScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { theme } = useAppTheme();

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Form | null>(null);
    const [lessonId, setLessonId] = useState<string | null>(null);

    const setField = <K extends keyof Form>(key: K, value: Form[K]) =>
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

    const isValid =
        !!form?.title.trim() && !!form?.lessonNumber.trim();

    // load lesson
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getLesson(String(id));
                if (!alive) return;

                setLessonId(String(data._id));
                setForm({
                    title: data.title || '',
                    lessonNumber:
                        typeof data.lessonNumber === 'number'
                            ? String(data.lessonNumber)
                            : '',
                    description: data.description || '',
                    jlptLevel: (data.jlptLevel || '') as JLPT,
                    durationMinutes:
                        typeof data.durationMinutes === 'number'
                            ? String(data.durationMinutes)
                            : '',
                    published: !!data.published,
                    tags: (data.tags || []).join(', '),
                    wordIds: (data.wordIds || []).map((x: any) => x.wordId),
                    readingIds: (data.readingIds || []).map((x: any) => x.readingId),
                    speakingIds: (data.speakingIds || []).map((x: any) => x.speakingId),
                    grammarIds:
                        (data.grammarIds || []).map((x: any) => x.grammarId) || [],
                    listeningIds:
                        (data.listeningIds || []).map((x: any) => x.listeningId) || [],
                });
            } catch (e: any) {
                appError(String(e?.message || e));
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    const save = async () => {
        if (!form || !lessonId) return;
        if (!isValid) {
            return appAlert(
                'Thiếu dữ liệu',
                'Cần nhập “Tiêu đề” và “Số bài (lessonNumber)”.',
            );
        }

        try {
            const payload = buildPayload(form);
            await updateLesson(lessonId, payload);
            appAlert('Đã lưu', 'Cập nhật lesson thành công.');
        } catch (e: any) {
            appError(String(e?.message || e));
        }
    };

    const confirmDelete = () => {
        if (!lessonId) return;
        appConfirm('Xoá bài học', 'Bạn chắc chắn muốn xoá?', async () => {
            try {
                await deleteLesson(lessonId);
                appAlert('Đã xoá', 'Bài học đã được xoá.', () => {
                    router.replace('/admin/content/lesson' as Href)
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
            <LayoutDefault title="Sửa bài học">
                <View style={{ padding: theme.tokens.space.md }}>
                    <ActivityIndicator color={theme.color.textSub} />
                    <Text
                        style={[
                            theme.text.secondary,
                            { marginTop: theme.tokens.space.sm },
                        ]}
                    >
                        Đang tải…
                    </Text>
                </View>
            </LayoutDefault>
        );
    }

    return (
        <LayoutDefault title="Sửa lesson">
            <ScrollView
                contentContainerStyle={{
                    padding: theme.tokens.space.md,
                    paddingBottom: theme.tokens.space.xl,
                }}
                keyboardShouldPersistTaps="handled"
            >
                <BackButton
                    fallbackHref="/admin/content/lesson"
                    containerStyle={{ marginBottom: theme.tokens.space.sm }}
                />
                {/* CƠ BẢN */}
                <FormSection title="Cơ bản">
                    <LabeledInput
                        label="Tiêu đề *"
                        value={form.title}
                        onChangeText={(t) => setField('title', t)}
                    />
                    <View style={{ height: theme.tokens.space.sm }} />
                    <LabeledInput
                        label="Số bài (lessonNumber) *"
                        value={form.lessonNumber}
                        keyboardType="numeric"
                        onChangeText={(t) => setField('lessonNumber', t)}
                    />
                    <View style={{ height: theme.tokens.space.sm }} />
                    <LabeledInput
                        label="Mô tả"
                        value={form.description}
                        multiline
                        onChangeText={(t) => setField('description', t)}
                    />
                </FormSection>

                {/* THIẾT LẬP */}
                <FormSection title="Thiết lập">
                    <Text style={theme.text.body}>Cấp JLPT</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: theme.tokens.space.xs,
                            marginTop: theme.tokens.space.xs,
                        }}
                    >
                        {(['', 'N5', 'N4', 'N3', 'N2', 'N1'] as JLPT[]).map((lv) => (
                            <Chip
                                key={lv || 'none'}
                                label={lv || '—'}
                                active={(form.jlptLevel || '') === lv}
                                onPress={() => setField('jlptLevel', lv)}
                            />
                        ))}
                    </View>

                    <View style={{ height: theme.tokens.space.sm }} />
                    <LabeledInput
                        label="Thời lượng (phút)"
                        value={form.durationMinutes}
                        keyboardType="numeric"
                        onChangeText={(t) => setField('durationMinutes', t)}
                    />

                    <View style={{ height: theme.tokens.space.sm }} />
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
                            onPress={() => setField('published', !form.published)}
                        />
                        <Text style={theme.text.secondary}>
                            {form.published ? 'Hiển thị với user' : 'Chỉ lưu ở admin'}
                        </Text>
                    </View>
                </FormSection>

                {/* TAGS */}
                <FormSection title="Tags">
                    <LabeledInput
                        label="Tags (cách nhau bởi dấu phẩy)"
                        value={form.tags}
                        onChangeText={(t) => setField('tags', t)}
                    />
                </FormSection>

                {/* LIÊN KẾT NỘI DUNG */}
                <FormSection title="Liên kết nội dung">
                    <LinkedContentSelector
                        title="Từ vựng (Word)"
                        apiPath="word"
                        createHref="/admin/content/word/create"
                        selectedIds={form.wordIds}
                        onChangeSelected={(ids) => setField('wordIds', ids)}
                        searchLabel="Tìm từ vựng"
                        searchPlaceholder="Nhập JP / nghĩa / title..."
                    />

                    <View style={{ height: theme.tokens.space.sm }} />

                    <LinkedContentSelector
                        title="Bài đọc (Reading)"
                        apiPath="reading"
                        createHref="/admin/content/reading/create"
                        selectedIds={form.readingIds}
                        onChangeSelected={(ids) => setField('readingIds', ids)}
                        searchLabel="Tìm bài đọc"
                        searchPlaceholder="Nhập title / nội dung..."
                    />

                    <View style={{ height: theme.tokens.space.sm }} />

                    <LinkedContentSelector
                        title="Luyện nói (Speaking)"
                        apiPath="speaking"
                        createHref="/admin/content/speaking/create"
                        selectedIds={form.speakingIds}
                        onChangeSelected={(ids) => setField('speakingIds', ids)}
                        searchLabel="Tìm speaking"
                        searchPlaceholder="Nhập title / câu hỏi..."
                    />

                    <View style={{ height: theme.tokens.space.sm }} />

                    <LinkedContentSelector
                        title="Ngữ pháp (Grammar)"
                        apiPath="grammar"
                        createHref="/admin/content/grammar/create"
                        selectedIds={form.grammarIds}
                        onChangeSelected={(ids) => setField('grammarIds', ids)}
                        searchLabel="Tìm grammar"
                        searchPlaceholder="Nhập title / mẫu câu..."
                    />

                    <View style={{ height: theme.tokens.space.sm }} />

                    <LinkedContentSelector
                        title="Luyện nghe (Listening)"
                        apiPath="listening"
                        createHref="/admin/content/listening/create"
                        selectedIds={form.listeningIds}
                        onChangeSelected={(ids) => setField('listeningIds', ids)}
                        searchLabel="Tìm listening"
                        searchPlaceholder="Nhập title / mô tả..."
                    />
                </FormSection>

                {/* ACTIONS */}
                <View
                    style={{
                        flexDirection: 'row',
                        gap: theme.tokens.space.sm,
                        marginTop: theme.tokens.space.md,
                    }}
                >
                    <TouchableOpacity
                        onPress={save}
                        disabled={!isValid}
                        style={[
                            theme.button.primary.container,
                            {
                                flex: 1,
                                paddingVertical: 14,
                                borderRadius: theme.tokens.radius.lg,
                                alignItems: 'center',
                                opacity: isValid ? 1 : 0.5,
                            },
                        ]}
                    >
                        <Text style={theme.button.primary.label}>Lưu thay đổi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={confirmDelete}
                        style={[
                            theme.button.primary.container,
                            {
                                backgroundColor: theme.color.danger,
                                paddingVertical: 14,
                                borderRadius: theme.tokens.radius.lg,
                            },
                        ]}
                    >
                        <Text style={theme.button.primary.label}>Xoá</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: theme.tokens.space.xl }} />
            </ScrollView>
        </LayoutDefault>
    );
}
