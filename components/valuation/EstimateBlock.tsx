import { estimateProperty, VERDICT_META } from "@/lib/valuation";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Price } from "@/components/Price";
import { PropertyCard } from "@/components/PropertyCard";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

/**
 * MULK Estimate — блок оценки стоимости на странице объекта (серверный).
 * Через estimateProperty(property) показываем прозрачный диапазон low—base—high,
 * позицию запрашиваемой цены на шкале, вердикт (ниже/в рынке/выше) с дельтой,
 * медианную цену за единицу площади, число сопоставимых и сами comps.
 */
export function EstimateBlock({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const est = estimateProperty(property);
  const unitLabel = est.areaUnit === "m2" ? "м²" : "сотку";
  const verdict = VERDICT_META[est.verdict];

  // Нет сопоставимых объектов — оценку построить нельзя, показываем честно.
  if (!est.compsCount || est.base <= 0) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-line bg-surface-2 p-6 shadow-soft sm:p-7",
          className,
        )}
      >
        <BlockHeading />
        <p className="mt-4 text-sm leading-relaxed text-text-soft">
          Для этого объекта пока недостаточно сопоставимых предложений, чтобы
          построить корректную оценку. Брокер MULK оценит его вручную —
          по сделкам сегмента и характеристикам объекта.
        </p>
      </div>
    );
  }

  // Положение цены и ориентира на шкале low..high (в процентах, с зажимом).
  const span = Math.max(est.high - est.low, 1);
  const pct = (v: number) =>
    Math.min(100, Math.max(0, ((v - est.low) / span) * 100));
  const askPos = pct(est.askingPrice);
  const basePos = pct(est.base);

  // Дельта к рынку: знак сохраняем из deltaPct (напр. «−8%»).
  const deltaLabel =
    est.deltaPct === 0
      ? "точно в рынке"
      : `${est.deltaPct > 0 ? "+" : ""}${est.deltaPct}% ${
          est.verdict === "below"
            ? "ниже рынка"
            : est.verdict === "above"
              ? "выше рынка"
              : "к рынку"
        }`;

  const barTone =
    est.verdict === "below"
      ? "bg-emerald"
      : est.verdict === "above"
        ? "bg-danger"
        : "bg-ink";

  return (
    <div
      className={cn(
        "rounded-3xl border border-line bg-surface-2 p-6 shadow-soft sm:p-7",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <BlockHeading />
        <Badge tone={verdict.tone} icon={est.verdict === "below" ? "trending" : "scale"}>
          {verdict.label}
        </Badge>
      </div>

      {/* Крупный вердикт + дельта */}
      <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Рыночный ориентир
          </div>
          <div className="mt-1 font-display text-[2.1rem] leading-none text-text">
            <Price usd={est.base} />
          </div>
        </div>
        <div
          className={cn(
            "text-sm font-semibold",
            est.verdict === "below"
              ? "text-emerald"
              : est.verdict === "above"
                ? "text-danger"
                : "text-text-soft",
          )}
        >
          Запрашивают <Price usd={est.askingPrice} className="font-bold" /> · {deltaLabel}
        </div>
      </div>

      {/* Шкала диапазона low — base — high с маркером запрашиваемой цены */}
      <div className="mt-7">
        <div className="relative h-2.5 rounded-full bg-surface-3">
          {/* Заливка от low до запрашиваемой цены */}
          <div
            className={cn("absolute inset-y-0 left-0 rounded-full opacity-80", barTone)}
            style={{ width: `${askPos}%` }}
          />
          {/* Ориентир (base) — тонкая засечка */}
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded bg-text-muted"
            style={{ left: `${basePos}%` }}
          />
          {/* Маркер запрашиваемой цены */}
          <div
            className={cn(
              "absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface shadow-lift",
              barTone,
            )}
            style={{ left: `${askPos}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-text-muted">
          <span className="tabular-nums">
            <Price usd={est.low} />
          </span>
          <span className="tabular-nums">
            ориентир <Price usd={est.base} className="font-semibold text-text-soft" />
          </span>
          <span className="tabular-nums">
            <Price usd={est.high} />
          </span>
        </div>
      </div>

      {/* Медиана $/ед. и число сопоставимых */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Медиана по сегменту
          </div>
          <div className="mt-1.5 text-lg font-semibold text-text">
            <Price usd={est.medianUnit} /> <span className="text-sm font-normal text-text-muted">за {unitLabel}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Оценка построена по
          </div>
          <div className="mt-1.5 text-lg font-semibold text-text">
            {est.compsCount} сопоставимым
          </div>
        </div>
      </div>

      {/* Похожие объекты, на которых основана оценка */}
      {est.comps.length > 0 && (
        <div className="mt-8 border-t border-line pt-7">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="scale" size={16} className="text-gold" />
            <h4 className="font-display text-lg text-text">
              Похожие объекты, на которых основана оценка
            </h4>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {est.comps.map((c) => (
              <PropertyCard key={c.id} property={c} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 text-[11px] leading-relaxed text-text-muted">
        Оценка MULK Estimate — ориентир на основе сопоставимых предложений
        каталога, а не заключение сертифицированного оценщика. Точная стоимость
        зависит от состояния, документов и вида объекта; официальную оценку
        готовит оценщик, рыночную цену — брокер MULK.
      </p>
    </div>
  );
}

function BlockHeading() {
  return (
    <div>
      <div className="eyebrow">
        <Icon name="trending" size={14} />
        MULK Estimate
      </div>
      <h3 className="mt-2 font-display text-2xl leading-tight text-text">
        Оценка стоимости MULK
      </h3>
      <p className="mt-1 text-sm text-text-soft">
        Прозрачный расчёт по сопоставимым объектам — не «чёрный ящик»
      </p>
    </div>
  );
}
