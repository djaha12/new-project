import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Слияние Tailwind-классов без конфликтов. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** $ 125 000 — тонкий неразрывный пробел как разделитель тысяч. */
export function formatPrice(usd: number): string {
  return "$ " + usd.toLocaleString("ru-RU").replace(/,/g, " ");
}

/** 125 000 сом */
export function formatSom(som: number): string {
  return som.toLocaleString("ru-RU").replace(/,/g, " ") + " сом";
}

/** Площадь: 4.5 сот. / 82 м² */
export function formatArea(value: number, unit: "m2" | "sotka"): string {
  const num = value.toLocaleString("ru-RU");
  return unit === "m2" ? `${num} м²` : `${num} сот.`;
}

/** Цена за единицу площади, компактно. */
export function pricePerUnit(usd: number, area: number, unit: "m2" | "sotka"): string {
  if (!area) return "—";
  const per = Math.round(usd / area);
  return `${formatPrice(per)} / ${unit === "m2" ? "м²" : "сотка"}`;
}

/** Русская плюрализация: pluralize(3, ['объект','объекта','объектов']) → 'объекта' */
export function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

/** Детерминированный «хэш» строки → число (для стабильных градиентов/аватаров). */
export function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Инициалы из ФИО: «Азамат Осмонов» → «АО» */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
