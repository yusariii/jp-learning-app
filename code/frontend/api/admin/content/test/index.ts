// api/admin/content/test.ts
import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http';

export type JLPT = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type TestType = 'listening' | 'reading' | 'vocab' | 'grammar' | 'mixed';

export type TestOption = {
  label?: string;
  text?: string;
  isCorrect?: boolean;
};

export type TestQuestion = {
  type?: 'mcq' | 'fill_blank' | 'reorder' | 'true_false' | 'short_answer';
  section: 'vocab' | 'kanji' | 'grammar' | 'reading' | 'listening' | 'mixed' | 'other';
  subtype?:
    | 'kanji_reading'
    | 'kanji_writing'
    | 'word_meaning'
    | 'word_usage'
    | 'collocation'
    | 'grammar_pattern'
    | 'sentence_completion'
    | 'reordering'
    | 'short_reading'
    | 'medium_reading'
    | 'long_reading'
    | 'info_reading'
    | 'short_listening'
    | 'dialog_listening'
    | 'long_listening'
    | 'announcement_listening'
    | 'generic';

  promptJP: string;
  promptEN?: string;

  groupId?: string;
  groupOrder?: number;

  contextJP?: string;
  contextEN?: string;

  contextRef?: {
    readingId?: string;
    listeningId?: string;
  };

  mediaUrl?: string;
  mediaScriptJP?: string;
  mediaScriptEN?: string;

  options?: TestOption[];

  orderItems?: string[];

  answer?: any;

  explanationJP?: string;
  explanationVI?: string;

  points?: number;
  tags?: string[];
};

export type TestSection = {
  section: 'vocab' | 'kanji' | 'grammar' | 'reading' | 'listening' | 'mixed';
  title?: string;
  instructionsJP?: string;
  instructionsEN?: string;
  order?: number;
  questionCount?: number;
  timeLimitMinutes?: number;
};

export type Test = {
  _id?: string;
  title: string;
  level: JLPT;
  type: TestType;
  description?: string;

  sections?: TestSection[];
  questions?: TestQuestion[];

  timeLimitMinutes?: number;
  passingScorePercent?: number;
  published?: boolean;

  createdBy?: { adminId: string };
  updatedBy?: { adminId: string };

  createdAt?: string;
  updatedAt?: string;
};

export type TestListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  level?: JLPT | '';
  type?: TestType | '';
  published?: boolean | '';
  sort?: 'updatedAt' | 'createdAt' | 'title';
  order?: 'asc' | 'desc';
};

const BASE = 'test';

export async function listTests(params: TestListQuery) {
  const query = qs.stringify(params, {
    skipNulls: true,
    addQueryPrefix: true,
  });

  return get<{ data: Test[]; page: number; limit: number; total: number }>(
    `${BASE}${query}`,
  );
}

export const getTest = (id: string) =>
  get<Test>(`${BASE}/${encodeURIComponent(id)}`);

export type TestCreatePayload = Omit<
  Test,
  '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;

export const createTest = (payload: TestCreatePayload) =>
  post<Test>(BASE, payload);

export type TestUpdatePayload = Partial<TestCreatePayload>;

export const updateTest = (id: string, payload: TestUpdatePayload) =>
  put<Test>(`${BASE}/${encodeURIComponent(id)}`, payload);

export const deleteTest = (id: string) =>
  del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
