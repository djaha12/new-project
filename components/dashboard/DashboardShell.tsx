import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Avatar } from "@/components/ui/Avatar";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Пункт навигации кабинета. Демо-статичный: активный подсвечен. */
export interface DashNavItem {
  label: string;
  icon: IconName;
  active?: boolean;
  count?: number;
}

/**
 * Каркас личного кабинета MULK: боковое меню + колонка контента.
 * Server-компонент, без интерактива — статичный демо-UI.
 * Общий для кабинетов продавца и брокера.
 */
export function DashboardShell({
  roleLabel,
  user,
  nav,
  roleSwitch,
  children,
}: {
  roleLabel: string;
  user: { name: string; tone: number; meta: string };
  nav: DashNavItem[];
  roleSwitch: { label: string; href: string; icon: IconName };
  children: ReactNode;
}) {
  return (
    <div className="bg-surface-2">
      <div className="container py-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-8 xl:grid-cols-[16.5rem_1fr]">
          {/* ───────────── Боковое меню (десктоп) ───────────── */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-soft">
              <div className="flex items-center gap-2.5 px-1.5 pb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sm font-bold text-gold-bright">
                  M
                </span>
                <div className="leading-tight">
                  <div className="font-display text-base text-text">{site.name}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    {roleLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-2.5">
                <Avatar name={user.name} tone={user.tone} size="sm" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text">{user.name}</div>
                  <div className="truncate text-[11px] text-text-muted">{user.meta}</div>
                </div>
              </div>

              <nav className="mt-4 space-y-1">
                {nav.map((item) => (
                  <div
                    key={item.label}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      item.active
                        ? "bg-ink text-text-invert shadow-soft"
                        : "text-text-soft hover:bg-surface-3/70 hover:text-text",
                    )}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      className={item.active ? "text-gold-bright" : "text-text-muted"}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.count != null && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                          item.active ? "bg-white/15 text-white" : "bg-gold-wash text-gold",
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-4 space-y-1 border-t border-line pt-4">
                <Link
                  href={roleSwitch.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-soft transition-colors hover:bg-surface-3/70 hover:text-text"
                >
                  <Icon name={roleSwitch.icon} size={18} className="text-text-muted" />
                  {roleSwitch.label}
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-soft transition-colors hover:bg-surface-3/70 hover:text-text"
                >
                  <Icon name="arrow-right" size={18} className="rotate-180 text-text-muted" />
                  Вернуться на сайт
                </Link>
              </div>
            </div>
          </aside>

          {/* ───────────── Колонка контента ───────────── */}
          <div className="min-w-0 space-y-6">
            {/* Меню кабинета — мобильная версия */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-3 shadow-soft">
                <div className="flex items-center gap-2.5">
                  <Avatar name={user.name} tone={user.tone} size="sm" />
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-text">{user.name}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      {roleLabel}
                    </div>
                  </div>
                </div>
                <Link href="/" className="text-xs font-semibold text-gold">
                  На сайт
                </Link>
              </div>
              <div className="mt-3 overflow-x-auto pb-1">
                <div className="flex w-max gap-2">
                  {nav.map((item) => (
                    <div
                      key={item.label}
                      aria-current={item.active ? "page" : undefined}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium",
                        item.active
                          ? "border-ink bg-ink text-text-invert"
                          : "border-line bg-surface text-text-soft",
                      )}
                    >
                      <Icon
                        name={item.icon}
                        size={15}
                        className={item.active ? "text-gold-bright" : "text-text-muted"}
                      />
                      {item.label}
                      {item.count != null && (
                        <span
                          className={cn(
                            "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                            item.active ? "bg-white/15 text-white" : "bg-gold-wash text-gold",
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
