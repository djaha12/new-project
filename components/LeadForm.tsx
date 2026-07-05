"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Универсальная форма заявки. Демо: без бэкенда, показывает успех локально. */
export function LeadForm({
  title = "Оставить заявку",
  subtitle,
  cta = "Отправить заявку",
  context,
  dark = false,
  className,
}: {
  title?: string;
  subtitle?: string;
  cta?: string;
  context?: string;
  dark?: boolean;
  className?: string;
}) {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border p-8 text-center",
          dark ? "border-white/10 bg-white/5" : "border-line bg-surface",
          className,
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-soft text-emerald">
          <Icon name="check-circle" size={26} />
        </span>
        <h3 className={cn("mt-4 text-lg font-semibold", dark && "text-text-invert")}>
          Заявка принята
        </h3>
        <p className={cn("mt-2 text-sm", dark ? "text-white/60" : "text-text-soft")}>
          Брокер MULK свяжется с вами в ближайшее время. Обычно — в течение 15 минут в рабочее время.
        </p>
      </div>
    );
  }

  const inputCls = cn(
    "h-11 w-full rounded-xl border px-4 text-sm outline-none transition-colors focus:border-gold",
    dark
      ? "border-white/15 bg-white/5 text-text-invert placeholder:text-white/40"
      : "border-line bg-surface text-text placeholder:text-text-muted",
  );

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-2xl border p-6 shadow-soft",
        dark ? "border-white/10 bg-white/5" : "border-line bg-surface",
        className,
      )}
    >
      <h3 className={cn("text-lg font-semibold", dark && "text-text-invert")}>{title}</h3>
      {subtitle && (
        <p className={cn("mt-1 text-sm", dark ? "text-white/60" : "text-text-soft")}>{subtitle}</p>
      )}
      {context && (
        <div className="mt-3 rounded-lg bg-gold-wash px-3 py-2 text-xs font-medium text-gold">
          {context}
        </div>
      )}
      <div className="mt-4 space-y-3">
        <input required placeholder="Ваше имя" className={inputCls} />
        <input required type="tel" placeholder="Телефон / WhatsApp" className={inputCls} />
        <textarea placeholder="Комментарий (необязательно)" rows={3} className={cn(inputCls, "h-auto py-3")} />
      </div>
      <Button type="submit" variant="primary" className="mt-4 w-full" iconRight="arrow-right">
        {cta}
      </Button>
      <p className={cn("mt-3 text-center text-[11px]", dark ? "text-white/40" : "text-text-muted")}>
        Нажимая кнопку, вы соглашаетесь на обработку данных.
      </p>
    </form>
  );
}
