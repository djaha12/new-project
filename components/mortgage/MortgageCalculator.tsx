"use client";

import { useState } from "react";
import { cn, pluralize } from "@/lib/utils";
import { fmtMoney, useCurrency, type Currency } from "@/lib/currency";
import { mortgagePrograms, monthlyPayment, type MortgageProgram } from "@/lib/data/banks";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/LeadForm";

/**
 * Ипотечный калькулятор MULK.
 * Два режима: «Платёж» (сколько платить в месяц за конкретный объект) и
 * «Сколько потяну» (макс. цена объекта под ваш доход). Все расчёты в USD —
 * базовой валюте платформы; вывод сумм — в выбранной валюте + вторая мелким
 * шрифтом (уважает переключатель валют). Программы банков КР одним кликом
 * подставляют свою ставку/взнос/срок.
 *
 * compact — версия для сайдбара: только режим «Платёж», без карточек банков.
 */

type Tab = "payment" | "afford";

/** Обратная к monthlyPayment: макс. тело кредита из посильного платежа/мес. */
function maxLoanFromPayment(monthly: number, annualRatePct: number, years: number): number {
  if (monthly <= 0 || years <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return (monthly * (1 - Math.pow(1 + r, -n))) / r;
}

/** Безопасный парсинг пользовательского ввода в неотрицательное число. */
function toNum(v: string): number {
  const n = parseFloat(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function MortgageCalculator({
  priceUsd,
  compact = false,
  className,
}: {
  priceUsd: number;
  compact?: boolean;
  className?: string;
}) {
  const { currency, rate } = useCurrency();
  const other: Currency = currency === "USD" ? "KGS" : "USD";

  const [tab, setTab] = useState<Tab>("payment");
  // Ввод цены/дохода держим строкой — свободный ввод (можно очистить, печатать частями).
  const [priceStr, setPriceStr] = useState(String(Math.round(priceUsd)));
  const [incomeStr, setIncomeStr] = useState("1500");
  // Общие параметры кредита (их же подставляют программы банков).
  const [downPct, setDownPct] = useState(20);
  const [ratePct, setRatePct] = useState(14);
  const [years, setYears] = useState(15);
  const [dtiPct, setDtiPct] = useState(40);
  const [programId, setProgramId] = useState<string | null>(null);

  const price = toNum(priceStr);
  const income = toNum(incomeStr);

  // Ручная правка параметров сбрасывает «выбранную программу».
  const editDown = (v: number) => { setDownPct(v); setProgramId(null); };
  const editRate = (v: number) => { setRatePct(v); setProgramId(null); };
  const editTerm = (v: number) => { setYears(v); setProgramId(null); };
  const applyProgram = (p: MortgageProgram) => {
    setRatePct(p.ratePct);
    setDownPct(p.minDownPct);
    setYears(Math.min(25, Math.max(5, p.maxTermYears)));
    setProgramId(p.id);
  };

  // ── Режим «Платёж» ──────────────────────────────────────────────────────
  const downAmount = (price * downPct) / 100;
  const principal = Math.max(0, price - downAmount);
  const monthly = monthlyPayment(principal, ratePct, years);
  const totalPaid = monthly * years * 12;
  const overpay = Math.max(0, totalPaid - principal);

  // ── Режим «Сколько потяну» ──────────────────────────────────────────────
  const affMonthly = (income * dtiPct) / 100;
  const affLoan = maxLoanFromPayment(affMonthly, ratePct, years);
  const denom = 1 - downPct / 100;
  const affPrice = denom > 0 ? affLoan / denom : affLoan;
  const affDown = affPrice * (downPct / 100);

  const ctaMonthly = tab === "payment" ? monthly : affMonthly;
  const ctaContext = `Ипотека · платёж ${fmtMoney(Math.round(ctaMonthly), currency, rate)}/мес`;

  const yearsWord = pluralize(years, ["год", "года", "лет"]);

  // ── Мелкие переиспользуемые куски разметки ──────────────────────────────
  const fieldCls =
    "h-11 w-full rounded-xl border border-line bg-surface pl-4 pr-9 text-sm text-text outline-none transition-colors focus:border-gold placeholder:text-text-muted tabular-nums";

  /** Поле суммы в $ с подсказкой «≈ … сом». */
  function MoneyField({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-soft">{label}</label>
        <div className="relative">
          <input
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={fieldCls}
          />
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
            $
          </span>
        </div>
        <div className="mt-1 text-[11px] text-text-muted">
          ≈ {fmtMoney(toNum(value), "KGS", rate)}
        </div>
      </div>
    );
  }

  /** Слайдер с подписью и правым «читателем» значения. accent-gold. */
  function SliderRow({
    label,
    readout,
    min,
    max,
    step = 1,
    value,
    onChange,
  }: {
    label: string;
    readout: React.ReactNode;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (v: number) => void;
  }) {
    return (
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label className="text-sm font-medium text-text-soft">{label}</label>
          <span className="text-sm font-semibold text-text tabular-nums">{readout}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-2 w-full cursor-pointer accent-gold"
        />
      </div>
    );
  }

  /** Строка результата на тёмной панели: значение в обеих валютах. */
  function DarkRow({ label, usd }: { label: string; usd: number }) {
    const v = Math.max(0, Math.round(usd));
    return (
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-white/55">{label}</span>
        <span className="text-right font-medium tabular-nums text-text-invert">
          {fmtMoney(v, currency, rate)}
          <span className="ml-1.5 text-[11px] font-normal text-white/40">
            ≈ {fmtMoney(v, other, rate)}
          </span>
        </span>
      </div>
    );
  }

  /** Тёмная панель итога с крупным заглавным числом. */
  function ResultPanel({
    headline,
    headUsd,
    headSuffix,
    rows,
  }: {
    headline: string;
    headUsd: number;
    headSuffix?: string;
    rows: { label: string; usd: number }[];
  }) {
    const v = Math.max(0, Math.round(headUsd));
    return (
      <div className="rounded-2xl bg-ink p-5 text-text-invert shadow-soft">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-bright">
          {headline}
        </div>
        <div className="mt-1.5 font-display text-[2rem] leading-none text-text-invert">
          {fmtMoney(v, currency, rate)}
          {headSuffix && <span className="text-lg text-white/60"> {headSuffix}</span>}
        </div>
        <div className="mt-1 text-xs text-white/45">
          ≈ {fmtMoney(v, other, rate)}
          {headSuffix ? ` ${headSuffix}` : ""}
        </div>
        <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
          {rows.map((r) => (
            <DarkRow key={r.label} label={r.label} usd={r.usd} />
          ))}
        </div>
      </div>
    );
  }

  // Общие поля кредита (взнос / ставка / срок) — используются в обоих режимах.
  const loanControls = (
    <>
      <SliderRow
        label="Первоначальный взнос"
        readout={`${downPct}% · ${fmtMoney(Math.round((tab === "payment" ? price : affPrice) * downPct / 100), currency, rate)}`}
        min={0}
        max={90}
        value={downPct}
        onChange={editDown}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-soft">Ставка, % годовых</label>
        <input
          type="number"
          min={0}
          max={40}
          step={0.5}
          value={ratePct}
          onChange={(e) => editRate(toNum(e.target.value))}
          className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-text outline-none transition-colors focus:border-gold tabular-nums"
        />
      </div>
      <SliderRow
        label="Срок кредита"
        readout={`${years} ${yearsWord}`}
        min={5}
        max={25}
        value={years}
        onChange={editTerm}
      />
    </>
  );

  const paymentBody = (
    <div className={cn("grid gap-5", !compact && "lg:grid-cols-[1.05fr_1fr]")}>
      <div className="space-y-4">
        <MoneyField label="Цена объекта" value={priceStr} onChange={(v) => { setPriceStr(v); }} />
        {loanControls}
      </div>
      <ResultPanel
        headline="Платёж в месяц"
        headUsd={monthly}
        headSuffix="/ мес"
        rows={[
          { label: "Сумма кредита", usd: principal },
          { label: "Первоначальный взнос", usd: downAmount },
          { label: "Переплата за срок", usd: overpay },
          { label: "Общая выплата", usd: totalPaid },
        ]}
      />
    </div>
  );

  const affordBody = (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
      <div className="space-y-4">
        <MoneyField label="Доход в месяц" value={incomeStr} onChange={setIncomeStr} />
        <SliderRow
          label="Платёж от дохода"
          readout={`${dtiPct}% · ${fmtMoney(Math.round(affMonthly), currency, rate)}`}
          min={30}
          max={45}
          value={dtiPct}
          onChange={setDtiPct}
        />
        {loanControls}
      </div>
      <ResultPanel
        headline="Макс. цена объекта"
        headUsd={affPrice}
        rows={[
          { label: "Сумма кредита", usd: affLoan },
          { label: "Нужен взнос", usd: affDown },
          { label: "Платёж в месяц", usd: affMonthly },
        ]}
      />
    </div>
  );

  return (
    <div
      className={cn(
        "rounded-3xl border border-line bg-surface-2 p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      {/* Заголовок */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-wash text-gold">
          <Icon name="landmark" size={18} />
        </span>
        <div>
          <div className="font-display text-lg leading-tight text-text">Ипотечный калькулятор</div>
          {!compact && (
            <div className="text-xs text-text-muted">Платёж, переплата и «сколько потяну» — по банкам КР</div>
          )}
        </div>
      </div>

      {/* Табы (в compact — только «Платёж») */}
      {!compact && (
        <div className="mt-4 inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5">
          {([
            { key: "payment" as Tab, label: "Платёж" },
            { key: "afford" as Tab, label: "Сколько потяну" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                tab === t.key ? "bg-ink text-text-invert" : "text-text-soft hover:text-text",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Тело */}
      <div className="mt-5">{compact || tab === "payment" ? paymentBody : affordBody}</div>

      {/* Программы банков КР (не в compact) */}
      {!compact && (
        <div className="mt-7 border-t border-line pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="eyebrow">Программы банков КР</div>
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <Icon name="wand" size={13} className="text-gold" />
              Нажмите — подставим ставку, взнос и срок
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {mortgagePrograms.map((p) => {
              const active = programId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => applyProgram(p)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    p.highlight ? "border-gold/50 bg-gold-wash/50" : "border-line bg-surface hover:border-line-strong hover:shadow-soft",
                    active && "border-gold shadow-glow ring-1 ring-gold",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-text">{p.bank}</div>
                      <div className="mt-0.5 text-sm text-text-soft">{p.program}</div>
                    </div>
                    {p.highlight ? (
                      <Badge tone="gold" icon="sparkles">Господдержка</Badge>
                    ) : active ? (
                      <Badge tone="emerald" icon="check">Выбрано</Badge>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-soft">
                    <span><b className="text-text tabular-nums">{p.ratePct}%</b> ставка</span>
                    <span>от <b className="text-text tabular-nums">{p.minDownPct}%</b> взнос</span>
                    <span>до <b className="text-text tabular-nums">{p.maxTermYears}</b> {pluralize(p.maxTermYears, ["год", "года", "лет"])}</span>
                  </div>
                  {p.note && (
                    <div className="mt-2 text-[11px] leading-snug text-text-muted">{p.note}</div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-text-muted">
            Ставки ориентировочные и зависят от банка, категории заёмщика и первоначального взноса.
            Точные условия и одобрение — через брокера MULK.
          </p>
        </div>
      )}

      {/* CTA */}
      {compact ? (
        <div className="mt-5">
          <Button href="/sell" variant="primary" className="w-full" iconRight="arrow-right">
            Подобрать ипотеку
          </Button>
          <p className="mt-2 text-center text-[11px] text-text-muted">{ctaContext}</p>
        </div>
      ) : (
        <div className="mt-7 border-t border-line pt-6">
          <LeadForm
            title="Подобрать ипотеку"
            subtitle="Брокер MULK сравнит банки и подберёт программу с лучшей ставкой под ваш профиль."
            cta="Получить расчёт от брокера"
            context={ctaContext}
          />
        </div>
      )}
    </div>
  );
}
