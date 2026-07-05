import type { ReactNode } from "react";
import type { NearbyResult } from "@/lib/poi";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";

function fmtDist(m: number): string {
  if (m < 950) return `${m} м`;
  return `${(m / 1000).toFixed(1).replace(".", ",")} км`;
}

/** «Что рядом» — реальная инфраструктура по данным 2ГИС. */
export function NearbyInfra({
  data,
  control,
  className,
}: {
  data: NearbyResult;
  control?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("", className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="eyebrow">Инфраструктура рядом</div>
        <div className="flex flex-wrap items-center gap-3">
          {control}
          <Badge tone="emerald" icon="map-pin">
            По данным 2ГИС · {data.total} мест в радиусе {fmtDist(data.radiusM)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.groups.map((g) => (
          <div
            key={g.key}
            className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-wash text-gold">
                <Icon name={g.icon} size={16} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight text-text">{g.label}</div>
                <div className="text-xs text-text-muted">{g.count} рядом</div>
              </div>
            </div>

            <div className="mt-3 border-t border-line pt-3">
              <div className="flex items-start gap-1.5">
                <span className="text-sm leading-none">{g.nearest.emoji}</span>
                <div className="min-w-0">
                  <div className="line-clamp-2 text-xs font-medium leading-snug text-text-soft">
                    {g.nearest.name}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-text-muted">
                    <span className="font-semibold text-emerald">{fmtDist(g.nearest.distM)}</span>
                    <span>· {g.nearest.walkMin} мин пешком</span>
                    {g.nearest.rating != null && (
                      <span className="inline-flex items-center gap-0.5">
                        · <Icon name="star" size={10} className="fill-gold text-gold" />
                        {g.nearest.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
