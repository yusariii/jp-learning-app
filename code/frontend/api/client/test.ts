import { get, post, CLIENT_BASE } from '@/helpers/http';

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  _id?: string;
  questionText: string;
  options: QuestionOption[];
  correctIndex: number;
  points: number;
  contextJP?: string;
  mediaUrl?: string;
}

export interface Unit {
  _id: string;
  title: string;
  instructionsJP: string;
  instructionsEN?: string;
  questions: Question[];
}

export interface ReadingPassage {
  _id: string;
  title: string;
  passageJP: string;
  passageEN?: string;
  questions: Question[];
}

export interface ReadingUnit {
  _id: string;
  title: string;
  instructionsJP: string;
  instructionsEN?: string;
  passages: ReadingPassage[];
}

export interface ListeningUnit {
  _id: string;
  title: string;
  instructionsJP: string;
  instructionsEN?: string;
  mediaUrl: string;
  questions: Question[];
}

export interface TestDetail {
  _id: string;
  title: string;
  jlptLevel: string;
  description?: string;
  totalTime: number;
  passingScorePercent: number;
  vocabSection: {
    totalTime: number;
    vocabUnits: Unit[];
  };
  grammarReadingSection: {
    totalTime: number;
    grammarUnits: Unit[];
    readingUnits: ReadingUnit[];
  };
  listeningSection: {
    totalTime: number;
    listeningUnits: ListeningUnit[];
  };
}

export interface TestListItem {
  _id: string;
  title: string;
  jlptLevel: string;
  description?: string;
  totalTime: number;
  passingScorePercent: number;
}

export interface TestSubmitResponse {
  testId: string;
  totalScore: number;
  totalPoints: number;
  scorePercent: number;
  passed: boolean;
  sectionScores: {
    vocab: number;
    grammarReading: number;
    listening: number;
  };
  passingScore: number;
}

// Get all published tests
export const listTests = async (params?: { jlptLevel?: string; limit?: number; offset?: number }) => {
  const query = new URLSearchParams();
  if (params?.jlptLevel) query.append('jlptLevel', params.jlptLevel);
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.offset) query.append('offset', params.offset.toString());
  
  const path = query.toString() ? `/test?${query.toString()}` : '/test';
  const response = await get<{ tests: TestListItem[]; total: number; limit: number; offset: number }>(path, { baseURL: CLIENT_BASE });
  return response;
};

// Get test detail with all questions
export const getTestDetail = async (testId: string): Promise<{ test: TestDetail }> => {
  const response = await get<{ test: TestDetail }>(`/test/${testId}`, { baseURL: CLIENT_BASE });
  return response;
};

// Submit test answers
export const submitTest = async (testId: string, answers: Record<string, number>): Promise<TestSubmitResponse> => {
  const response = await post<TestSubmitResponse>(`/test/${testId}/submit`, { answers }, { baseURL: CLIENT_BASE });
  return response;
};
