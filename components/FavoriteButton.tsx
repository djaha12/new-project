"use client";

import type { MouseEvent } from "react";
import { useFavorites } from "@/lib/useFavorites";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Кнопка «сохранить в избранное». Работает поверх ссылки-карточки:
 * останавливает всплытие клика, чтобы не открывался объект.
 * Пока !ready (SSR/гидрация) — показываем нейтральное состояние без мигания.
 *
 * variant="icon"    — круглая кнопка-звёздочка (заполнена gold, если сохранено);
 * variant="labeled" — кнопка с текстом «В избранное» / «В избранном».
 */
export function FavoriteButton({
  slug,
  variant = "icon",
  className,
}: {
  slug: string;
  variant?: "icon" | "labeled";
  className?: string;
}) {
  const { isFavorite, toggle, ready } = useFavorites();
  const active = ready && isFavorite(slug);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(slug);
  };

  const label = active ? "Убрать из избранного" : "Сохранить в избранное";

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2",
          active
            ? "border-gold/40 bg-gold-wash text-gold"
            : "border-line-strong bg-surface text-text hover:border-ink",
          className,
        )}
      >
        <Icon name="star" size={18} fill={active ? "currentColor" : "none"} />
        {active ? "В избранном" : "В избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-soft backdrop-blur transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2",
        active
          ? "border-gold/30 bg-gold-wash text-gold"
          : "border-line bg-white/95 text-text-muted hover:border-gold/30 hover:text-gold",
        className,
      )}
    >
      <Icon name="star" size={17} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
