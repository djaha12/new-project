"use client";

import { useState, useRef, useEffect } from "react";
import { LOCALES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n";
import { Icon } from "@/components/ui/Icon";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5 text-sm font-medium text-text-soft transition-colors hover:border-line-strong hover:text-text"
        aria-label="Сменить язык"
      >
        <Icon name="globe" size={16} />
        <span className="tabular-nums">{current.short}</span>
        <Icon name="chevron-down" size={13} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lift">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-surface-3",
                l.code === locale ? "font-semibold text-gold" : "text-text-soft",
              )}
            >
              {l.label}
              <span className="text-xs text-text-muted">{l.short}</span>
              {l.code === locale && <Icon name="check" size={14} className="text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
