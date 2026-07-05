import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type Tone = "gold" | "emerald" | "ink" | "neutral" | "danger" | "glass";

const tones: Record<Tone, string> = {
  gold: "bg-gold-wash text-gold border-gold/20",
  emerald: "bg-emerald-soft text-emerald border-emerald/20",
  ink: "bg-ink text-text-invert border-transparent",
  neutral: "bg-surface-3 text-text-soft border-line",
  danger: "bg-danger-soft text-danger border-danger/20",
  glass: "bg-white/10 text-white border-white/20 backdrop-blur",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: IconName;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-tight",
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}
