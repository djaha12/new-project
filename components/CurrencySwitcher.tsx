"use client";

import { useCurrency, type Currency } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * Компактный сегмент-переключатель валюты USD | сом.
 * Стилистически близок к LanguageSwitcher: рамка border-line, активный
 * сегмент — тёмная заливка bg-ink с инверсным текстом. Без выпадашки — две кнопки.
 */
const OPTIONS: { code: Currency; label: string; aria: string }[] = [
  { code: "USD", label: "USD", aria: "Показывать цены в долларах" },
  { code: "KGS", label: "сом", aria: "Показывать цены в сомах" },
];

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Валюта отображения цен"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = currency === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setCurrency(opt.code)}
            aria-pressed={active}
            aria-label={opt.aria}
            className={cn(
              "rounded-full px-2.5 py-1 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
              active
                ? "bg-ink text-text-invert shadow-soft"
                : "text-text-soft hover:text-text",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
