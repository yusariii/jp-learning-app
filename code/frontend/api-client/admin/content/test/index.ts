import qs from 'qs';
import { get, post, put, del } from '@/helpers/http';

export type BaseQuestion = {
  questionText: string;
  options: { label?: string; text?: string }[];
  correctIndex: number;
  points?: number;
  contextJP?: string;
  mediaUrl?: string;
};

export type SimpleUnit = {
  _id?: string;
  title?: string;
  instructionsJP?: string;
  instructionsEN?: string;
  questions: BaseQuestion[];
};

export type ReadingPassage = {
  _id?: string;
  title?: string;
  passageJP: string;
  passageEN?: string;
  questions: BaseQuestion[];
};

export type ReadingUnit = {
  _id?: string;
  title?: string;
  instructionsJP?: string;
  instructionsEN?: string;
  passages: ReadingPassage[];
};

export type ListeningUnit = {
  _id?: string;
  title?: string;
  instructionsJP?: string;
  instructionsEN?: string;
  mediaUrl?: string;                // URL audio/video của bài
  questions: BaseQuestion[];
};

export type VocabSection = {
  totalTime?: number;
  vocabUnits: SimpleUnit[];
};

export type GrammarReadingSection = {
  totalTime?: number;
  grammarUnits: SimpleUnit[];
  readingUnits: ReadingUnit[];
};

export type ListeningSection = {
  totalTime?: number;
  listeningUnits: ListeningUnit[];
};

export type TestDoc = {
  _id?: string;
  title: string;
  jlptLevel: 'N5'|'N4'|'N3'|'N2'|'N1';
  description?: string;

  vocabSection: VocabSection;
  grammarReadingSection: GrammarReadingSection;
  listeningSection: ListeningSection;

  totalTime?: number;
  passingScorePercent?: number;
  published?: boolean;
  createdAt?: string; updatedAt?: string;
};

export type TestListQuery = {
  page?: number; limit?: number; q?: string;
  jlptLevel?: TestDoc['jlptLevel'] | '';
  published?: '' | 'true' | 'false';
  sort?: 'updatedAt' | 'createdAt' | 'title';
};

const BASE = 'test';

export async function listTests(params: TestListQuery) {
  const query = qs.stringify(params, { addQueryPrefix: true, skipNulls: true });
  return get<{ data: TestDoc[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}
export const getTest    = (id: string) => get<TestDoc>(`${BASE}/${encodeURIComponent(id)}`);
export const createTest = (payload: TestDoc) => post<TestDoc>(BASE, payload);
export const updateTest = (id: string, payload: Partial<TestDoc>) => put<TestDoc>(`${BASE}/${encodeURIComponent(id)}`, payload);
export const deleteTest = (id: string) => del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
