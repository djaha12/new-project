"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Сохранённые поиски каталога — без авторизации, на localStorage.
 * «Сохранить этот поиск» берёт текущие фильтры из window.location.search,
 * просит короткое имя и складывает в список. Каждая запись — ссылка обратно
 * на /catalog с теми же параметрами. Читаем/пишем storage только в useEffect
 * (ready-флаг), чтобы не рассинхронизировать SSR/гидрацию.
 *
 * Компактный блок для сайдбара каталога. Props: className?.
 */
const KEY = "mulk_saved_searches";

interface SavedSearch {
  name: string;
  query: string; // включая ведущий "?", либо "" для «все объекты»
  savedAt: number;
}

function load(): SavedSearch[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function describe(query: string): string {
  const params = new URLSearchParams(query);
  const count = Array.from(params.keys()).length;
  if (count === 0) return "Без фильтров";
  return count === 1 ? "1 фильтр" : `${count} фильтра/ов`;
}

export function SavedSearches({ className }: { className?: string }) {
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  const persist = useCallback((next: SavedSearch[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const save = useCallback(() => {
    const name = draft.trim();
    if (!name) return;
    const query = typeof window !== "undefined" ? window.location.search : "";
    const entry: SavedSearch = { name, query, savedAt: Date.now() };
    // Дедупликация по (name+query): обновляем, если совпало.
    const rest = items.filter((s) => !(s.name === name && s.query === query));
    persist([entry, ...rest]);
    setDraft("");
    setAdding(false);
  }, [draft, items, persist]);

  const remove = useCallback(
    (target: SavedSearch) => {
      persist(items.filter((s) => s !== target));
    },
    [items, persist],
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-4 shadow-soft",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-text">Сохранённые поиски</h3>
        {ready && items.length > 0 && (
          <span className="text-xs tabular-nums text-text-muted">{items.length}</span>
        )}
      </div>

      {adding ? (
        <div className="mb-3 flex items-center gap-1.5">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setAdding(false);
                setDraft("");
              }
            }}
            placeholder="Название поиска"
            maxLength={40}
            className="min-w-0 flex-1 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus-visible:border-line-strong focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={save}
            disabled={!draft.trim()}
            aria-label="Сохранить"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-text-invert transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Icon name="check" size={15} />
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setDraft("");
            }}
            aria-label="Отменить"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-text-muted transition-colors hover:text-text"
          >
            <Icon name="x" size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mb-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:border-ink"
        >
          <Icon name="star" size={15} className="text-gold" />
          Сохранить этот поиск
        </button>
      )}

      {ready && items.length === 0 ? (
        <p className="text-xs leading-relaxed text-text-muted">
          Настройте фильтры и сохраните поиск, чтобы вернуться к нему.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((s) => (
            <li key={`${s.savedAt}-${s.name}`} className="group flex items-center gap-1">
              <Link
                href={`/catalog${s.query}`}
                className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-3"
              >
                <span className="truncate text-sm font-medium text-text-soft group-hover:text-text">
                  {s.name}
                </span>
                <span className="shrink-0 text-[11px] text-text-muted">{describe(s.query)}</span>
              </Link>
              <button
                type="button"
                onClick={() => remove(s)}
                aria-label={`Удалить поиск «${s.name}»`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-danger-soft hover:text-danger"
              >
                <Icon name="x" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
