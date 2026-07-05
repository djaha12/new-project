"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import type { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type NavKey = keyof (typeof dict)["ru"]["nav"];
const NAV_ITEMS: { href: string; key: NavKey }[] = [
  { href: "/catalog", key: "catalog" },
  { href: "/premium", key: "premium" },
  { href: "/abroad", key: "abroad" },
  { href: "/brokers", key: "brokers" },
  { href: "/ai", key: "ai" },
  { href: "/sell", key: "sell" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { d } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-surface-2/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-gold-bright">
            M
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-text">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-gold" : "text-text-soft hover:text-text",
                )}
              >
                {d.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Button href="/ai" variant="ghost" size="sm" icon="sparkles">
            {d.nav.aiPick}
          </Button>
          <Button href="/sell" variant="dark" size="sm">
            {d.nav.sellCta}
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            <Icon name={open ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface-2 lg:hidden">
          <nav className="container flex flex-col py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-[15px] font-medium text-text-soft hover:bg-surface-3"
              >
                {d.nav[item.key]}
              </Link>
            ))}
            <Button href="/sell" variant="dark" className="mt-2" onClick={() => setOpen(false)}>
              {d.nav.sellCta}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
