import { properties } from "@/lib/data/properties";
import { districts } from "@/lib/data/districts";
import type { Category, Property, Tier } from "@/lib/types";

/**
 * MULK Estimate — прозрачный AVM на наших данных (не «чёрный ящик»).
 * База: медианная цена за единицу площади по сопоставимым объектам той же
 * категории, скорректированная на уровень (tier). Возвращаем диапазон,
 * дельту к запрашиваемой цене, вердикт и сами сопоставимые объекты (comps).
 *
 * Реальный AVM на данных сделок — задача tier3 (нужна база сделок/выписок).
 */

const TIER_FACTOR: Record<Tier, number> = {
  standard: 0.92,
  investment: 1.0,
  premium: 1.08,
  elite: 1.2,
};

const round500 = (n: number) => Math.round(n / 500) * 500;

function unitPrice(p: Property): number {
  return p.price / Math.max(p.area, 1); // $/м² или $/сотка
}

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export type Verdict = "below" | "fair" | "above";

export const VERDICT_META: Record<Verdict, { label: string; tone: "emerald" | "neutral" | "danger" }> = {
  below: { label: "Ниже рынка", tone: "emerald" },
  fair: { label: "В рынке", tone: "neutral" },
  above: { label: "Выше рынка", tone: "danger" },
};

export interface EstimateInput {
  category: Category;
  areaUnit: "m2" | "sotka";
  area: number;
  tier: Tier;
  district?: string;
  isForeign?: boolean;
  country?: string;
  excludeId?: string;
}

export interface Estimate {
  low: number;
  base: number;
  high: number;
  medianUnit: number; // медианная $/ед. по сегменту
  areaUnit: "m2" | "sotka";
  compsCount: number;
}

/** Базовая оценка по параметрам (для формы продавца и карточки).
 *  Сегментируем по рынку (Бишкек/зарубежье не смешиваем) и заякориваем на
 *  индексе $/м² района, чтобы не сравнивать, например, Дубай с Бишкеком. */
export function estimateFromInput(input: EstimateInput): Estimate {
  const isForeign = Boolean(input.isForeign);
  // Сопоставимые: та же категория, единица площади и ТОТ ЖЕ рынок.
  const comps = properties.filter(
    (p) =>
      p.category === input.category &&
      p.areaUnit === input.areaUnit &&
      p.id !== input.excludeId &&
      Boolean(p.isForeign) === isForeign &&
      (!isForeign || !input.country || p.country === input.country),
  );

  const compMedian = comps.length >= 2 ? median(comps.map(unitPrice)) : null;

  // Якорь по району (индекс $/м²) — только для домашнего рынка и метража.
  const dObj =
    !isForeign && input.areaUnit === "m2" && input.district
      ? districts.find((d) => d.name === input.district)
      : undefined;
  const districtUnit = dObj?.pricePerM2 ?? null;

  // База $/ед.: усредняем медиану comps и индекс района, если есть оба.
  let baseUnit: number;
  if (compMedian != null && districtUnit != null) baseUnit = (compMedian + districtUnit) / 2;
  else if (compMedian != null) baseUnit = compMedian;
  else if (districtUnit != null) baseUnit = districtUnit;
  else {
    // Фолбэк: медиана по категории на том же рынке (любой район).
    const wide = properties.filter(
      (p) => p.category === input.category && p.areaUnit === input.areaUnit && Boolean(p.isForeign) === isForeign,
    );
    baseUnit = wide.length ? median(wide.map(unitPrice)) : 0;
  }

  const base = round500(baseUnit * input.area * TIER_FACTOR[input.tier]);
  return {
    low: round500(base * 0.9),
    base,
    high: round500(base * 1.12),
    medianUnit: Math.round(baseUnit),
    areaUnit: input.areaUnit,
    compsCount: comps.length,
  };
}

export interface PropertyEstimate extends Estimate {
  askingPrice: number;
  deltaPct: number; // (asking - base) / base
  verdict: Verdict;
  comps: Property[];
}

/** Оценка конкретного объекта каталога + вердикт + похожие для показа. */
export function estimateProperty(p: Property): PropertyEstimate {
  const est = estimateFromInput({
    category: p.category,
    areaUnit: p.areaUnit,
    area: p.area,
    tier: p.tier,
    district: p.district,
    isForeign: p.isForeign,
    country: p.country,
    excludeId: p.id,
  });
  const deltaPct = est.base ? Math.round(((p.price - est.base) / est.base) * 100) : 0;
  const verdict: Verdict = deltaPct <= -5 ? "below" : deltaPct >= 6 ? "above" : "fair";

  const foreign = Boolean(p.isForeign);
  const comps = properties
    .filter(
      (x) =>
        x.category === p.category &&
        x.areaUnit === p.areaUnit &&
        x.id !== p.id &&
        Boolean(x.isForeign) === foreign &&
        (!foreign || x.country === p.country),
    )
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 4);

  return { ...est, askingPrice: p.price, deltaPct, verdict, comps };
}
