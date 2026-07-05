/**
 * Ориентиры доходности для инвест-калькулятора: типичная арендная доходность,
 * рост стоимости и издержки по локациям (Бишкек по районам + зарубежные
 * направления). Демо-значения для расчётов, не гарантия.
 */
export interface InvestAssumption {
  key: string; // район (name) или id abroad-направления
  label: string;
  grossYieldPct: number; // валовая доходность аренды, % в год
  appreciationPct: number; // ожидаемый рост стоимости, % в год
  costsPct: number; // издержки от арендного дохода (управление, простои, налоги), %
  note?: string;
}

// Бишкек — по районам (ключ = District.name)
export const districtAssumptions: Record<string, InvestAssumption> = {
  "Золотой квадрат": { key: "Золотой квадрат", label: "Золотой квадрат", grossYieldPct: 7, appreciationPct: 6, costsPct: 20 },
  Джал: { key: "Джал", label: "Джал", grossYieldPct: 8, appreciationPct: 7, costsPct: 20 },
  Асанбай: { key: "Асанбай", label: "Асанбай", grossYieldPct: 8, appreciationPct: 6, costsPct: 22 },
  "Восток-5": { key: "Восток-5", label: "Восток-5", grossYieldPct: 9, appreciationPct: 5, costsPct: 22 },
  "Байтик / Кой-Таш": { key: "Байтик / Кой-Таш", label: "Байтик / Кой-Таш", grossYieldPct: 6, appreciationPct: 9, costsPct: 25, note: "Рост за счёт застройки зоны" },
  "Иссык-Куль": { key: "Иссык-Куль", label: "Иссык-Куль", grossYieldPct: 10, appreciationPct: 8, costsPct: 35, note: "Доход сезонный (посуточно)" },
};

// Зарубежные направления (ключ = AbroadDirection.id)
export const abroadAssumptions: Record<string, InvestAssumption> = {
  "dubai-invest": { key: "dubai-invest", label: "Дубай", grossYieldPct: 7, appreciationPct: 6, costsPct: 22, note: "Service charge + управление" },
  "turkey-living": { key: "turkey-living", label: "Анталия", grossYieldPct: 6, appreciationPct: 7, costsPct: 25, note: "Сезонная аренда" },
  "almaty-capital": { key: "almaty-capital", label: "Алматы", grossYieldPct: 7, appreciationPct: 6, costsPct: 20 },
  "batumi-sea": { key: "batumi-sea", label: "Батуми", grossYieldPct: 9, appreciationPct: 7, costsPct: 30, note: "Апарт-отельное управление" },
};

export const DEFAULT_ASSUMPTION: InvestAssumption = {
  key: "default",
  label: "Средняя оценка",
  grossYieldPct: 8,
  appreciationPct: 6,
  costsPct: 22,
};

export function assumptionFor(opts: { district?: string; abroadId?: string }): InvestAssumption {
  if (opts.abroadId && abroadAssumptions[opts.abroadId]) return abroadAssumptions[opts.abroadId];
  if (opts.district && districtAssumptions[opts.district]) return districtAssumptions[opts.district];
  return DEFAULT_ASSUMPTION;
}
