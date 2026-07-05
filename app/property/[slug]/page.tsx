import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { properties, getProperty, getSimilar } from "@/lib/data/properties";
import { getBroker } from "@/lib/data/brokers";
import {
  CATEGORY_LABELS,
  CATEGORY_PLURAL,
  TIER_LABELS,
} from "@/lib/types";
import { cn, formatArea, formatPrice, pricePerUnit } from "@/lib/utils";
import { scoreTier, AI_DISCLAIMER } from "@/lib/ai";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { CATEGORY_ICON } from "@/components/ui/category";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBars } from "@/components/ScoreBars";
import { CheckList } from "@/components/CheckList";
import { LeadForm } from "@/components/LeadForm";
import { PropertyCard } from "@/components/PropertyCard";
import { Gallery } from "@/components/property/Gallery";
import { BookingCtas } from "@/components/property/BookingCtas";
import { NearbyInfraPanel } from "@/components/property/NearbyInfraPanel";
import { PropertyMap } from "@/components/property/PropertyMap";
import { nearby } from "@/lib/poi";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) return { title: "Объект не найден" };
  return { title: p.title, description: p.hook };
}

const REASON_ICONS: IconName[] = ["sparkles", "trending", "shield"];

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) notFound();

  const broker = getBroker(p.brokerId);
  const tier = scoreTier(p.aiScore.overall);
  const similar = getSimilar(p, 3);

  // Реальная инфраструктура вокруг объекта по данным 2ГИС (только Бишкек).
  // Вычисляется на этапе SSG-сборки для трёх радиусов — в клиент уходит
  // лишь компактный результат (без самого датасета poi.json).
  const near1000 = p.coords ? nearby(p.coords.lat, p.coords.lng, 1000) : null;
  const near = p.coords ? nearby(p.coords.lat, p.coords.lng, 1500) : null;
  const near3000 = p.coords ? nearby(p.coords.lat, p.coords.lng, 3000) : null;

  const created = new Date(p.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Строка мета-характеристик под заголовком.
  const meta: string[] = [];
  if (p.rooms) meta.push(`${p.rooms}-комн.`);
  meta.push(formatArea(p.area, p.areaUnit));
  if (p.floor && p.floors) meta.push(`${p.floor}/${p.floors} этаж`);
  if (p.landArea) meta.push(`участок ${p.landArea} сот.`);

  return (
    <article className="bg-surface-2">
      {/* ─────────── Хлебные крошки ─────────── */}
      <nav
        aria-label="Хлебные крошки"
        className="border-b border-line bg-surface"
      >
        <div className="container flex flex-wrap items-center gap-1.5 py-4 text-sm text-text-muted">
          <Link href="/catalog" className="hover:text-gold">
            Каталог
          </Link>
          <Icon name="chevron-right" size={14} className="text-line-strong" />
          <Link
            href={`/catalog?category=${p.category}`}
            className="hover:text-gold"
          >
            {CATEGORY_PLURAL[p.category]}
          </Link>
          <Icon name="chevron-right" size={14} className="text-line-strong" />
          <Link
            href={`/catalog?district=${encodeURIComponent(p.district)}`}
            className="hover:text-gold"
          >
            {p.district}
          </Link>
        </div>
      </nav>

      <div className="container py-8 lg:py-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          {/* ═══════════ ОСНОВНОЙ КОНТЕНТ ═══════════ */}
          <div className="min-w-0 space-y-14">
            {/* ─────────── Заголовок ─────────── */}
            <header className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                {p.badge && <Badge tone="gold">{p.badge}</Badge>}
                <Badge tone="ink" icon="sparkles">
                  {TIER_LABELS[p.tier]}
                </Badge>
                <Badge tone="neutral" icon={CATEGORY_ICON[p.category]}>
                  {CATEGORY_LABELS[p.category]}
                </Badge>
                {p.dealType === "rent" && <Badge tone="neutral">Аренда</Badge>}
                {p.videoSec && (
                  <Badge tone="neutral" icon="play">
                    Видео {p.videoSec}с
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 max-w-3xl font-display text-3xl leading-[1.08] text-text sm:text-4xl lg:text-[2.9rem]">
                {p.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-soft">
                {p.hook}
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
                <span className="font-display text-4xl leading-none text-text sm:text-5xl">
                  {formatPrice(p.price)}
                </span>
                <span className="pb-1 text-sm text-text-muted">
                  {pricePerUnit(p.price, p.area, p.areaUnit)}
                </span>
                {p.installment && (
                  <Badge tone="gold" icon="check">
                    Рассрочка
                  </Badge>
                )}
                {p.exchange && <Badge tone="neutral">Обмен</Badge>}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-text-soft">
                <span className="inline-flex items-center gap-1.5 font-medium text-text">
                  <Icon name="map-pin" size={15} className="text-gold" />
                  {p.district}
                </span>
                {meta.map((m) => (
                  <span key={m} className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-line-strong" />
                    {m}
                  </span>
                ))}
                <span className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-line-strong" />
                  Обновлено {created}
                </span>
              </div>
            </header>

            {/* ─────────── Галерея ─────────── */}
            <Gallery property={p} />

            {/* ─────────── 3 причины купить ─────────── */}
            <section>
              <BlockHead eyebrow="Почему этот объект" title="Три причины купить" />
              <div className="grid gap-4 sm:grid-cols-3">
                {p.reasons.map((reason, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-display text-3xl text-gold/30">
                        0{i + 1}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-wash text-gold">
                        <Icon name={REASON_ICONS[i % REASON_ICONS.length]} size={18} />
                      </span>
                    </div>
                    <p className="text-[15px] font-medium leading-snug text-text">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ─────────── AI-анализ ─────────── */}
            <section className="rounded-3xl bg-ink p-7 text-text-invert shadow-lift sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="eyebrow text-gold-bright">
                    <Icon name="wand" size={14} />
                    AI-анализ объекта
                  </div>
                  <h2 className="mt-2 font-display text-2xl text-text-invert sm:text-3xl">
                    AI Property Score
                  </h2>
                </div>
                <Badge tone="glass" icon="sparkles">
                  Оценка MULK Intelligence
                </Badge>
              </div>

              <div className="mt-8 grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
                <div className="flex justify-center lg:justify-start">
                  <ScoreRing
                    value={p.aiScore.overall}
                    size={120}
                    label={tier.label}
                    dark
                  />
                </div>
                <ScoreBars score={p.aiScore} dark />
              </div>

              <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-white/80">
                {p.aiSummary}
              </p>
              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/40">
                {AI_DISCLAIMER}
              </p>
            </section>

            {/* ─────────── Характеристики ─────────── */}
            <section>
              <BlockHead eyebrow="Параметры" title="Характеристики объекта" />
              <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {p.features.map((f) => (
                  <div key={f.label} className="bg-surface p-4">
                    <dt className="text-xs uppercase tracking-wide text-text-muted">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-[15px] font-medium text-text">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* ─────────── Что можно построить? (только участки) ─────────── */}
            {p.category === "land" && p.buildScenarios && (
              <section className="rounded-3xl border border-gold/25 bg-gold-wash/50 p-6 sm:p-9">
                <BlockHead
                  eyebrow="Потенциал участка"
                  eyebrowIcon="wand"
                  title="Что можно построить?"
                  subtitle="Готовые сценарии застройки с ориентиром по бюджету и логикой окупаемости — от дома для жизни до формата под аренду."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {p.buildScenarios.map((s) => (
                    <div
                      key={s.title}
                      className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-wash text-2xl">
                          {s.emoji}
                        </span>
                        <div>
                          <h3 className="font-display text-xl leading-tight text-text">
                            {s.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-snug text-text-soft">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-text-muted">
                            Бюджет постройки
                          </div>
                          <div className="font-display text-lg text-text">
                            ~ {formatPrice(s.budgetUsd)}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-soft px-3 py-1.5 text-xs font-semibold text-emerald">
                          <Icon name="trending" size={13} />
                          {s.roiNote}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ─────────── Сценарий жизни ─────────── */}
            <section className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
              <Icon name="quote" size={40} className="text-gold/40" />
              <p className="mt-4 max-w-3xl font-display text-2xl leading-snug text-text sm:text-[1.9rem] sm:leading-snug">
                {p.lifestyle}
              </p>
              <div className="eyebrow mt-6">Сценарий жизни · MULK</div>
            </section>

            {/* ─────────── Инвестиционный потенциал ─────────── */}
            <section className="rounded-3xl border-l-4 border-gold bg-surface p-7 shadow-soft sm:p-9">
              <div className="eyebrow">
                <Icon name="trending" size={14} />
                Инвестиционный потенциал
              </div>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-soft">
                {p.investmentNote}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.investmentTags.map((tag) => (
                  <Badge key={tag} tone="gold" icon="sparkles">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>

            {/* ─────────── Коммуникации + Проверено ─────────── */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-text">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-text-soft">
                    <Icon name="layers" size={16} />
                  </span>
                  Коммуникации
                </h3>
                <CheckList items={p.communications} />
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-emerald-soft/40 p-6 shadow-soft">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-text">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                    <Icon name="shield" size={16} />
                  </span>
                  Проверено MULK
                </h3>
                <CheckList items={p.verified} />
              </div>
            </section>

            {/* ─────────── Инфраструктура ─────────── */}
            <section>
              {near ? (
                // Реальные данные 2ГИС (Бишкек) с переключателем радиуса
                <NearbyInfraPanel
                  sets={{ "1000": near1000, "1500": near, "3000": near3000 }}
                />
              ) : (
                // Фолбэк для объектов вне покрытия 2ГИС (Иссык-Куль, зарубежье)
                <>
                  <BlockHead eyebrow="Что рядом" title="Инфраструктура и окружение" />
                  <ul className="grid gap-x-10 sm:grid-cols-2">
                    {p.infrastructure.map((row) => (
                      <li
                        key={row.label}
                        className="flex items-center justify-between gap-4 border-b border-line py-3.5 text-sm"
                      >
                        <span className="flex items-center gap-2 text-text-soft">
                          <Icon name="map-pin" size={15} className="text-gold" />
                          {row.label}
                        </span>
                        <span className="text-right font-medium text-text">
                          {row.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {/* ─────────── На что обратить внимание ─────────── */}
            <section>
              <BlockHead
                eyebrow="Прозрачность"
                title="На что обратить внимание"
                subtitle="Мы показываем не только сильные стороны. Эти моменты стоит проверить с брокером до сделки."
              />
              <ul className="space-y-3">
                {p.risks.map((risk, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
                      <Icon name="minus" size={13} />
                    </span>
                    <span className="text-sm leading-snug text-text-soft">
                      {risk}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ─────────── Расположение / карта ─────────── */}
            <section>
              <BlockHead
                eyebrow="Локация"
                title="Расположение объекта"
                subtitle={
                  near
                    ? "Объект и ближайшие места из 2ГИС — по реальным координатам. Нажмите на пин, чтобы открыть место в 2ГИС."
                    : undefined
                }
              />
              {near && p.coords ? (
                <PropertyMap
                  lat={p.coords.lat}
                  lng={p.coords.lng}
                  pins={near.pins}
                  radiusM={near.radiusM}
                  address={p.address}
                />
              ) : (
              <div className="relative h-72 overflow-hidden rounded-3xl border border-line bg-surface-3 shadow-soft sm:h-80">
                {/* сетка «карты» */}
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(18,23,28,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,23,28,0.06) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                  }}
                />
                {/* условные «магистрали» */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(115deg, transparent 46%, rgba(185,139,62,0.20) 46%, rgba(185,139,62,0.20) 48%, transparent 48%), linear-gradient(25deg, transparent 62%, rgba(18,23,28,0.08) 62%, rgba(18,23,28,0.08) 63.5%, transparent 63.5%)",
                  }}
                />
                {/* пин */}
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white shadow-glow ring-4 ring-white/70">
                    <Icon name="map-pin" size={22} />
                  </span>
                </div>
                {/* карточка адреса */}
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-ink/15 to-transparent p-4 sm:p-5">
                  <div className="rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-soft backdrop-blur">
                    <div className="text-sm font-semibold text-text">
                      {p.address}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted">
                      {p.district}, {p.city}
                      {p.coords && (
                        <>
                          {" · "}
                          {p.coords.lat.toFixed(4)}, {p.coords.lng.toFixed(4)}
                        </>
                      )}
                    </div>
                  </div>
                  {p.coords && (
                    <Button
                      href={`https://www.google.com/maps?q=${p.coords.lat},${p.coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                      iconRight="arrow-up-right"
                    >
                      Показать на карте
                    </Button>
                  )}
                </div>
              </div>
              )}
            </section>

            {/* ─────────── Брокер объекта ─────────── */}
            {broker && (
              <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
                <div className="eyebrow mb-5">Брокер объекта</div>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-4">
                    <Avatar name={broker.name} tone={broker.photoTone} size="xl" />
                    <div>
                      <h3 className="font-display text-xl text-text">
                        {broker.name}
                      </h3>
                      <p className="mt-1 max-w-xs text-sm leading-snug text-text-soft">
                        {broker.title}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-sm">
                        <Icon
                          name="star"
                          size={15}
                          className="fill-gold text-gold"
                        />
                        <span className="font-semibold text-text">
                          {broker.rating.toFixed(1)}
                        </span>
                        <span className="text-text-muted">
                          · {broker.reviews} отзывов · {broker.dealsClosed} сделок
                        </span>
                      </div>
                      <Link
                        href={`/brokers/${broker.slug}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-ink"
                      >
                        Профиль брокера
                        <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                  </div>
                  <div className="sm:ml-auto">
                    <BookingCtas broker={broker} />
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ═══════════ STICKY-САЙДБАР ═══════════ */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Цена + CTA */}
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-lift">
              <div className="text-xs uppercase tracking-wide text-text-muted">
                Цена объекта
              </div>
              <div className="mt-1 font-display text-3xl leading-none text-text">
                {formatPrice(p.price)}
              </div>
              <div className="mt-1.5 text-sm text-text-muted">
                {pricePerUnit(p.price, p.area, p.areaUnit)}
              </div>
              {(p.installment || p.exchange) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.installment && (
                    <Badge tone="gold" icon="check">
                      Рассрочка
                    </Badge>
                  )}
                  {p.exchange && <Badge tone="neutral">Обмен</Badge>}
                </div>
              )}
              {broker && (
                <div className="mt-5">
                  <BookingCtas broker={broker} stacked />
                </div>
              )}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
                <Icon name="shield" size={13} className="text-emerald" />
                Объект проверен брокером MULK
              </div>
            </div>

            {/* Мини-блок брокера */}
            {broker && (
              <Link
                href={`/brokers/${broker.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Avatar name={broker.name} tone={broker.photoTone} size="md" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text group-hover:text-gold">
                    {broker.name}
                  </div>
                  <div className="truncate text-xs text-text-muted">
                    {broker.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs">
                    <Icon name="star" size={12} className="fill-gold text-gold" />
                    <span className="font-semibold text-text">
                      {broker.rating.toFixed(1)}
                    </span>
                    <span className="text-text-muted">· {broker.reviews}</span>
                  </div>
                </div>
                <Icon
                  name="chevron-right"
                  size={18}
                  className="ml-auto text-text-muted transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            )}

            {/* Форма заявки */}
            <div id="lead" className="scroll-mt-24">
              <LeadForm
                title="Получить полный анализ объекта"
                subtitle="Пришлём документы, ответим на вопросы и организуем просмотр — онлайн или лично."
                cta="Запросить анализ"
                context={p.title}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* ═══════════ Похожие объекты ═══════════ */}
      {similar.length > 0 && (
        <Section className="border-t border-line bg-surface">
          <SectionHeading
            eyebrow="Подборка"
            title="Похожие объекты"
            subtitle="Близкие по категории, району и бюджету — с той же прозрачностью и AI-оценкой."
            link={{ label: "Весь каталог", href: "/catalog" }}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} property={s} />
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}

/** Заголовок смыслового блока: eyebrow + серифный подзаголовок. */
function BlockHead({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
}: {
  eyebrow?: string;
  eyebrowIcon?: IconName;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="eyebrow mb-2">
          {eyebrowIcon && <Icon name={eyebrowIcon} size={14} />}
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl leading-tight text-text sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-soft">
          {subtitle}
        </p>
      )}
    </div>
  );
}
