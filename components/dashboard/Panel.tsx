import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Панель-карточка кабинета с шапкой (иконка + заголовок + действие). */
export function Panel({
  title,
  icon,
  eyebrow,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  icon?: IconName;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-wash text-gold">
              <Icon name={icon} size={16} />
            </span>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {eyebrow}
              </div>
            )}
            <h2 className="truncate font-display text-lg leading-tight text-text">{title}</h2>
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
