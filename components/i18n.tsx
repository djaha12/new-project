"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  dict,
  isLocale,
  type Locale,
} from "@/lib/i18n";

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  d: (typeof dict)[Locale];
}

const I18nContext = createContext<Ctx | null>(null);

function readCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  return m && isLocale(m[1]) ? (m[1] as Locale) : null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // SSR и первый клиентский рендер — дефолтный язык, чтобы не было
  // расхождения гидрации. Реальный язык из cookie применяем после монтирования.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const c = readCookie();
    if (c && c !== locale) setLocaleState(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, d: dict[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Безопасный фолбэк вне провайдера — русский словарь.
    return { locale: DEFAULT_LOCALE, setLocale: () => {}, d: dict[DEFAULT_LOCALE] };
  }
  return ctx;
}
