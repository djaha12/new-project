"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Избранное / шортлист без авторизации — на localStorage.
 * Хранит набор slug'ов объектов и заметки. Синхронизация между устройствами —
 * задача tier3 (нужен аккаунт).
 */
const KEY = "mulk_favorites";
const NOTES_KEY = "mulk_fav_notes";

interface Ctx {
  favorites: string[]; // slugs
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
  notes: Record<string, string>;
  setNote: (slug: string, note: string) => void;
  ready: boolean; // смонтирован ли клиент (чтобы не мигать на SSR)
  count: number;
}

const FavContext = createContext<Ctx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
      const rawN = localStorage.getItem(NOTES_KEY);
      if (rawN) setNotes(JSON.parse(rawN));
    } catch {}
    setReady(true);
  }, []);

  const persist = (next: string[]) => {
    setFavorites(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const setNote = useCallback((slug: string, note: string) => {
    setNotes((prev) => {
      const next = { ...prev, [slug]: note };
      if (!note.trim()) delete next[slug];
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return (
    <FavContext.Provider
      value={{ favorites, isFavorite, toggle, notes, setNote, ready, count: favorites.length }}
    >
      {children}
    </FavContext.Provider>
  );
}

export function useFavorites(): Ctx {
  const ctx = useContext(FavContext);
  if (!ctx)
    return {
      favorites: [],
      isFavorite: () => false,
      toggle: () => {},
      notes: {},
      setNote: () => {},
      ready: false,
      count: 0,
    };
  return ctx;
}
