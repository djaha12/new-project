"use client";

import { SearchBar } from "@/components/SearchBar";
import { useI18n } from "@/components/i18n";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

type StatKey = "verified" | "brokers" | "ai" | "fees";

/** Hero главной — переведён на RU/KG/EN через i18n-контекст. */
export function Hero({
  stats,
}: {
  stats: { key: StatKey; icon: IconName; value: string }[];
}) {
  const { d } = useI18n();

  return (
    <section className="relative isolate overflow-hidden bg-ink text-text-invert">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-soft via-ink to-ink" />
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald/10 blur-3xl" />

      <div className="container py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl animate-fade-up text-center">
          <span className="eyebrow justify-center">
            <Icon name="sparkles" size={14} className="text-gold-bright" />
            {d.hero.eyebrow}
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl leading-[1.05] text-text-invert sm:text-5xl lg:text-[3.75rem]">
            {d.hero.titleLead}{" "}
            <span className="text-gold-bright">{d.hero.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
            {d.hero.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-9 max-w-2xl">
          <SearchBar dark />
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {stats.map((s, i) => (
            <div
              key={s.key}
              className={cn(
                "flex items-center gap-2.5",
                i > 0 && "sm:border-l sm:border-white/10 sm:pl-8",
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gold-bright">
                <Icon name={s.icon} size={16} />
              </span>
              <div className="text-left">
                <div className="text-base font-semibold leading-none">{s.value}</div>
                <div className="mt-1 text-xs text-white/55">{d.hero.stats[s.key]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
