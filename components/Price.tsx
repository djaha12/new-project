"use client";

import { cn } from "@/lib/utils";
import { fmtMoney, useCurrency } from "@/lib/currency";

/**
 * Цена в выбранной валюте (клиентский островок). Использовать вместо
 * прямого formatPrice там, где нужно уважать переключатель валюты.
 * approx: показать вторую валюту мелким шрифтом («≈ … сом»).
 */
export function Price({
  usd,
  className,
  approx = false,
}: {
  usd: number;
  className?: string;
  approx?: boolean;
}) {
  const { currency, rate } = useCurrency();
  const other = currency === "USD" ? "KGS" : "USD";
  return (
    <span className={cn("tabular-nums", className)}>
      {fmtMoney(usd, currency, rate)}
      {approx && (
        <span className="ml-1.5 text-[0.72em] font-normal text-text-muted">
          ≈ {fmtMoney(usd, other, rate)}
        </span>
      )}
    </span>
  );
}
