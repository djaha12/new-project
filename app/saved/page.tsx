"use client";

import { useFavorites } from "@/lib/useFavorites";
import { getProperty } from "@/lib/data/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { pluralize } from "@/lib/utils";
import type { Property } from "@/lib/types";

export default function SavedPage() {
  const { favorites, notes, setNote, ready } = useFavorites();

  // Матчим сохранённые slug'и с каталогом; пропускаем то, чего уже нет в продаже.
  const items: Property[] = favorites
    .map((slug) => getProperty(slug))
    .filter((p): p is Property => Boolean(p));

  const shown = items.length;

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container py-10 sm:py-14">
          <div className="eyebrow mb-3">Личный кабинет</div>
          <h1 className="font-display text-4xl leading-[1.05] text-text sm:text-5xl">
            Избранное
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-soft">
            Ваш личный шортлист объектов — с заметками для просмотров и
            переговоров. Список хранится в этом браузере; чтобы передать его
            брокеру MULK и синхронизировать, отправьте заявку.
          </p>
          {ready && shown > 0 && (
            <div className="mt-6 text-sm text-text-muted">
              <span className="font-semibold text-text">{shown}</span>{" "}
              {pluralize(shown, ["объект", "объекта", "объектов"])} в шортлисте
            </div>
          )}
        </div>
      </div>

      <div className="container py-12 sm:py-16">
        {!ready ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[4/3] rounded-2xl bg-surface-3" />
                <div className="h-4 w-2/3 rounded bg-surface-3" />
                <div className="h-3 w-1/2 rounded bg-surface-3" />
              </div>
            ))}
          </div>
        ) : shown === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-line bg-surface px-6 py-16 text-center shadow-soft animate-fade-up">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold-wash text-gold">
              <Icon name="star" size={28} />
            </div>
            <h2 className="font-display text-2xl text-text">Пока пусто</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-soft">
              Жмите звезду на карточках объектов — так вы соберёте личный
              шортлист. Здесь можно оставить заметку к каждому варианту и
              сравнивать спокойно, без спешки.
            </p>
            <Button
              href="/catalog"
              variant="primary"
              iconRight="arrow-right"
              className="mt-6"
            >
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.slug} className="flex flex-col gap-3">
                <PropertyCard property={p} />
                <div className="rounded-2xl border border-line bg-surface p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                      <Icon name="file" size={13} />
                      Личная заметка
                    </span>
                    <FavoriteButton slug={p.slug} />
                  </div>
                  <textarea
                    value={notes[p.slug] ?? ""}
                    onChange={(e) => setNote(p.slug, e.target.value)}
                    rows={2}
                    placeholder="Например: уточнить парковку, торг до 5%, позвонить брокеру в четверг…"
                    className="w-full resize-none rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm leading-snug text-text placeholder:text-text-muted focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
