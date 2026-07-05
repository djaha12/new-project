"use client";

import { useState, type FormEvent } from "react";
import {
  CATEGORY_LABELS,
  TIER_LABELS,
  type Category,
  type Tier,
} from "@/lib/types";
import { districts } from "@/lib/data/districts";
import { cn } from "@/lib/utils";
import { Price } from "@/components/Price";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/LeadForm";

/**
 * Форма оценки объекта для продавца (клиентский островок).
 * По сабмиту POST /api/estimate → показываем рыночный диапазон, медиану $/ед.
 * и текстовое обоснование (narrative — живое от Claude или шаблон из чисел).
 */

interface EstimateResponse {
  low: number;
  base: number;
  high: number;
  medianUnit: number;
  areaUnit: "m2" | "sotka";
  compsCount: number;
  narrative: string;
  live: boolean;
}

const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS) as Category[];
const TIER_KEYS = Object.keys(TIER_LABELS) as Tier[];

function toNum(v: string): number {
  const n = parseFloat(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function EstimateForm({ className }: { className?: string }) {
  const [category, setCategory] = useState<Category>("apartment");
  const [district, setDistrict] = useState<string>(districts[0]?.name ?? "");
  const [areaStr, setAreaStr] = useState("80");
  const [areaUnit, setAreaUnit] = useState<"m2" | "sotka">("m2");
  const [tier, setTier] = useState<Tier>("standard");
  const [floorStr, setFloorStr] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  // Участки считаем в сотках, остальное — в м²; подсказываем единицу.
  const onCategory = (c: Category) => {
    setCategory(c);
    setAreaUnit(c === "land" ? "sotka" : "m2");
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const area = toNum(areaStr);
    if (area <= 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category,
          district,
          area,
          areaUnit,
          tier,
          floor: floorStr ? toNum(floorStr) : undefined,
        }),
      });
      if (!res.ok) throw new Error("bad");
      const data = (await res.json()) as EstimateResponse;
      setResult(data);
    } catch {
      setError(
        "Не удалось рассчитать оценку. Попробуйте ещё раз или оставьте заявку — брокер оценит вручную.",
      );
    } finally {
      setLoading(false);
    }
  }

  const unitLabel = areaUnit === "m2" ? "м²" : "сотку";
  const selectCls =
    "h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-text outline-none transition-colors focus:border-gold";
  const inputCls =
    "h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-text outline-none transition-colors focus:border-gold placeholder:text-text-muted tabular-nums";

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8", className)}>
      {/* ─────────── Форма ─────────── */}
      <form
        onSubmit={submit}
        className="rounded-3xl border border-line bg-surface-2 p-6 shadow-soft sm:p-7"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-wash text-gold">
            <Icon name="ruler" size={18} />
          </span>
          <div>
            <div className="font-display text-lg leading-tight text-text">
              Параметры объекта
            </div>
            <div className="text-xs text-text-muted">
              Заполните — рассчитаем рыночный диапазон
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Field label="Категория">
            <select
              value={category}
              onChange={(e) => onCategory(e.target.value as Category)}
              className={selectCls}
            >
              {CATEGORY_KEYS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Район">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={selectCls}
            >
              {districts.map((d) => (
                <option key={d.slug} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-[1.4fr_1fr] gap-3">
            <Field label="Площадь">
              <input
                inputMode="decimal"
                value={areaStr}
                onChange={(e) => setAreaStr(e.target.value)}
                placeholder="80"
                className={inputCls}
              />
            </Field>
            <Field label="Единица">
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as "m2" | "sotka")}
                className={selectCls}
              >
                <option value="m2">м²</option>
                <option value="sotka">сотка</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] gap-3">
            <Field label="Уровень объекта">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
                className={selectCls}
              >
                {TIER_KEYS.map((t) => (
                  <option key={t} value={t}>
                    {TIER_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Этаж" hint="необязательно">
              <input
                inputMode="numeric"
                value={floorStr}
                onChange={(e) => setFloorStr(e.target.value)}
                placeholder="—"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="mt-6 w-full"
          disabled={loading}
          iconRight={loading ? undefined : "arrow-right"}
        >
          {loading ? "Считаем…" : "Оценить объект"}
        </Button>
        {error && <p className="mt-3 text-center text-xs text-danger">{error}</p>}
        <p className="mt-3 text-center text-[11px] leading-snug text-text-muted">
          Расчёт по сопоставимым предложениям каталога. Это ориентир, а не
          официальная оценка.
        </p>
      </form>

      {/* ─────────── Результат ─────────── */}
      <div className="flex flex-col gap-5">
        {result ? (
          <>
            <div className="rounded-3xl border border-line bg-ink p-6 text-text-invert shadow-lift sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-bright">
                  Рыночный диапазон
                </div>
                <Badge tone="glass" icon={result.live ? "sparkles" : "wand"}>
                  {result.live ? "AI-обоснование" : "MULK Estimate"}
                </Badge>
              </div>

              <div className="mt-3 font-display text-[2rem] leading-none">
                <Price usd={result.base} />
              </div>
              <div className="mt-2 text-sm text-white/60">
                от <Price usd={result.low} className="font-semibold text-white/80" /> до{" "}
                <Price usd={result.high} className="font-semibold text-white/80" />
              </div>

              <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/45">
                    Медиана по сегменту
                  </div>
                  <div className="mt-1 text-base font-semibold text-text-invert">
                    <Price usd={result.medianUnit} />
                    <span className="ml-1 text-xs font-normal text-white/50">
                      за {unitLabel}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/45">
                    Сопоставимых объектов
                  </div>
                  <div className="mt-1 text-base font-semibold text-text-invert">
                    {result.compsCount}
                  </div>
                </div>
              </div>

              {result.narrative && (
                <p className="mt-5 rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/80">
                  {result.narrative}
                </p>
              )}
            </div>

            <LeadForm
              title="Получить полный отчёт и продать с MULK"
              subtitle="Брокер уточнит цену по состоянию и документам, подготовит отчёт и план продажи."
              cta="Получить отчёт"
              context="Оценка объекта"
            />
          </>
        ) : (
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-wash text-gold">
              <Icon name="trending" size={24} />
            </span>
            <h3 className="mt-4 font-display text-lg text-text">
              Здесь появится оценка
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-soft">
              Заполните параметры объекта слева — покажем рыночный диапазон,
              медиану по сегменту и обоснование расчёта.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-text-soft">
        <span>{label}</span>
        {hint && <span className="text-[11px] font-normal text-text-muted">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
