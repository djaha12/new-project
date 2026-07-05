import type { Property } from "@/lib/types";
import { hashString } from "@/lib/utils";

/**
 * История цены и «дней в продаже». Данных реальных сделок нет, поэтому история
 * генерируется ДЕТЕРМИНИРОВАННО из slug/createdAt/price (стабильно для SSG).
 * Реальная история — задача tier3 (нужна БД сделок).
 */
export const REF_DATE = new Date("2026-07-05");

export interface PriceEvent {
  date: string; // ISO YYYY-MM-DD
  price: number; // USD
}

export function daysOnMarket(p: Property): number {
  const created = new Date(p.createdAt).getTime();
  return Math.max(1, Math.round((REF_DATE.getTime() - created) / 86_400_000));
}

export interface PriceHistory {
  events: PriceEvent[];
  reduced: boolean;
  reducedPct: number; // насколько снижена от первоначальной, %
}

export function priceHistory(p: Property): PriceHistory {
  const h = hashString(p.slug);
  const dom = daysOnMarket(p);
  const reduced = h % 3 === 0 && dom > 20; // ~треть объектов «снижены»
  const created = new Date(p.createdAt);

  if (!reduced) {
    return { events: [{ date: p.createdAt, price: p.price }], reduced: false, reducedPct: 0 };
  }

  const upPct = 5 + (h % 8); // на 5–12% дороже изначально
  const original = Math.round((p.price * (1 + upPct / 100)) / 500) * 500;
  const midMs = created.getTime() + (REF_DATE.getTime() - created.getTime()) * 0.55;
  const midDate = new Date(midMs).toISOString().slice(0, 10);

  return {
    events: [
      { date: p.createdAt, price: original },
      { date: midDate, price: p.price },
    ],
    reduced: true,
    reducedPct: Math.round(((original - p.price) / original) * 100),
  };
}
