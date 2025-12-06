import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { appAlert, appError } from '@/helpers/appAlert';
import LayoutDefault from '@/layout-default/layout-default';
import { createLesson, type Lesson } from '@/api/admin/content/lesson';
import { useAppTheme } from '@/hooks/use-app-theme';
import FormSection from '@/components/ui/FormSection';
import LabeledInput from '@/components/ui/LabeledInput';
import Chip from '@/components/ui/Chip';
import LinkedContentSelector from '@/components/block/LinkedContentSelector';
import BackButton from '@/components/ui/BackButton';
import { router, Href } from 'expo-router';
import JLPTPicker from '@/components/ui/JLPTPicker';

type JLPT = Lesson['jlptLevel'] | '';

type Form = {
    title: string;
    lessonNumber: string;
    description: string;
    jlptLevel: JLPT;
    published: boolean;
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

const buildPayload = (form: Form): Lesson => {
    const lessonNumber = Number(form.lessonNumber);

    return {
        title: form.title.trim(),
        lessonNumber: Number.isNaN(lessonNumber) ? 0 : lessonNumber,
        slug: undefined,
        description: form.description.trim() || undefined,
        jlptLevel: form.jlptLevel || '',
        published: form.published,
        wordIds: form.wordIds.map((id) => ({ wordId: id })),
        readingIds: form.readingIds.map((id) => ({ readingId: id })),
        speakingIds: form.speakingIds.map((id) => ({ speakingId: id })),
        grammarIds: form.grammarIds.map((id) => ({ grammarId: id })),
        listeningIds: form.listeningIds.map((id) => ({ listeningId: id })),
    } as Lesson;
};

export default function CreateLessonScreen() {
    const { theme } = useAppTheme();

    const [form, setForm] = useState<Form>({
        title: '',
        lessonNumber: '',
        description: '',
        jlptLevel: '',
        published: false,
        wordIds: [],
        readingIds: [],
        speakingIds: [],
        grammarIds: [],
        listeningIds: [],
    });

    const setField = <K extends keyof Form>(key: K, value: Form[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const isValid = !!form.title.trim() && !!form.lessonNumber.trim();

    const submit = async () => {
        if (!isValid) {
            return appAlert(
                'Thiếu dữ liệu',
                'Cần nhập “Tiêu đề” và “Số bài (lessonNumber)”.',
            );
        }

        try {
            const payload = buildPayload(form);
            const created = await createLesson(payload);
            appAlert('Thành công', 'Đã tạo bài học mới.', () => {
                router.replace(`/admin/content/lesson/${created._id}` as Href);
            });
        } catch (e: any) {
            appError(String(e?.message || e));
        }
    };

    return (
        <LayoutDefault title="Thêm bài học">
            <ScrollView
                contentContainerStyle={{
                    padding: theme.tokens.space.md,
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

                <FormSection title="JLPT">
                    <JLPTPicker value={form.jlptLevel} onChange={(v) => setField('jlptLevel', v)} />
                </FormSection>

                {/* THIẾT LẬP */}
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
                            onPress={() => setField('published', !form.published)}
                        />
                        <Text style={theme.text.secondary}>
                            {form.published ? 'Hiển thị với user' : 'Chỉ lưu ở admin'}
                        </Text>
                    </View>
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
                        title="Luyện nghe (Listening)"
                        apiPath="listening"
                        createHref="/admin/content/listening/create"
                        selectedIds={form.listeningIds}
                        onChangeSelected={(ids) => setField('listeningIds', ids)}
                        searchLabel="Tìm listening"
                        searchPlaceholder="Nhập title / mô tả..."
                    />
                </FormSection>

                {/* SUBMIT */}
                <TouchableOpacity
                    onPress={submit}
                    disabled={!isValid}
                    style={[
                        theme.button.primary.container,
                        {
                            paddingVertical: 14,
                            borderRadius: theme.tokens.radius.lg,
                            alignItems: 'center',
                            opacity: isValid ? 1 : 0.5,
                        },
                    ]}
                >
                    <Text style={theme.button.primary.label}>Lưu lesson</Text>
                </TouchableOpacity>

                <View style={{ height: theme.tokens.space.xl }} />
            </ScrollView>
        </LayoutDefault>
    );
}
