import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http'

export type ReadingOption = { text?: string; isCorrect?: boolean };
export type ReadingQuestion = {
  questionJP: string;
  questionEN?: string;
  type: 'mcq' | 'short_answer';
  options?: ReadingOption[];     
  answer?: any;                  
};

export type Reading = {
  _id?: string;
  title: string;
  textJP: string;
  textEN?: string;
  audioUrl?: string;
  comprehension: ReadingQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt?: string;
  updatedAt?: string;
};

export type ReadingListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  difficulty?: 'easy'|'medium'|'hard'|'';
  sort?: 'updatedAt'|'createdAt'|'title';
};

const BASE = 'reading';

export async function listReadings(params: ReadingListQuery) {
  const query = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });
  return get<{ data: Reading[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}

export const getReading = (id: string) => get<Reading>(`${BASE}/${encodeURIComponent(id)}`);
export const createReading = (payload: Reading) => post<Reading>(BASE, payload);
export const updateReading = (id: string, payload: Partial<Reading>) => put<Reading>(`${BASE}/${encodeURIComponent(id)}`, payload);
export const deleteReading = (id: string) => del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
