import type { CheckItem, CheckStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

const meta: Record<CheckStatus, { icon: IconName; cls: string; ring: string }> = {
  yes: { icon: "check", cls: "text-emerald", ring: "bg-emerald-soft" },
  near: { icon: "map-pin", cls: "text-gold", ring: "bg-gold-wash" },
  partial: { icon: "minus", cls: "text-gold", ring: "bg-gold-wash" },
  no: { icon: "x", cls: "text-text-muted", ring: "bg-surface-3" },
  unknown: { icon: "minus", cls: "text-text-muted", ring: "bg-surface-3" },
};

/** Список статусов: «Проверено», коммуникации и т.п. */
export function CheckList({
  items,
  className,
}: {
  items: CheckItem[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item, i) => {
        const m = meta[item.status];
        return (
          <li key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                m.ring,
              )}
            >
              <Icon name={m.icon} size={13} className={m.cls} />
            </span>
            <span className="text-sm leading-snug text-text-soft">
              <span className="text-text">{item.label}</span>
              {item.note && <span className="text-text-muted"> — {item.note}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
