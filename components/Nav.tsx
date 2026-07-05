"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
          {primaryNav.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/ai" variant="ghost" size="sm" icon="sparkles">
            AI-подбор
          </Button>
          <Button href="/sell" variant="dark" size="sm">
            Продать объект
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface-2 lg:hidden">
          <nav className="container flex flex-col py-3">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-[15px] font-medium text-text-soft hover:bg-surface-3"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/sell" variant="dark" className="mt-2" onClick={() => setOpen(false)}>
              Продать объект
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
