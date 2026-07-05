import Link from "next/link";
import {
  CATEGORY_LABELS,
  TIER_LABELS,
  type Property,
} from "@/lib/types";
import { cn, formatArea, pluralize } from "@/lib/utils";
import { getBroker } from "@/lib/data/brokers";
import nearbyCounts from "@/lib/data/nearbyCounts.json";
import { monthlyPayment } from "@/lib/data/banks";
import { priceHistory } from "@/lib/priceHistory";
import { PropertyMedia } from "@/components/PropertyMedia";
import { Price } from "@/components/Price";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_ICON } from "@/components/ui/category";

export function PropertyCard({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const p = property;
  const broker = getBroker(p.brokerId);
  const href = `/property/${p.slug}`;
  const isElite = p.tier === "elite" || p.tier === "premium";

  const meta: string[] = [];
  if (p.rooms) meta.push(`${p.rooms}-комн.`);
  meta.push(formatArea(p.area, p.areaUnit));
  if (p.floor && p.floors) meta.push(`${p.floor}/${p.floors} эт.`);
  if (p.category === "house" && p.landArea) meta.push(`уч. ${p.landArea} сот.`);

  // Кол-во мест 2ГИС в радиусе 1,5 км (предвычислено; 0 у загородных объектов).
  const nearbyN = (nearbyCounts as Record<string, number>)[p.id] ?? 0;

  const ph = priceHistory(p);
  // Ориентир ипотеки (кредит 80%, 14%, 15 лет) — для жилья.
  const showMortgage = p.category === "apartment" || p.category === "house" || p.category === "room";
  const monthly = showMortgage ? monthlyPayment(p.price * 0.8, 14, 15) : 0;

  return (
    // Паттерн «stretched link»: карточка — div, навигация — оверлей-ссылка,
    // интерактив (звезда) — сиблинг выше по z. Так <button> не вложен в <a>.
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link href={href} aria-label={p.title} className="absolute inset-0 z-[1]" />
      <PropertyMedia tone={p.mediaTone} category={p.category} className="aspect-[4/3]">
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            {p.badge && <Badge tone="glass">{p.badge}</Badge>}
            {isElite && (
              <Badge tone="glass" icon="sparkles">
                {TIER_LABELS[p.tier]}
              </Badge>
            )}
            {ph.reduced && (
              <Badge tone="emerald" icon="trending">
                ↓ {ph.reducedPct}%
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {p.videoSec && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
                <Icon name="play" size={11} />
                {p.videoSec}с
              </span>
            )}
            <FavoriteButton slug={p.slug} className="relative z-[2] bg-white/90 shadow-soft backdrop-blur" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-sm font-semibold text-ink shadow-soft">
            <Price usd={p.price} />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Icon name={CATEGORY_ICON[p.category]} size={12} />
            {CATEGORY_LABELS[p.category]}
          </span>
        </div>
      </PropertyMedia>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-soft px-1.5 py-0.5 text-[11px] font-semibold text-emerald">
            <Icon name="shield" size={11} />
            {p.aiScore.overall.toFixed(1)}
          </span>
          <span className="truncate text-xs text-text-muted">
            <Icon name="map-pin" size={11} className="mr-0.5 inline align-[-2px]" />
            {p.district}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-text transition-colors group-hover:text-gold">
          {p.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-text-soft">
          {p.hook}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-soft">
          {meta.map((m) => (
            <span key={m} className="font-medium">
              {m}
            </span>
          ))}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {nearbyN > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-soft px-1.5 py-1 text-[11px] font-medium text-emerald">
              <Icon name="map-pin" size={11} />
              {nearbyN} {pluralize(nearbyN, ["место", "места", "мест"])} рядом
              <span className="text-emerald/70">· 2ГИС</span>
            </span>
          )}
          {showMortgage && monthly > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted">
              <Icon name="landmark" size={11} className="text-gold" />
              ипотека от <Price usd={monthly} className="font-semibold text-text-soft" />/мес
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="truncate text-xs text-text-muted">
            {broker ? broker.name : "Брокер MULK"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">
            Подробнее
            <Icon name="arrow-right" size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
