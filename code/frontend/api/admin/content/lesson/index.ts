import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http';

export type LessonWordRef = { wordId: string };
export type LessonReadingRef = { readingId: string };
export type LessonSpeakingRef = { speakingId: string };
export type LessonGrammarRef = { grammarId: string };
export type LessonListeningRef = { listeningId: string };

export type Lesson = {
  _id?: string;
  title: string;
  lessonNumber: number;
  slug?: string;
  description?: string;

  wordIds: LessonWordRef[];
  readingIds: LessonReadingRef[];
  speakingIds: LessonSpeakingRef[];
  grammarIds: LessonGrammarRef[];
  listeningIds: LessonListeningRef[];

  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | '';
  durationMinutes: number;
  published: boolean;
  tags: string[];

  createdAt?: string;
  updatedAt?: string;
};

export type LessonListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  jlptLevel?: Lesson['jlptLevel'] | '';
  published?: '' | 'true' | 'false';
  sort?: 'updatedAt' | 'createdAt' | 'lessonNumber' | 'title';
};

const BASE = 'lesson';

export async function listLessons(params: LessonListQuery) {
  const query = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });
  return get<{ data: Lesson[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}

export const getLesson = (id: string) =>
  get<Lesson>(`${BASE}/${encodeURIComponent(id)}`);

export const createLesson = (payload: Lesson) =>
  post<Lesson>(BASE, payload);

export const updateLesson = (id: string, payload: Partial<Lesson>) =>
  put<Lesson>(`${BASE}/${encodeURIComponent(id)}`, payload);

export const deleteLesson = (id: string) =>
  del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
