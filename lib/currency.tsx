"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Мультивалютность USD ↔ сом (KGS). Курс НБКР зашит константой (авто-обновление
 * через API НБКР — задача tier3). Валюта хранится в cookie/localStorage.
 */
export type Currency = "USD" | "KGS";

// Курс НБКР (обновляется вручную; фолбэк-значение).
export const USD_KGS = 89.5;
const COOKIE = "mulk_currency";

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rate: number; // сом за 1 USD
}

const CurrencyContext = createContext<Ctx | null>(null);

function readCookie(): Currency | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  return m && (m[1] === "USD" || m[1] === "KGS") ? (m[1] as Currency) : null;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCur] = useState<Currency>("USD");

  useEffect(() => {
    const c = readCookie();
    if (c && c !== currency) setCur(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCur(c);
    document.cookie = `${COOKIE}=${c}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate: USD_KGS }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) return { currency: "USD", setCurrency: () => {}, rate: USD_KGS };
  return ctx;
}

/** Форматирование суммы (в USD на входе) в выбранной валюте.
 *  Округляем до целых единиц — иначе дробная часть в ru-RU даёт запятую,
 *  которую замена на пробел превращает в лишний разряд («3 409,258» → «3 409 258»). */
export function fmtMoney(usd: number, currency: Currency, rate = USD_KGS): string {
  if (currency === "KGS") {
    const raw = usd * rate;
    const som = raw >= 100000 ? Math.round(raw / 100) * 100 : Math.round(raw);
    return som.toLocaleString("ru-RU").replace(/ /g, " ") + " сом";
  }
  return "$ " + Math.round(usd).toLocaleString("ru-RU").replace(/ /g, " ");
}
