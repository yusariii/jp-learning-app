import type { Lesson } from '@/api/admin/content/lesson';
import type { WordItem } from '@/components/client/WordList';
import type { GrammarItem } from '@/components/client/GrammarList';

export type LessonDetailResponse = {
  lesson: Lesson;
  words: WordItem[];
  grammars: GrammarItem[];
};

export type LessonListResponse = {
  data: Lesson[];
  page: number;
  limit: number;
  total: number;
};

const CLIENT_LESSON_BASE =
  process.env.EXPO_PUBLIC_API_CLIENT_LESSON_URL ||
  'http://localhost:3000/api/client/lesson';

export async function listLessons(params?: {
  jlptLevel?: string;
  page?: number;
  limit?: number;
  userId?: string;
}): Promise<LessonListResponse> {
  const query = new URLSearchParams();
  if (params?.jlptLevel) query.set('jlptLevel', params.jlptLevel);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.userId) query.set('userId', params.userId);

  const url = `${CLIENT_LESSON_BASE}${query.toString() ? '?' + query.toString() : ''}`;
  const res = await fetch(url);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json as LessonListResponse;
}

export async function getLessonDetail(id: string): Promise<LessonDetailResponse> {
  const res = await fetch(`${CLIENT_LESSON_BASE}/${encodeURIComponent(id)}`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json as LessonDetailResponse;
}

export async function getLessonWords(id: string): Promise<{ words: WordItem[] }> {
  const res = await fetch(`${CLIENT_LESSON_BASE}/${encodeURIComponent(id)}/words`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function getLessonGrammars(id: string): Promise<{ grammars: GrammarItem[] }> {
  const res = await fetch(`${CLIENT_LESSON_BASE}/${encodeURIComponent(id)}/grammars`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function getLessonListenings(id: string): Promise<{ listenings: any[] }> {
  const res = await fetch(`${CLIENT_LESSON_BASE}/${encodeURIComponent(id)}/listenings`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}
