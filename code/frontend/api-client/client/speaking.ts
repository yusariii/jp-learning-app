import { http, CLIENT_BASE } from '@/helpers/http';

interface Speaking {
  _id: string;
  title: string;
  prompts: {
    promptJP: string;
    promptEN?: string;
    expectedSample?: string;
  }[];
  guidance?: string;
  sampleAudioUrl?: string;
}

export const getSpeakingByLesson = async (lessonId: string) => {
  return http<{ speakings: Speaking[] }>(`${CLIENT_BASE}/speaking/${lessonId}`, { baseURL: '' });
};

export const getSpeakingDetail = async (id: string) => {
  return http<Speaking>(`${CLIENT_BASE}/speaking/detail/${id}`, { baseURL: '' });
};
