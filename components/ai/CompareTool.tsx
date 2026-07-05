"use client";

import { useState } from "react";
import { properties } from "@/lib/data/properties";
import { compareFallback } from "@/lib/ai";
import { SCORE_LABELS, type AiScore } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const SCORE_KEYS = (Object.keys(SCORE_LABELS) as (keyof AiScore)[]).filter(
  (k) => k !== "overall",
);

export function CompareTool() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  function toggle(id: string) {
    setVerdict(null);
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 3
          ? prev
          : [...prev, id],
    );
  }

  function compare() {
    if (selected.length < 2 || loading) return;
    setLoading(true);
    // Вердикт считается на клиенте (compareFallback) — работает на статике.
    const data = compareFallback(selected);
    setVerdict(data.verdict);
    setLive(false);
    setLoading(false);
  }

  const chosen = selected
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-gold-bright">
          <Icon name="scale" size={18} />
        </span>
        <div>
          <div className="text-sm font-semibold text-text">Сравнить объекты</div>
          <div className="text-xs text-text-muted">Выберите 2–3 объекта — AI даст вердикт</div>
        </div>
      </div>

      <div className="grid max-h-64 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
        {properties.map((p) => {
          const active = selected.includes(p.id);
          const disabled = !active && selected.length >= 3;
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                active
                  ? "border-gold bg-gold-wash text-text"
                  : "border-line bg-surface text-text-soft hover:border-line-strong",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  active ? "border-gold bg-gold text-white" : "border-line-strong",
                )}
              >
                {active && <Icon name="check" size={11} />}
              </span>
              <span className="min-w-0 flex-1 truncate">{p.title}</span>
              <span className="shrink-0 text-xs font-semibold text-text-muted">
                {formatPrice(p.price)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-text-muted">Выбрано: {selected.length}/3</span>
        <Button size="sm" onClick={compare} disabled={selected.length < 2 || loading} icon="scale">
          {loading ? "Сравниваю…" : "Сравнить"}
        </Button>
      </div>

      {chosen.length >= 2 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-text-muted">Критерий</th>
                {chosen.map((p) => (
                  <th key={p!.id} className="pb-2 text-left text-xs font-semibold text-text">
                    {p!.title.split(" ").slice(0, 3).join(" ")}…
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="py-2 text-xs text-text-soft">Цена</td>
                {chosen.map((p) => (
                  <td key={p!.id} className="py-2 font-semibold text-text">
                    {formatPrice(p!.price)}
                  </td>
                ))}
              </tr>
              {SCORE_KEYS.map((k) => (
                <tr key={k} className="border-t border-line">
                  <td className="py-2 text-xs text-text-soft">{SCORE_LABELS[k]}</td>
                  {chosen.map((p) => (
                    <td key={p!.id} className="py-2 tabular-nums text-text">
                      {p!.aiScore[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {verdict && (
        <div className="mt-4 flex animate-fade-up items-start gap-3 rounded-2xl bg-ink p-4 text-text-invert">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-bright">
            <Icon name="sparkles" size={15} />
          </span>
          <div>
            <p className="text-sm leading-relaxed">{verdict}</p>
            <span className={cn("mt-2 inline-block text-[10px] font-medium", live ? "text-emerald-soft" : "text-white/40")}>
              {live ? "● Claude AI" : "○ офлайн-режим"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
