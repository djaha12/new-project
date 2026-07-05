"use client";

import { useState } from "react";
import { properties } from "@/lib/data/properties";
import { findFallback } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const SUGGESTIONS = [
  "Участок до $50 000 недалеко от Бишкека, чтобы построить барнхаус и сдавать посуточно",
  "Квартира для семьи до $70 000 рядом со школой",
  "Объект под инвестицию на Иссык-Куле с арендным доходом",
  "Апартаменты в Дубае с рассрочкой",
];

export function FindAssistant({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [live, setLive] = useState(false);

  function run(q: string) {
    const text = q.trim();
    if (!text || loading) return;
    setQuery(text);
    setLoading(true);
    setReply(null);
    // Подбор считается на клиенте детерминированным движком (findFallback) —
    // работает и на статике, без серверного роута.
    const data = findFallback(text);
    setReply(data.reply);
    setIds(data.ids || []);
    setLive(false);
    setLoading(false);
  }

  const matched = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, compact ? 3 : 4);

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-gold-bright">
          <Icon name="sparkles" size={18} />
        </span>
        <div>
          <div className="text-sm font-semibold text-text">AI-подбор объекта</div>
          <div className="text-xs text-text-muted">Опишите словами, что ищете — как брокеру</div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface-2 p-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run(query);
          }}
          rows={compact ? 2 : 3}
          placeholder="Например: участок до $50 000 недалеко от Бишкека под барнхаус…"
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted"
        />
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-[11px] text-text-muted">⌘/Ctrl + Enter</span>
          <Button size="sm" onClick={() => run(query)} disabled={loading} iconRight={loading ? undefined : "arrow-right"}>
            {loading ? "Подбираю…" : "Подобрать"}
          </Button>
        </div>
      </div>

      {!reply && !loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.slice(0, compact ? 2 : 4).map((s) => (
            <button
              key={s}
              onClick={() => run(s)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-xs text-text-soft transition-colors hover:border-gold hover:text-gold"
            >
              {s.length > 52 ? s.slice(0, 52) + "…" : s}
            </button>
          ))}
        </div>
      )}

      {reply && (
        <div className="mt-4 animate-fade-up">
          <div className="flex items-start gap-3 rounded-2xl bg-ink p-4 text-text-invert">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-bright">
              <Icon name="sparkles" size={15} />
            </span>
            <div>
              <p className="text-sm leading-relaxed">{reply}</p>
              <span className={cn("mt-2 inline-block text-[10px] font-medium", live ? "text-emerald-soft" : "text-white/40")}>
                {live ? "● Claude AI" : "○ офлайн-режим (без API-ключа)"}
              </span>
            </div>
          </div>

          {matched.length > 0 && (
            <div className={cn("mt-4 grid gap-4", compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4")}>
              {matched.map((p) => (
                <PropertyCard key={p!.id} property={p!} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
