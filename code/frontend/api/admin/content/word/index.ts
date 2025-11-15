import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http';

export type Example = { sentenceJP: string; readingKana?: string; meaningVI?: string; };
export type Word = {
  _id?: string; termJP: string; hiraKata?: string; romaji?: string;
  meaningVI?: string; meaningEN?: string; kanji?: string; audioUrl?: string;
  tags: string[]; jlptLevel: '' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples: Example[]; createdAt?: string; updatedAt?: string;
};
export type WordListQuery = {
  page?: number; limit?: number; q?: string;
  jlpt?: ''|'N5'|'N4'|'N3'|'N2'|'N1';
  sort?: 'updatedAt'|'createdAt'|'termJP';
};

const BASE = 'word'; 

export async function listWords(params: WordListQuery) {
  const query = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });
  return get<{ data: Word[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}
export const getWord = (id: string) => get<Word>(`${BASE}/${encodeURIComponent(id)}`);
export const createWord = (payload: Word) => post<Word>(BASE, payload);
export const editWord = (id: string, payload: Partial<Word>) => put<Word>(`${BASE}/${encodeURIComponent(id)}`, payload);
export const deleteWord = (id: string) => del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
