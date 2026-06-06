import type { StoredState } from './types';

const STORAGE_KEY = 'video-platform-state';

const todayKey = () => new Date().toISOString().slice(0, 10);

export const defaultState = (): StoredState => ({
  plan: 'free',
  dailyUsage: {
    date: todayKey(),
    count: 0
  },
  downloads: []
});

export const normalizeState = (state: StoredState): StoredState => {
  const today = todayKey();

  if (state.dailyUsage.date !== today) {
    return {
      ...state,
      dailyUsage: {
        date: today,
        count: 0
      }
    };
  }

  return state;
};

export const readState = (): StoredState => {
  if (typeof window === 'undefined') {
    return defaultState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultState();
  }

  try {
    return normalizeState(JSON.parse(raw) as StoredState);
  } catch {
    return defaultState();
  }
};

export const writeState = (state: StoredState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
};
