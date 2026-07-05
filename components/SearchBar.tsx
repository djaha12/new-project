"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_ICON } from "@/components/ui/category";

const TABS: { key: Category; label: string }[] = [
  { key: "apartment", label: "Квартиры" },
  { key: "house", label: "Дома" },
  { key: "land", label: "Участки" },
  { key: "commercial", label: "Коммерция" },
];

/** Главный поиск в hero. Навигация в /catalog с query-параметрами. */
export function SearchBar({ dark = true }: { dark?: boolean }) {
  const router = useRouter();
  const [cat, setCat] = useState<Category>("apartment");
  const [q, setQ] = useState("");

  function submit() {
    const params = new URLSearchParams();
    params.set("category", cat);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const active = cat === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setCat(t.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gold text-white"
                  : dark
                    ? "bg-white/10 text-white/80 hover:bg-white/15"
                    : "bg-surface-3 text-text-soft hover:bg-line",
              )}
            >
              <Icon name={CATEGORY_ICON[t.key]} size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-surface p-2 shadow-lift">
        <span className="pl-2 text-text-muted">
          <Icon name="search" size={20} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Район, ЖК, цена или запрос словами…"
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-muted"
        />
        <button
          onClick={submit}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-text-invert transition-colors hover:bg-ink-soft"
        >
          Найти
          <Icon name="arrow-right" size={16} />
        </button>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-xs text-white/60">
        <Icon name="sparkles" size={13} className="text-gold-bright" />
        <a href="/ai" className="link-underline text-white/80 hover:text-white">
          Или опишите словами — AI подберёт объект
        </a>
      </div>
    </div>
  );
}
