import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http';

export type GrammarExample = { sentenceJP: string; readingKana?: string; meaningVI?: string; meaningEN?: string; };
export type Grammar = {
  _id?: string; title: string; description?: string;
  explanationJP: string; explanationEN?: string;
  examples: GrammarExample[]; jlptLevel: ''|'N5'|'N4'|'N3'|'N2'|'N1';
  createdAt?: string; updatedAt?: string;
};
export type GrammarListQuery = {
  page?: number; limit?: number; q?: string;
  jlpt?: ''|'N5'|'N4'|'N3'|'N2'|'N1';
  sort?: 'updatedAt'|'createdAt'|'title';
};

const BASE = 'grammar'; 

export async function listGrammars(params: GrammarListQuery) {
  const query = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });
  return get<{ data: Grammar[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}
export const getGrammar = (id: string) => get<Grammar>(`${BASE}/${encodeURIComponent(id)}`);
export const createGrammar = (payload: Grammar) => post<Grammar>(BASE, payload);
export const updateGrammar = (id: string, payload: Partial<Grammar>) => put<Grammar>(`${BASE}/${encodeURIComponent(id)}`, payload);
export const deleteGrammar = (id: string) => del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
