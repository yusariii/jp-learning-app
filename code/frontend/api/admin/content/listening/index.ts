import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http'

export type ListeningOption = { text?: string; isCorrect?: boolean };
export type ListeningQuestion = {
  questionJP: string;
  questionEN?: string;
  type: 'mcq' | 'fill_blank' | 'true_false' | 'short_answer';
  options?: ListeningOption[];     
  answer?: any;                     
};

export type Listening = {
  _id?: string;
  title: string;
  audioUrl: string;                
  transcriptJP?: string;
  transcriptEN?: string;
  questions: ListeningQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt?: string; updatedAt?: string;
};

export type ListeningListQuery = {
  page?: number; limit?: number; q?: string;
  difficulty?: '' | 'easy' | 'medium' | 'hard';
  sort?: 'updatedAt' | 'createdAt' | 'title';
};

const BASE = 'listening';

export async function listListenings(params: ListeningListQuery) {
  const query = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });
  return get<{ data: Listening[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}
export const getListening    = (id: string) => get<Listening>(`${BASE}/${encodeURIComponent(id)}`);
export const createListening = (payload: Listening) => post<Listening>(BASE, payload);
export const updateListening = (id: string, payload: Partial<Listening>) => put<Listening>(`${BASE}/${encodeURIComponent(id)}`, payload);
export const deleteListening = (id: string) => del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
