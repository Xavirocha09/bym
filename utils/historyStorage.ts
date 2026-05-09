import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '@/types';

const HISTORY_KEY = '@bym_history';
const ONBOARDING_KEY = '@bym_onboarding_complete';
const READ_ARTICLES_KEY = '@bym_read_articles';

export async function getReadArticles(): Promise<Set<string>> {
  try {
    const data = await AsyncStorage.getItem(READ_ARTICLES_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

export async function markArticleRead(id: string): Promise<void> {
  try {
    const read = await getReadArticles();
    read.add(id);
    await AsyncStorage.setItem(READ_ARTICLES_KEY, JSON.stringify([...read]));
  } catch {}
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addHistoryItem(item: HistoryItem): Promise<void> {
  try {
    const history = await getHistory();
    const updated = [item, ...history].slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export async function getHistoryItem(id: string): Promise<HistoryItem | null> {
  try {
    const history = await getHistory();
    return history.find((h) => h.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function deleteHistoryItem(id: string): Promise<HistoryItem[]> {
  try {
    const history = await getHistory();
    const updated = history.filter((h) => h.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch {}
}

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch {}
}
