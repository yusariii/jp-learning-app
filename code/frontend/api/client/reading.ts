import { http, CLIENT_BASE } from '@/helpers/http';

interface Reading {
  _id: string;
  title: string;
  textJP: string;
  textEN?: string;
  audioUrl?: string;
  comprehension: {
    questionJP: string;
    questionEN?: string;
    type: 'mcq' | 'short_answer';
    options?: { text: string; isCorrect: boolean }[];
    answer?: string;
  }[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const getReadingByLesson = async (lessonId: string) => {
  return http<{ readings: Reading[] }>(`${CLIENT_BASE}/reading/${lessonId}`, { baseURL: '' });
};

export const getReadingDetail = async (id: string) => {
  return http<Reading>(`${CLIENT_BASE}/reading/detail/${id}`, { baseURL: '' });
};
