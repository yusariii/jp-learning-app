import { http, CLIENT_BASE } from '@/helpers/http';

interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface Word {
  _id: string;
  termJP: string;
  hiraKata?: string;
  romaji?: string;
  meaningVI?: string;
  meaningEN?: string;
  kanji?: string;
  jlptLevel?: string;
  examples?: {
    sentenceJP: string;
    readingKana: string;
    meaningVI: string;
  }[];
  audioUrl?: string;
}

interface Grammar {
  _id: string;
  title: string;
  description?: string;
  explanationJP: string;
  explanationEN?: string;
  jlptLevel?: string;
  examples?: {
    sentenceJP: string;
    readingKana: string;
    meaningVI: string;
    meaningEN: string;
  }[];
}

export const searchWords = async (
  query: string,
  jlptLevel?: string,
  page: number = 1,
  limit: number = 20
): Promise<SearchResult<Word>> => {
  let url = `${CLIENT_BASE}/dictionary/words/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
  if (jlptLevel) url += `&jlptLevel=${jlptLevel}`;
  
  return http<SearchResult<Word>>(url, { baseURL: '' });
};

export const searchGrammar = async (
  query: string,
  jlptLevel?: string,
  page: number = 1,
  limit: number = 20
): Promise<SearchResult<Grammar>> => {
  let url = `${CLIENT_BASE}/dictionary/grammar/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
  if (jlptLevel) url += `&jlptLevel=${jlptLevel}`;
  
  return http<SearchResult<Grammar>>(url, { baseURL: '' });
};

export const getWordDetail = async (id: string): Promise<Word> => {
  return http<Word>(`${CLIENT_BASE}/dictionary/words/${id}`, { baseURL: '' });
};

export const getGrammarDetail = async (id: string): Promise<Grammar> => {
  return http<Grammar>(`${CLIENT_BASE}/dictionary/grammar/${id}`, { baseURL: '' });
};
