import { scoreBreakdown } from "@/lib/ai";
import type { AiScore } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Разбивка AI-оценки по критериям в виде мини-баров. */
export function ScoreBars({
  score,
  className,
  dark = false,
}: {
  score: AiScore;
  className?: string;
  dark?: boolean;
}) {
  const rows = scoreBreakdown(score);
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {rows.map((row) => {
        const color = row.value >= 8 ? "#B98B3E" : row.value >= 6 ? "#2E8C73" : "#B4472B";
        return (
          <div key={row.label} className="flex items-center gap-3">
            <span
              className={cn(
                "w-28 shrink-0 text-xs",
                dark ? "text-white/70" : "text-text-soft",
              )}
            >
              {row.label}
            </span>
            <div
              className={cn(
                "h-1.5 flex-1 overflow-hidden rounded-full",
                dark ? "bg-white/10" : "bg-surface-3",
              )}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${row.value * 10}%`, backgroundColor: color }}
              />
            </div>
            <span
              className={cn(
                "w-7 shrink-0 text-right text-xs font-semibold tabular-nums",
                dark ? "text-text-invert" : "text-text",
              )}
            >
              {row.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
