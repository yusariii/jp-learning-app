const BASE = process.env.EXPO_PUBLIC_API_ADMIN_CONTENT_URL;

function authHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  return headers;
}

export type Word = {
  _id?: string;
  termJP: string;
  hiraKata?: string;
  romaji?: string;
  meaningVI?: string;
  meaningEN?: string;
  kanji?: string;
  examples: { sentenceJP: string; readingKana: string; meaningVI: string; }[];
  audioUrl?: string;
  tags: string[];
  jlptLevel: '' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  createdAt?: string;
  updatedAt?: string;
};

export async function listWords(params: { page?: number; limit?: number; q?: string; jlpt?: string; sort?: 'updatedAt'|'createdAt'|'termJP'; }) {
  const url = new URL(`${BASE}/words`);
  if (params.page) url.searchParams.set('page', String(params.page));
  if (params.limit) url.searchParams.set('limit', String(params.limit));
  if (params.q) url.searchParams.set('q', params.q);
  if (params.jlpt) url.searchParams.set('jlpt', params.jlpt);
  if (params.sort) url.searchParams.set('sort', params.sort);
  const res = await fetch(url.toString(), { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getWord(id: string) {
  const res = await fetch(`${BASE}/words/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createWord(payload: Word) {
  const res = await fetch(`${BASE}/words`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateWord(id: string, payload: Partial<Word>) {
  const res = await fetch(`${BASE}/words/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteWord(id: string) {
  const res = await fetch(`${BASE}/words/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
