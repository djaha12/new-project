"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { fmtMoney, useCurrency, type Currency } from "@/lib/currency";
import { assumptionFor } from "@/lib/data/investAssumptions";
import { cn, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

/**
 * Инвест-калькулятор доходности объекта. Префилл ориентиров берётся из
 * assumptionFor({district, abroadId}) — валовая доходность, рост стоимости,
 * издержки. Все поля можно менять. Считает валовую/чистую доходность,
 * денежный поток, окупаемость, суммарный возврат за горизонт и cash-on-cash,
 * плюс SVG-проекцию роста капитала. Самодостаточен: годится и в карточке
 * объекта, и на странице зарубежного направления.
 *
 * Демо-оценка для ориентира — не гарантия доходности.
 */
export function InvestmentCalculator({
  priceUsd,
  district,
  abroadId,
}: {
  priceUsd: number;
  district?: string;
  abroadId?: string;
}) {
  const { currency, rate } = useCurrency();
  const assumption = useMemo(
    () => assumptionFor({ district, abroadId }),
    [district, abroadId],
  );

  // Стартовые значения полей (canonical — в USD).
  const [price, setPrice] = useState(Math.max(0, Math.round(priceUsd)));
  const [monthlyRent, setMonthlyRent] = useState(
    Math.round((priceUsd * assumption.grossYieldPct) / 100 / 12),
  );
  const [apprPct, setApprPct] = useState(assumption.appreciationPct);
  const [costsPct, setCostsPct] = useState(assumption.costsPct);
  const [years, setYears] = useState(10);

  const money = (usd: number) => fmtMoney(usd, currency, rate);

  const m = useMemo(() => {
    const p = Math.max(0, price);
    const yrs = Math.min(40, Math.max(1, Math.round(years)));
    const annualGross = Math.max(0, monthlyRent) * 12;
    const netAnnual = annualGross * (1 - Math.max(0, costsPct) / 100);
    const grossYield = p > 0 ? (annualGross / p) * 100 : 0;
    const netYield = p > 0 ? (netAnnual / p) * 100 : 0;
    const payback = netAnnual > 0 ? p / netAnnual : Infinity;

    // Проекция капитала по годам: стоимость объекта (рост) + накопленная аренда.
    const points = Array.from({ length: yrs + 1 }, (_, t) => {
      const propVal = p * Math.pow(1 + Math.max(0, apprPct) / 100, t);
      const rentAcc = netAnnual * t;
      return { t, propVal, total: propVal + rentAcc };
    });

    const propValEnd = points[yrs].propVal;
    const capitalGain = propValEnd - p;
    const rentTotal = netAnnual * yrs;
    const totalReturn = rentTotal + capitalGain;
    const totalReturnPct = p > 0 ? (totalReturn / p) * 100 : 0;
    const cashOnCash = p > 0 && yrs > 0 ? totalReturnPct / yrs : 0;

    return {
      p,
      yrs,
      netAnnual,
      grossYield,
      netYield,
      payback,
      points,
      propValEnd,
      rentTotal,
      totalReturn,
      totalReturnPct,
      cashOnCash,
    };
  }, [price, monthlyRent, apprPct, costsPct, years]);

  const yearsWord = (n: number) => pluralize(n, ["год", "года", "лет"]);

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
      {/* Шапка */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-gold-bright">
            <Icon name="trending" size={19} />
          </span>
          <div>
            <div className="text-sm font-semibold text-text sm:text-base">
              Инвест-калькулятор
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
              Прогноз доходности и роста капитала. Значения можно менять под свой сценарий.
            </p>
          </div>
        </div>
        {abroadId && (
          <Badge tone="gold" icon="globe">
            {assumption.label}
          </Badge>
        )}
      </div>

      {assumption.note && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl bg-surface-2 px-3.5 py-2.5 text-xs leading-relaxed text-text-soft">
          <Icon name="sparkles" size={14} className="mt-0.5 shrink-0 text-gold" />
          <span>
            <span className="font-semibold text-text">{assumption.label}.</span>{" "}
            {assumption.note}
          </span>
        </div>
      )}

      {/* Поля ввода */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyInput
          label="Цена объекта"
          usd={price}
          onUsd={setPrice}
          step={1000}
          currency={currency}
          rate={rate}
        />
        <MoneyInput
          label="Аренда в месяц"
          usd={monthlyRent}
          onUsd={setMonthlyRent}
          step={50}
          currency={currency}
          rate={rate}
          hint="ожидаемый доход"
        />
        <SliderRow
          label="Рост стоимости"
          value={apprPct}
          onChange={setApprPct}
          min={0}
          max={15}
          step={0.5}
          suffix="% / год"
          accent="emerald"
        />
        <SliderRow
          label="Издержки"
          value={costsPct}
          onChange={setCostsPct}
          min={0}
          max={50}
          step={1}
          suffix="% от аренды"
          accent="gold"
          hint="управление, простои, налоги"
        />
        <SliderRow
          label="Горизонт"
          value={years}
          onChange={(v) => setYears(Math.round(v))}
          min={1}
          max={30}
          step={1}
          readout={`${Math.round(years)} ${yearsWord(Math.round(years))}`}
          accent="gold"
          className="sm:col-span-2"
        />
      </div>

      {/* Метрики */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat label="Валовая доходность" value={`${dec(m.grossYield)}%`} note="аренда к цене" />
        <Stat
          label="Чистая доходность"
          value={`${dec(m.netYield)}%`}
          note="после издержек"
          tone="emerald"
        />
        <Stat label="Денежный поток" value={money(m.netAnnual)} note="чистыми в год" />
        <Stat
          label="Окупаемость"
          value={
            isFinite(m.payback)
              ? `${dec(m.payback)} ${yearsWord(Math.round(m.payback))}`
              : "—"
          }
          note="за счёт аренды"
        />
        <Stat
          label="Возврат за горизонт"
          value={money(m.totalReturn)}
          note={`за ${m.yrs} ${yearsWord(m.yrs)} · +${dec(m.totalReturnPct, 0)}%`}
          tone="gold"
        />
        <Stat
          label="Cash-on-cash"
          value={`${dec(m.cashOnCash)}%`}
          note="в среднем в год"
          tone="gold"
        />
      </div>

      {/* Проекция капитала */}
      <div className="mt-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="eyebrow">Проекция капитала</div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold" />
              Капитал
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-bright" />
              Стоимость объекта
            </span>
          </div>
        </div>

        <ProjectionChart points={m.points} basePrice={m.p} years={m.yrs} money={money} />

        <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-text-soft">
          <span>
            Через {m.yrs} {yearsWord(m.yrs)} капитал ≈{" "}
            <span className="font-semibold text-text">{money(m.totalReturn + m.p)}</span>
          </span>
          <span className="text-text-muted">
            объект {money(m.propValEnd)} · аренда {money(m.rentTotal)}
          </span>
        </div>
      </div>

      <p className="mt-5 border-t border-line pt-3 text-[11px] leading-relaxed text-text-muted">
        Демо-оценка на основе ориентиров MULK по локации — для сравнения сценариев,
        не гарантия доходности. Точные цифры уточнит ваш брокер.
      </p>
    </div>
  );
}

/* ─── Проекция (SVG, без библиотек) ─────────────────────────────────── */

function ProjectionChart({
  points,
  basePrice,
  years,
  money,
}: {
  points: { t: number; propVal: number; total: number }[];
  basePrice: number;
  years: number;
  money: (usd: number) => string;
}) {
  const gradId = useId().replace(/:/g, "");
  const W = 640;
  const H = 200;
  const pl = 6;
  const pr = 6;
  const pt = 16;
  const pb = 8;
  const chartW = W - pl - pr;
  const chartH = H - pt - pb;

  const maxTotal = points[points.length - 1]?.total ?? basePrice;
  const maxY = Math.max(maxTotal, basePrice, 1) * 1.08;

  const X = (t: number) => pl + (years > 0 ? t / years : 0) * chartW;
  const Y = (v: number) => pt + (1 - v / maxY) * chartH;

  const linePath = (key: "propVal" | "total") =>
    points
      .map((p, i) => `${i ? "L" : "M"}${X(p.t).toFixed(1)} ${Y(p[key]).toFixed(1)}`)
      .join(" ");

  const areaPath = `${linePath("total")} L${X(years).toFixed(1)} ${Y(0).toFixed(1)} L${X(0).toFixed(1)} ${Y(0).toFixed(1)} Z`;

  const last = points[points.length - 1];

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="График роста капитала по годам"
      >
        <defs>
          <linearGradient id={`grad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B98B3E" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#B98B3E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Базовая линия «вложено» */}
        <line
          x1={pl}
          x2={W - pr}
          y1={Y(basePrice)}
          y2={Y(basePrice)}
          stroke="#D6CFC2"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <text x={pl + 2} y={Y(basePrice) - 5} fill="#828892" fontSize="11">
          вложено {money(basePrice)}
        </text>

        {/* Область под капиталом */}
        <path d={areaPath} fill={`url(#grad-${gradId})`} />

        {/* Стоимость объекта (рост цены) */}
        <path
          d={linePath("propVal")}
          fill="none"
          stroke="#2E8C73"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Совокупный капитал (объект + аренда) */}
        <path
          d={linePath("total")}
          fill="none"
          stroke="#B98B3E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {last && (
          <>
            <circle cx={X(last.t)} cy={Y(last.propVal)} r="3" fill="#2E8C73" />
            <circle cx={X(last.t)} cy={Y(last.total)} r="3.5" fill="#B98B3E" />
          </>
        )}
      </svg>

      {/* Ось времени */}
      <div className="mt-1 flex justify-between text-[11px] font-medium text-text-muted">
        <span>Сейчас</span>
        <span>
          {Math.round(years / 2)} {pluralize(Math.round(years / 2), ["год", "года", "лет"])}
        </span>
        <span>
          {years} {pluralize(years, ["год", "года", "лет"])}
        </span>
      </div>
    </div>
  );
}

/* ─── Поля ───────────────────────────────────────────────────────────── */

function MoneyInput({
  label,
  usd,
  onUsd,
  step,
  currency,
  rate,
  hint,
}: {
  label: string;
  usd: number;
  onUsd: (v: number) => void;
  step: number;
  currency: Currency;
  rate: number;
  hint?: string;
}) {
  const unit = currency === "USD" ? "$" : "сом";
  const display = currency === "USD" ? Math.round(usd) : Math.round(usd * rate);

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-text-soft">{label}</span>
        {hint && <span className="text-[11px] text-text-muted">{hint}</span>}
      </span>
      <span className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-2.5 transition-colors focus-within:border-gold focus-within:bg-surface">
        <span className="text-sm font-semibold text-text-muted">{unit}</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={step}
          value={display}
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : Number(e.target.value);
            if (Number.isNaN(val)) return;
            onUsd(currency === "USD" ? val : val / rate);
          }}
          aria-label={label}
          className="w-full min-w-0 bg-transparent text-sm font-semibold tabular-nums text-text outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </span>
    </label>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  readout,
  accent = "gold",
  hint,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  readout?: string;
  accent?: "gold" | "emerald";
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("block", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-text-soft">
          {label}
          {hint && <span className="ml-1.5 font-normal text-text-muted">· {hint}</span>}
        </span>
        <span className="text-sm font-semibold tabular-nums text-text">
          {readout ?? (
            <>
              {dec(value)}
              {suffix && <span className="ml-0.5 text-xs font-medium text-text-muted">{suffix}</span>}
            </>
          )}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-3",
          accent === "emerald" ? "accent-emerald" : "accent-gold",
        )}
      />
    </div>
  );
}

/* ─── Метрика ─────────────────────────────────────────────────────────── */

function Stat({
  label,
  value,
  note,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  note?: string;
  tone?: "neutral" | "gold" | "emerald";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3.5",
        tone === "gold" && "border-gold/20 bg-gold-wash",
        tone === "emerald" && "border-emerald/20 bg-emerald-soft",
        tone === "neutral" && "border-line bg-surface-2",
      )}
    >
      <div className="text-[11px] font-medium leading-tight text-text-muted">{label}</div>
      <div
        className={cn(
          "mt-1.5 font-display text-lg leading-none tabular-nums sm:text-xl",
          tone === "gold" && "text-gold",
          tone === "emerald" && "text-emerald",
          tone === "neutral" && "text-text",
        )}
      >
        {value}
      </div>
      {note && <div className="mt-1 text-[11px] leading-tight text-text-muted">{note}</div>}
    </div>
  );
}

/** Число с запятой-разделителем дробной части (ru). */
function dec(n: number, digits = 1): string {
  if (!isFinite(n)) return "—";
  return n.toFixed(digits).replace(".", ",");
}
