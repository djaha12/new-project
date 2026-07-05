import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, landProperties } from "@/lib/data/properties";
import { getBroker } from "@/lib/data/brokers";
import {
  CATEGORY_LABELS,
  SCORE_LABELS,
  type AiScore,
} from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/utils";
import { AI_DISCLAIMER, scoreTier } from "@/lib/ai";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { CATEGORY_ICON } from "@/components/ui/category";
import { PropertyMedia } from "@/components/PropertyMedia";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBars } from "@/components/ScoreBars";
import { FindAssistant } from "@/components/ai/FindAssistant";
import { CompareTool } from "@/components/ai/CompareTool";

export const metadata: Metadata = {
  title: "AI-анализ недвижимости",
  description:
    "AI-хаб MULK: подбор объекта по описанию, сравнение вариантов, сценарии застройки участка и AI Property Score по семи параметрам. Решение на данных, а не на ощущениях.",
};

/** Критерии AI Property Score (лейблы берём из SCORE_LABELS, чтобы не расходились). */
const SCORE_CRITERIA: { key: keyof AiScore; desc: string }[] = [
  { key: "liquidity", desc: "Насколько быстро объект можно продать по справедливой цене." },
  { key: "price", desc: "Соответствие цены рынку и похожим объектам в районе." },
  { key: "documents", desc: "Готовность и чистота правоустанавливающих документов." },
  { key: "location", desc: "Район, инфраструктура и транспортная доступность." },
  { key: "condition", desc: "Состояние объекта или готовность участка к застройке." },
  { key: "potential", desc: "Перспектива роста стоимости и сценарии использования." },
  { key: "risks", desc: "Отсутствие обременений и юридических рисков — выше балл, чище объект." },
];

const CAPABILITIES: { icon: IconName; label: string; href: string }[] = [
  { icon: "wand", label: "Подбор объекта", href: "#find" },
  { icon: "scale", label: "Сравнение", href: "#compare" },
  { icon: "home", label: "Что построить", href: "#build" },
  { icon: "shield", label: "Property Score", href: "#score" },
];

const PIPELINE: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "file",
    title: "Данные объекта",
    desc: "Документы, локация, цена, коммуникации и инфраструктура каждого объекта каталога.",
  },
  {
    icon: "sparkles",
    title: "AI-анализ",
    desc: "Property Score, риски, сценарии застройки и обоснование подбора под ваш запрос.",
  },
  {
    icon: "scale",
    title: "Ваше решение",
    desc: "Подбор, сравнение и вердикт — на цифрах и фактах, а не на ощущениях.",
  },
];

export default function AiHubPage() {
  const land = getProperty("land-baytik-5sot") ?? landProperties()[0];
  if (!land) notFound();

  const scenarios = land.buildScenarios ?? [];
  const st = scoreTier(land.aiScore.overall);
  const broker = getBroker(land.brokerId);

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink text-text-invert">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-soft via-ink to-ink" />
        <div className="pointer-events-none absolute -right-40 -top-44 -z-10 h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-52 -left-44 -z-10 h-[32rem] w-[32rem] rounded-full bg-emerald/10 blur-3xl" />

        <div className="container py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">
              <Icon name="sparkles" size={14} className="text-gold-bright" />
              AI-анализ MULK
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-[3.9rem]">
              AI-анализ недвижимости —{" "}
              <span className="text-gold-bright">
                решение на данных, а не на ощущениях.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
              MULK разбирает каждый объект как брокер и аналитик одновременно:
              подбирает под запрос словами, сравнивает варианты по цифрам,
              показывает, что можно построить на участке, и выставляет Property
              Score по семи параметрам.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#find" variant="primary" iconRight="arrow-right">
                Подобрать объект
              </Button>
              <Button href="/catalog" variant="gold-outline" icon="search">
                Смотреть каталог
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {CAPABILITIES.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-gold/50 hover:text-gold-bright"
                >
                  <Icon name={c.icon} size={15} className="text-gold-bright" />
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 01 · НАЙДИ МНЕ ОБЪЕКТ ─────────────── */}
      <Section id="find" className="bg-surface-2">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-3">Инструмент 01</div>
            <h2 className="font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Найди мне объект
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-soft">
              Опишите словами, что ищете — как живому брокеру. AI разберёт
              категорию, бюджет, район и цель (жить, сдавать, инвестировать) и
              соберёт подборку из каталога MULK с коротким обоснованием.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Понимает свободный текст: «участок до $50 000 под барнхаус с посуточной арендой».",
                "Учитывает бюджет, район, Иссык-Куль и зарубежные направления.",
                "Возвращает подборку с AI-анализом и брокером каждого объекта.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-text-soft">
                  <span className="mt-0.5 shrink-0 text-gold">
                    <Icon name="check-circle" size={18} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-line bg-surface p-4 text-sm text-text-muted">
              <span className="mt-0.5 shrink-0 text-gold">
                <Icon name="users" size={16} />
              </span>
              Не нашлось точного совпадения? Оставьте заявку — брокер соберёт
              подборку вручную.
            </div>
          </div>

          <div className="lg:col-span-7">
            <FindAssistant />
          </div>
        </div>
      </Section>

      {/* ─────────────── 02 · СРАВНИТЬ ОБЪЕКТЫ ─────────────── */}
      <Section id="compare" className="bg-surface">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <CompareTool />
          </div>

          <div className="lg:col-span-5">
            <div className="eyebrow mb-3">Инструмент 02</div>
            <h2 className="font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Сравнить объекты
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-soft">
              Выберите 2–3 объекта — MULK построит таблицу по ключевым критериям
              и даст короткий вердикт: что дешевле, что ликвиднее, что чище по
              документам и где выше потенциал.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Сравнение по цене и семи параметрам AI Property Score.",
                "Понятный вывод: что взять под цену, а что — под баланс и надёжность.",
                "Помогает выбрать без эмоций — на цифрах.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-text-soft">
                  <span className="mt-0.5 shrink-0 text-gold">
                    <Icon name="check-circle" size={18} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ─────────────── 03 · ЧТО МОЖНО ПОСТРОИТЬ ─────────────── */}
      <Section id="build" className="bg-surface-2">
        <SectionHeading
          eyebrow="Инструмент 03"
          title="Что можно построить?"
          subtitle="На примере участка из каталога MULK показывает сценарии застройки с бюджетом и логикой окупаемости — от семейного дома до формата под посуточную аренду."
        />

        {/* Объект-пример */}
        <div className="grid items-center gap-6 rounded-3xl border border-line bg-surface p-4 shadow-soft sm:grid-cols-[minmax(0,20rem)_1fr] sm:p-5">
          <PropertyMedia
            tone={land.mediaTone}
            category={land.category}
            rounded="rounded-2xl"
            className="aspect-[4/3]"
          >
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="glass" icon={CATEGORY_ICON[land.category]}>
                  {CATEGORY_LABELS[land.category]}
                </Badge>
                {land.badge && <Badge tone="glass">{land.badge}</Badge>}
              </div>
              {land.videoSec && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                  <Icon name="play" size={11} />
                  {land.videoSec}с
                </span>
              )}
            </div>
          </PropertyMedia>

          <div>
            <div className="eyebrow">
              <Icon name="map-pin" size={13} />
              {land.district}
            </div>
            <h3 className="mt-2.5 font-display text-2xl leading-tight text-text">
              {land.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">
              {land.hook}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
              <div>
                <div className="font-display text-3xl text-text">
                  {formatPrice(land.price)}
                </div>
                <div className="mt-1 text-xs text-text-muted">
                  {formatArea(land.area, land.areaUnit)} · {land.address}
                </div>
              </div>
              <Button
                href={`/property/${land.slug}`}
                variant="dark"
                iconRight="arrow-right"
              >
                Смотреть объект
              </Button>
            </div>
          </div>
        </div>

        {/* Сценарии застройки */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((s) => (
            <div
              key={s.title}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="text-3xl leading-none" aria-hidden="true">
                {s.emoji}
              </span>
              <h3 className="mt-3 font-display text-lg text-text">{s.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-soft">
                {s.desc}
              </p>
              <div className="mt-4 border-t border-line pt-4">
                <div className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  Бюджет стройки
                </div>
                <div className="mt-0.5 font-display text-xl text-text">
                  {formatPrice(s.budgetUsd)}
                </div>
                <div className="mt-2 flex items-start gap-1.5 text-xs text-gold">
                  <Icon name="trending" size={13} className="mt-0.5 shrink-0" />
                  <span>{s.roiNote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─────────────── 04 · AI PROPERTY SCORE ─────────────── */}
      <Section id="score" dark>
        <SectionHeading
          dark
          eyebrow="Инструмент 04"
          title="AI Property Score"
          subtitle="Каждый объект MULK получает оценку от 0 до 10 по семи параметрам — чтобы решение принималось на данных, а не на впечатлении от одной фотографии."
        />

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Пример оценки */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
              <Icon name="sparkles" size={14} className="text-gold-bright" />
              Пример из каталога
            </div>

            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
              <ScoreRing
                value={land.aiScore.overall}
                size={124}
                dark
                label={st.label}
              />
              <div className="text-center sm:text-left">
                <h3 className="font-display text-xl leading-tight text-text-invert">
                  {land.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/60">
                  {land.district} · {formatPrice(land.price)}
                </p>
                <a
                  href={`/property/${land.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-bright"
                >
                  Открыть карточку с анализом
                  <Icon name="arrow-up-right" size={15} />
                </a>
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-7">
              <ScoreBars score={land.aiScore} dark />
            </div>
          </div>

          {/* Критерии */}
          <div>
            <h3 className="font-display text-2xl leading-tight text-text-invert">
              Что оценивает MULK
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Семь независимых параметров складываются в общий рейтинг. Для
              «чистоты» выше балл означает меньше рисков — объект юридически
              чище.
            </p>

            <ul className="mt-6 space-y-4">
              {SCORE_CRITERIA.map((c, i) => (
                <li key={c.key} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 font-display text-sm text-gold-bright">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-text-invert">
                      {SCORE_LABELS[c.key]}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/55">
                      {c.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ─────────────── 05 · КАК ЭТО РАБОТАЕТ ─────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Под капотом"
          title="Как это работает"
          subtitle="Мы соединяем данные объектов с AI-слоем. Инструменты работают всегда — с живым Claude при подключённом ключе API и в детерминированном офлайн-режиме без него."
        />

        {/* Конвейер */}
        <div className="grid gap-5 sm:grid-cols-3">
          {PIPELINE.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-line bg-surface-2 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-wash text-gold">
                  <Icon name={s.icon} size={18} />
                </span>
                <span className="font-display text-2xl text-text-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-text">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-soft">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Два режима */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-gold-bright">
                <Icon name="sparkles" size={20} />
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                Claude AI
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl text-text">Живой режим</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">
              При заданном ключе Anthropic API запросы уходят напрямую в Claude.
              Подбор, сравнение и анализ формулируются в реальном времени под
              конкретный запрос — с живыми обоснованиями.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-3 text-text-soft">
                <Icon name="layers" size={20} />
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full border border-text-muted" />
                офлайн-режим
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl text-text">Офлайн-режим</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">
              Без ключа всё работает на детерминированных алгоритмах поверх
              данных объектов. Демо и все AI-функции доступны всегда — мгновенно
              и без внешних вызовов.
            </p>
          </div>
        </div>

        {/* Дисклеймер */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-surface-2 p-5">
          <span className="mt-0.5 shrink-0 text-gold">
            <Icon name="shield" size={18} />
          </span>
          <p className="text-sm leading-relaxed text-text-soft">{AI_DISCLAIMER}</p>
        </div>
      </Section>

      {/* ─────────────── ФИНАЛЬНЫЙ CTA ─────────────── */}
      <Section dark>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow">
              <Icon name="sparkles" size={14} className="text-gold-bright" />
              Готовы начать
            </div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text-invert sm:text-[2.6rem]">
              Примените AI к своему следующему объекту
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
              Откройте каталог и запустите подбор, сравнение и Property Score на
              реальных объектах. А если хотите разобрать конкретный вариант —
              брокер MULK пройдёт по анализу вместе с вами.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/catalog" variant="primary" iconRight="arrow-right">
                Смотреть каталог
              </Button>
              <Button
                href={broker ? `/brokers/${broker.slug}` : "/brokers"}
                variant="gold-outline"
                icon="chat"
              >
                Обсудить с брокером
              </Button>
            </div>
          </div>

          {broker ? (
            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <Avatar name={broker.name} tone={broker.photoTone} size="lg" />
                <div>
                  <div className="font-display text-lg text-text-invert">
                    {broker.name}
                  </div>
                  <div className="text-sm text-white/60">{broker.title}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {broker.bio}
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-7 gap-y-3 border-t border-white/10 pt-5">
                <div>
                  <span className="font-display text-xl text-gold-bright">
                    {broker.rating}
                  </span>{" "}
                  <span className="text-xs text-white/50">рейтинг</span>
                </div>
                <div>
                  <span className="font-display text-xl text-gold-bright">
                    {broker.dealsClosed}
                  </span>{" "}
                  <span className="text-xs text-white/50">сделок</span>
                </div>
                <div>
                  <span className="font-display text-xl text-gold-bright">
                    {broker.avgDaysToSell}
                  </span>{" "}
                  <span className="text-xs text-white/50">дней до продажи</span>
                </div>
              </div>
              <Button
                href={`/brokers/${broker.slug}`}
                variant="gold-outline"
                className="mt-6 w-full"
                iconRight="arrow-right"
              >
                Профиль брокера
              </Button>
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 text-center">
              <p className="text-[15px] leading-relaxed text-white/70">
                Наши брокеры помогут применить AI-анализ к вашему выбору и
                сопроводят сделку от показа до ключей.
              </p>
              <Button
                href="/brokers"
                variant="gold-outline"
                className="mt-5"
                iconRight="arrow-right"
              >
                Все брокеры
              </Button>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
