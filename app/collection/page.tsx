"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProperty } from "@/lib/data/properties";
import type { Property } from "@/lib/types";
import { pluralize } from "@/lib/utils";
import { Price } from "@/components/Price";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

const OBJECT_FORMS: [string, string, string] = ["объект", "объекта", "объектов"];

/**
 * Шаринговая подборка брокера.
 * Читает ?ids=slug1,slug2,... — список объектов, которые брокер вручную
 * собрал под конкретного клиента, и делится ссылкой (консьерж-механика).
 */
function CollectionContent() {
  const params = useSearchParams();
  const idsParam = params.get("ids") ?? "";
  const [copied, setCopied] = useState(false);

  const items = useMemo<Property[]>(() => {
    const slugs = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const seen = new Set<string>();
    const out: Property[] = [];
    for (const s of slugs) {
      const p = getProperty(s);
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  }, [idsParam]);

  const total = items.reduce((sum, p) => sum + p.price, 0);
  const avg = items.length ? Math.round(total / items.length) : 0;
  const count = items.length;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard недоступен — тихо игнорируем */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  function shareWhatsApp() {
    const url = window.location.href;
    const text = `Персональная подборка недвижимости от MULK — ${count} ${pluralize(
      count,
      OBJECT_FORMS,
    )}. Посмотрите объекты по ссылке: ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  // ─────────────── Пустое состояние ───────────────
  if (count === 0) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
          <div className="animate-fade-up flex max-w-xl flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-wash text-gold">
              <Icon name="sparkles" size={28} />
            </div>
            <div className="eyebrow mb-3">Персональная подборка</div>
            <h1 className="font-display text-3xl leading-[1.1] text-text sm:text-4xl">
              Здесь пока пусто
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-text-soft">
              Ссылка на подборку не содержит объектов или они больше не в
              продаже. Ваш брокер MULK соберёт персональную подборку под ваш
              запрос — или начните с каталога проверенных объектов.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/catalog" variant="primary" iconRight="arrow-right">
                Смотреть каталог
              </Button>
              <Button href="/brokers" variant="outline" icon="users">
                Найти брокера
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─────────────── Подборка ───────────────
  return (
    <main className="min-h-screen bg-surface">
      {/* Премиальный тёмный заголовок */}
      <section className="bg-ink text-text-invert">
        <div className="container py-16 sm:py-20">
          <div className="animate-fade-up max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="eyebrow text-gold-bright">Подборка консьержа</span>
              <Badge tone="glass" icon="shield">
                Проверено MULK
              </Badge>
            </div>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-[3.4rem]">
              Подборка от MULK
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
              Ваш брокер вручную отобрал{" "}
              <span className="font-semibold text-text-invert">
                {count} {pluralize(count, OBJECT_FORMS)}
              </span>{" "}
              под ваш запрос. Каждый объект проверен юристом и осмотрен на
              месте — изучайте, сравнивайте и обсуждайте прямо в чате.
            </p>

            {/* Сводка по бюджету */}
            <div className="mt-8 grid max-w-lg grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <div className="bg-ink px-5 py-4">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Объектов
                </div>
                <div className="mt-1 font-display text-2xl text-text-invert">
                  {count}
                </div>
              </div>
              <div className="bg-ink px-5 py-4">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Суммарно
                </div>
                <div className="mt-1 font-display text-2xl text-gold-bright">
                  <Price usd={total} />
                </div>
              </div>
              <div className="bg-ink px-5 py-4">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Средний бюджет
                </div>
                <div className="mt-1 font-display text-2xl text-text-invert">
                  <Price usd={avg} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Панель действий */}
      <div className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <p className="text-sm text-text-soft">
            Понравилась подборка? Поделитесь ей или сохраните ссылку.
          </p>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={copied ? "check-circle" : "file"}
              onClick={copyLink}
            >
              {copied ? "Скопировано" : "Скопировать ссылку"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon="chat"
              onClick={shareWhatsApp}
            >
              Отправить в WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Сетка объектов */}
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} className="animate-fade-up" />
          ))}
        </div>

        {/* Нижний CTA */}
        <div className="mt-14 rounded-3xl border border-line bg-surface-2 px-6 py-10 text-center sm:px-10">
          <div className="eyebrow mb-3">Остались вопросы?</div>
          <h2 className="font-display text-2xl text-text sm:text-3xl">
            Обсудите подборку с брокером MULK
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-text-soft">
            Организуем просмотр, проверим документы и подберём условия
            ипотеки или рассрочки — сопровождаем сделку под ключ.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={shareWhatsApp} variant="primary" icon="chat">
              Написать в WhatsApp
            </Button>
            <Button href="/catalog" variant="outline" iconRight="arrow-right">
              Смотреть весь каталог
            </Button>
          </div>
        </div>
      </div>

      {/* Тост «Скопировано» */}
      {copied && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="animate-fade-up flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-text-invert shadow-lift">
            <Icon name="check-circle" size={16} className="text-gold-bright" />
            Ссылка скопирована
          </div>
        </div>
      )}
    </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-surface text-text-muted">
          <span className="text-sm">Загружаем подборку…</span>
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}
