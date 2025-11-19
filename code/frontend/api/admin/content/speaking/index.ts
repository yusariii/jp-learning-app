import qs from 'qs';
import { get, post, put, del } from '../../../../helpers/http';

export type SpeakingPrompt = {
  promptJP: string;
  promptEN?: string;
  expectedSample?: string;
};

export type Speaking = {
  _id?: string;
  title: string;
  prompts: SpeakingPrompt[];
  guidance?: string;
  sampleAudioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SpeakingListQuery = {
  page?: number; limit?: number; q?: string;
  sort?: 'updatedAt'|'createdAt'|'title';
};

const BASE = 'speaking';

export async function listSpeakings(params: SpeakingListQuery) {
  const query = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });
  return get<{ data: Speaking[]; page: number; limit: number; total: number }>(`${BASE}${query}`);
}
export const getSpeaking = (id: string) => get<Speaking>(`${BASE}/${encodeURIComponent(id)}`);
export const createSpeaking = (payload: Speaking) => post<Speaking>(BASE, payload);
export const updateSpeaking = (id: string, payload: Partial<Speaking>) => put<Speaking>(`${BASE}/${encodeURIComponent(id)}`, payload);
export const deleteSpeaking = (id: string) => del<{ ok: true }>(`${BASE}/${encodeURIComponent(id)}`);
