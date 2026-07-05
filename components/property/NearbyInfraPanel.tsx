"use client";

import { useState } from "react";
import type { NearbyResult } from "@/lib/poi";
import { cn } from "@/lib/utils";
import { NearbyInfra } from "@/components/property/NearbyInfra";

type RadiusKey = "1000" | "1500" | "3000";

const OPTIONS: { key: RadiusKey; label: string }[] = [
  { key: "1000", label: "1 км" },
  { key: "1500", label: "1,5 км" },
  { key: "3000", label: "3 км" },
];

/**
 * Инфраструктура «Что рядом» с переключателем радиуса (1 / 1,5 / 3 км).
 * Наборы данных для каждого радиуса считаются на сервере (SSG) и приходят
 * пропсами — poi.json в клиент не попадает.
 */
export function NearbyInfraPanel({
  sets,
}: {
  sets: Partial<Record<RadiusKey, NearbyResult | null>>;
}) {
  const available = OPTIONS.filter((o) => sets[o.key]);
  const [radius, setRadius] = useState<RadiusKey>(
    sets["1500"] ? "1500" : (available[0]?.key ?? "1500"),
  );
  const data = sets[radius];
  if (!data) return null;

  const toggle = (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5">
      {available.map((o) => (
        <button
          key={o.key}
          onClick={() => setRadius(o.key)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            radius === o.key
              ? "bg-ink text-text-invert"
              : "text-text-soft hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return <NearbyInfra data={data} control={toggle} />;
}
