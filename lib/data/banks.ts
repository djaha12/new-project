/**
 * Ипотечные программы банков Кыргызстана (демо-справочник, ставки ориентировочные).
 * Реальная преквалификация через API банков — задача tier3.
 */
export interface MortgageProgram {
  id: string;
  bank: string;
  program: string;
  ratePct: number; // годовая ставка, %
  minDownPct: number; // мин. первоначальный взнос, %
  maxTermYears: number;
  note?: string;
  highlight?: boolean;
}

export const mortgagePrograms: MortgageProgram[] = [
  {
    id: "gov-affordable",
    bank: "Госипотека",
    program: "«Доступное жильё»",
    ratePct: 10,
    minDownPct: 10,
    maxTermYears: 20,
    note: "Господдержка, льготная ставка для отдельных категорий",
    highlight: true,
  },
  {
    id: "ailbank",
    bank: "Айыл Банк",
    program: "Ипотека на жильё",
    ratePct: 14,
    minDownPct: 20,
    maxTermYears: 15,
  },
  {
    id: "rsk",
    bank: "РСК Банк",
    program: "Жилищный кредит",
    ratePct: 15,
    minDownPct: 20,
    maxTermYears: 15,
  },
  {
    id: "optima",
    bank: "Оптима Банк",
    program: "Ипотека Комфорт",
    ratePct: 17,
    minDownPct: 25,
    maxTermYears: 12,
  },
  {
    id: "demir",
    bank: "Демир Банк",
    program: "Ипотечный кредит",
    ratePct: 18,
    minDownPct: 30,
    maxTermYears: 10,
  },
  {
    id: "islamic",
    bank: "Исламское финансирование",
    program: "Мурабаха / Иджара",
    ratePct: 16,
    minDownPct: 25,
    maxTermYears: 12,
    note: "Без процентов в классическом смысле — наценка/аренда по нормам шариата",
  },
];

/** Аннуитетный платёж в месяц (USD). principal — сумма кредита, годовая ставка %, срок в годах. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}
