import { Price } from "@/components/Price";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { priceHistory, daysOnMarket, REF_DATE } from "@/lib/priceHistory";
import { cn, formatPrice, pluralize } from "@/lib/utils";
import type { Property } from "@/lib/types";

const MONTHS_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** «5 июля 2026» — дата по-русски, родительный падеж месяца. */
function ruDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * История цены объекта: строка статуса («N дней в продаже» + бейдж снижения)
 * и мини-график цены (SVG-ступени) с первоначальной и текущей ценой.
 * Серверный компонент (данные детерминированы для SSG).
 */
export function PriceHistory({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const { events, reduced, reducedPct } = priceHistory(property);
  const dom = daysOnMarket(property);
  const domLabel = `${dom} ${pluralize(dom, ["день", "дня", "дней"])} в продаже`;
  const multi = events.length > 1;

  // Геометрия мини-графика (ступенчатая линия по событиям цены).
  const W = 320;
  const H = 116;
  const padL = 8;
  const padR = 8;
  const padT = 18;
  const padB = 16;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  let stepPath = "";
  let areaPath = "";
  let dots: { x: number; y: number }[] = [];

  if (multi) {
    const t0 = new Date(events[0].date).getTime();
    const span = Math.max(1, REF_DATE.getTime() - t0);
    const xOf = (iso: string) => {
      const t = (new Date(iso).getTime() - t0) / span;
      return padL + Math.min(1, Math.max(0, t)) * innerW;
    };
    const prices = events.map((e) => e.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || max * 0.1 || 1;
    const lo = min - range * 0.3;
    const hi = max + range * 0.3;
    const yOf = (p: number) => padT + (1 - (p - lo) / (hi - lo)) * innerH;

    const pts = events.map((e) => ({ x: xOf(e.date), y: yOf(e.price) }));
    dots = pts;
    const xNow = padL + innerW;
    const base = padT + innerH;

    // Ступени: цена держится до следующего события, затем меняется.
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x.toFixed(1)} ${pts[i - 1].y.toFixed(1)}`;
      d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
    }
    d += ` L ${xNow.toFixed(1)} ${pts[pts.length - 1].y.toFixed(1)}`; // хвост до «сегодня»
    stepPath = d;
    areaPath = `${d} L ${xNow.toFixed(1)} ${base} L ${pts[0].x.toFixed(1)} ${base} Z`;
  }

  const first = events[0];
  const last = events[events.length - 1];
  const gradId = `ph-grad-${property.slug}`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <Icon name="trending" size={18} className="text-gold" />
          <h3 className="font-display text-lg text-text">История цены</h3>
        </div>
        {reduced && <Badge tone="emerald">↓ снижено на {reducedPct}%</Badge>}
      </div>

      <p className="mt-1.5 text-sm text-text-muted">{domLabel}</p>

      {multi ? (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-4 h-auto w-full text-gold"
            role="img"
            aria-label={`Цена снизилась с ${formatPrice(first.price)} до ${formatPrice(last.price)}`}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
            <path
              d={stepPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {dots.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={6} fill="currentColor" opacity={0.15} />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill="currentColor"
                  stroke="var(--surface, #fff)"
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </svg>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-text-muted">
                Начальная
              </div>
              <div className="mt-0.5 font-display text-lg text-text-soft line-through decoration-line decoration-1">
                {formatPrice(first.price)}
              </div>
              <div className="text-xs text-text-muted">{ruDate(first.date)}</div>
            </div>
            <Icon name="arrow-right" size={16} className="mb-6 text-text-muted" />
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wide text-text-muted">
                Сейчас
              </div>
              <div className="mt-0.5 font-display text-lg text-gold">
                <Price usd={last.price} />
              </div>
              <div className="text-xs text-text-muted">{ruDate(last.date)}</div>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-sm text-text-soft">
          <Icon name="check-circle" size={16} className="text-emerald" />
          Цена не менялась с {ruDate(first.date)}
        </p>
      )}
    </div>
  );
}
