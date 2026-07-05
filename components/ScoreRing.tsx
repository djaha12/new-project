import { cn } from "@/lib/utils";

/** Кольцевой индикатор AI Property Score (значение 0..10). */
export function ScoreRing({
  value,
  size = 96,
  label,
  className,
  dark = false,
}: {
  value: number;
  size?: number;
  label?: string;
  className?: string;
  dark?: boolean;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 10));
  const dash = c * pct;
  const color = value >= 8.5 ? "#B98B3E" : value >= 7 ? "#2E8C73" : "#8A8F98";

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={dark ? "rgba(255,255,255,0.12)" : "#E7E2D9"}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn("font-display leading-none", dark ? "text-text-invert" : "text-text")}
            style={{ fontSize: size * 0.3 }}
          >
            {value.toFixed(1)}
          </span>
          <span className={cn("text-[10px] font-medium", dark ? "text-white/50" : "text-text-muted")}>
            из 10
          </span>
        </div>
      </div>
      {label && (
        <span
          className="mt-2 text-xs font-semibold"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
