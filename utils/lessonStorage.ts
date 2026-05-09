import AsyncStorage from '@react-native-async-storage/async-storage';

const LESSON_PROGRESS_KEY = '@bym_lesson_progress';

export interface LessonProgress {
  completed: boolean;
  score: number;
  total: number;
  xpEarned: number;
}

type ProgressMap = Record<string, LessonProgress>;

export async function getLessonProgress(): Promise<ProgressMap> {
  try {
    const data = await AsyncStorage.getItem(LESSON_PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export async function saveLessonProgress(
  lessonId: string,
  progress: LessonProgress
): Promise<void> {
  try {
    const all = await getLessonProgress();
    all[lessonId] = progress;
    await AsyncStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(all));
  } catch {}
}

export async function getTotalXP(): Promise<number> {
  try {
    const all = await getLessonProgress();
    return Object.values(all).reduce((sum, p) => sum + (p.xpEarned ?? 0), 0);
  } catch {
    return 0;
  }
}
