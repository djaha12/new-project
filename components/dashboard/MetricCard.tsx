import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Карточка-метрика кабинета: иконка, значение, подпись и опциональный тренд. */
export function MetricCard({
  icon,
  label,
  value,
  hint,
  trend,
  tone = "default",
}: {
  icon: IconName;
  label: string;
  value: string;
  hint?: string;
  trend?: { value: string; up?: boolean };
  tone?: "default" | "gold" | "emerald";
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tone === "gold"
              ? "bg-gold-wash text-gold"
              : tone === "emerald"
                ? "bg-emerald-soft text-emerald"
                : "bg-surface-3 text-text-soft",
          )}
        >
          <Icon name={icon} size={19} />
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trend.up ? "bg-emerald-soft text-emerald" : "bg-danger-soft text-danger",
            )}
          >
            <Icon name="trending" size={12} className={trend.up ? undefined : "rotate-180"} />
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-[2rem] leading-none text-text">{value}</div>
      <div className="mt-2 text-sm font-medium text-text">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-text-muted">{hint}</div>}
    </div>
  );
}
