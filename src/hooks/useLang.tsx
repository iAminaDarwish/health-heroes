import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ar, type UiKey } from '../content/ar';
import { en } from '../content/en';
import type { L } from '../content/medical';

export type Lang = 'ar' | 'en';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Interface text. */
  t: (key: UiKey) => string;
  /** Pick the current language from a { ar, en } pair. */
  tl: (text: L) => string;
};

const LangContext = createContext<Ctx | null>(null);
const KEY = 'hh-lang';

function loadLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage not available */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => (lang === 'ar' ? ar : en)[key],
      tl: (text) => text[lang],
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang outside LangProvider');
  return ctx;
}
