import { useCallback, useState } from 'react';

const KEY = 'hh-stars';
type Stars = Record<string, number>;

function load(): Stars {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Stars;
  } catch {
    return {};
  }
}

/** Best stars per game, kept on this device only. */
export function useProgress() {
  const [stars, setStars] = useState<Stars>(load);

  const saveStars = useCallback((id: string, n: number) => {
    setStars((old) => {
      if ((old[id] || 0) >= n) return old;
      const next = { ...old, [id]: n };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage not available */
      }
      return next;
    });
  }, []);

  return { stars, saveStars };
}

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
