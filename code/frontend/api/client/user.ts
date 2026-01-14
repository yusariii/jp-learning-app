export type User = {
  _id: string;
  email: string;
  fullName?: string;
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  avatar?: string;
  xp?: number;
  streak?: number;
  progress?: any[];
};

export type UserProgress = {
  progress: any[];
  streak: number;
  xp: number;
  totalLessonsCompleted: number;
  totalWords: number;
};

export type PracticeStats = {
  dailyReview: {
    wordsToReview: number;
    dueToday: boolean;
  };
  weakPoints: {
    incorrectCount: number;
    topWeakCategories: string[];
  };
  speedChallenge: {
    bestTime: number;
    avgAccuracy: number;
  };
};

export type SkillCategory = {
  id: string;
  title: string;
  icon: string;
  color: string;
  totalWords?: number;
  learnedWords?: number;
  totalGrammar?: number;
  learnedGrammar?: number;
  totalKanji?: number;
  learnedKanji?: number;
  totalListening?: number;
  completedListening?: number;
};

export type SkillCategoriesResponse = {
  categories: SkillCategory[];
};

const CLIENT_USER_BASE =
  process.env.EXPO_PUBLIC_API_CLIENT_USER_URL ||
  'http://localhost:3000/api/client/user';

export async function getUserProfile(userId?: string): Promise<{ user: User }> {
  const query = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${CLIENT_USER_BASE}/profile${query}`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function updateUserProfile(
  data: Partial<Pick<User, 'fullName' | 'level' | 'avatar'>>,
  userId?: string
): Promise<{ user: User }> {
  const query = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${CLIENT_USER_BASE}/profile${query}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function getUserProgress(userId?: string): Promise<UserProgress> {
  const query = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${CLIENT_USER_BASE}/progress${query}`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function getPracticeStats(userId?: string): Promise<PracticeStats> {
  const query = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${CLIENT_USER_BASE}/practice-stats${query}`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function getSkillCategories(userId?: string): Promise<SkillCategoriesResponse> {
  const query = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${CLIENT_USER_BASE}/skill-categories${query}`);

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}

export async function updateSectionProgress(
  lessonId: string,
  section: 'vocab' | 'grammar' | 'listening' | 'reading' | 'speaking',
  userId?: string
): Promise<{ message: string; progress: any }> {
  const query = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${CLIENT_USER_BASE}/progress/${lessonId}/section${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, userId }),
  });

  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  return json;
}
