import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { districts, getDistrict } from "@/lib/data/districts";
import { properties } from "@/lib/data/properties";
import { getBroker } from "@/lib/data/brokers";
import { nearby } from "@/lib/poi";
import { formatPrice, pluralize } from "@/lib/utils";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { PropertyCard } from "@/components/PropertyCard";
import { NearbyInfra } from "@/components/property/NearbyInfra";
import { LeadForm } from "@/components/LeadForm";

/** Профильный брокер локации — для персонального CTA гида. */
const BROKER_BY_SLUG: Record<string, string> = {
  "issyk-kul": "elina-mamytova",
  "baytik-koytash": "azamat-osmonov",
  "vostok-5": "ruslan-jeenbekov",
};
const DEFAULT_BROKER = "aisha-toktosunova";

export function generateStaticParams() {
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDistrict(slug);
  if (!d) return { title: "Район не найден" };
  return {
    title: `${d.name} — гид по району, цены и объекты`,
    description: d.vibe ?? d.blurb,
  };
}

export default async function DistrictGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDistrict(slug);
  if (!d) notFound();

  const perM2 = d.pricePerM2.toLocaleString("ru-RU").replace(/,/g, " ");
  const objects = properties.filter((p) => p.district === d.name);
  const near = d.coords ? nearby(d.coords.lat, d.coords.lng, 1500) : null;

  const broker = getBroker(BROKER_BY_SLUG[d.slug] ?? DEFAULT_BROKER);
  const whatsappHref = broker
    ? `https://wa.me/${broker.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <article className="bg-surface-2">
      {/* ─────────── Хлебные крошки ─────────── */}
      <nav aria-label="Хлебные крошки" className="border-b border-line bg-surface">
        <div className="container flex flex-wrap items-center gap-1.5 py-4 text-sm text-text-muted">
          <Link href="/districts" className="hover:text-gold">
            Районы
          </Link>
          <Icon name="chevron-right" size={14} className="text-line-strong" />
          <span className="text-text">{d.name}</span>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="relative isolate overflow-hidden border-b border-line bg-surface">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold/5 blur-3xl" />
        <div className="container py-12 lg:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold" icon="map-pin">
                  Гид по району
                </Badge>
                {d.tags.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.06] text-text sm:text-5xl">
                {d.name}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-soft sm:text-lg">
                {d.vibe ?? d.blurb}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="#objects" variant="primary" iconRight="arrow-right">
                  Объекты района
                </Button>
                <Button href="#lead" variant="outline" icon="chat">
                  Спросить брокера
                </Button>
              </div>
            </div>

            {/* Индекс цен */}
            <aside className="rounded-3xl border border-line bg-surface-2 p-6 shadow-soft lg:sticky lg:top-24">
              <div className="eyebrow mb-4">
                <Icon name="trending" size={14} />
                Ценовой индекс
              </div>
              <dl className="divide-y divide-line">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-text-muted">Цена за м²</dt>
                  <dd className="font-display text-2xl leading-none text-text">
                    {perM2} <span className="text-base text-text-muted">$/м²</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-text-muted">Порог входа</dt>
                  <dd className="font-display text-2xl leading-none text-text">
                    от {formatPrice(d.priceFromUsd)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm text-text-muted">Объекты MULK</dt>
                  <dd className="text-sm font-medium text-text">
                    {objects.length > 0
                      ? `${objects.length} ${pluralize(objects.length, [
                          "объект",
                          "объекта",
                          "объектов",
                        ])}`
                      : "под запрос"}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-surface px-3 py-2.5 text-center text-xs text-text-muted">
                <Icon name="shield" size={13} className="text-emerald" />
                Ориентир рынка · уточняется под конкретный объект
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────── КОМУ ПОДХОДИТ ─────────── */}
      {d.goodFor && d.goodFor.length > 0 && (
        <Section className="bg-surface-2">
          <SectionHeading
            eyebrow="Для кого этот район"
            title="Кому подходит"
            subtitle="Локация под задачу: так вы не переплатите за то, что вам не нужно, и не упустите главное."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {d.goodFor.map((g) => (
              <div
                key={g}
                className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 shadow-soft"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-wash text-gold">
                  <Icon name="check-circle" size={18} />
                </span>
                <span className="text-[15px] font-medium leading-snug text-text">
                  {g}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ─────────── ПЛЮСЫ / МИНУСЫ ─────────── */}
      {((d.pros && d.pros.length > 0) || (d.cons && d.cons.length > 0)) && (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow="Честно о районе"
            title="Плюсы и минусы"
            subtitle="Мы показываем обе стороны — премиальный сервис начинается с прозрачности, а не с прикрас."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {d.pros && d.pros.length > 0 && (
              <div className="rounded-3xl border border-line bg-surface-2 p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2 text-emerald">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-soft">
                    <Icon name="check" size={16} />
                  </span>
                  <h3 className="font-display text-xl text-text">Плюсы</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {d.pros.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                        <Icon name="check" size={12} />
                      </span>
                      <span className="text-sm leading-snug text-text-soft">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {d.cons && d.cons.length > 0 && (
              <div className="rounded-3xl border border-line bg-surface-2 p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2 text-danger">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-soft">
                    <Icon name="minus" size={16} />
                  </span>
                  <h3 className="font-display text-xl text-text">
                    На что обратить внимание
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {d.cons.map((c) => (
                    <li key={c} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
                        <Icon name="minus" size={12} />
                      </span>
                      <span className="text-sm leading-snug text-text-soft">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ─────────── РЕАЛЬНАЯ ИНФРАСТРУКТУРА 2ГИС ─────────── */}
      {near && (
        <Section className="bg-surface-2">
          <SectionHeading
            eyebrow="По данным 2ГИС"
            title="Что рядом с районом"
            subtitle="Реальные места вокруг центра района: школы, магазины, кафе, здоровье и сервисы — с расстоянием и пешей доступностью."
          />
          <NearbyInfra data={near} />
        </Section>
      )}

      {/* ─────────── ОБЪЕКТЫ В ЭТОМ РАЙОНЕ ─────────── */}
      <Section id="objects" className="bg-surface">
        <SectionHeading
          eyebrow="Каталог района"
          title={`Объекты в районе «${d.name}»`}
          subtitle={
            objects.length > 0
              ? "Проверенные объекты с AI-анализом и брокером — как и в основном каталоге MULK."
              : undefined
          }
          link={
            objects.length > 0
              ? { label: "Все объекты района", href: `/catalog?district=${d.slug}` }
              : undefined
          }
        />

        {objects.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {objects.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                href={`/catalog?district=${d.slug}`}
                variant="outline"
                iconRight="arrow-right"
              >
                Смотреть все объекты в «{d.name}»
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-surface-2 p-10 text-center sm:p-14">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-wash text-gold">
              <Icon name="wand" size={24} />
            </span>
            <h3 className="mt-5 font-display text-2xl text-text">
              Объекты подбираем под ваш запрос
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-text-soft">
              В районе «{d.name}» мы работаем адресно: под ваш бюджет и цель
              брокер подберёт актуальные варианты, часть которых не публикуется в
              открытом каталоге.
            </p>
            <div className="mt-6">
              <Button href="#lead" variant="primary" iconRight="arrow-right">
                Запросить подбор
              </Button>
            </div>
          </div>
        )}
      </Section>

      {/* ─────────── БРОКЕР + ЗАЯВКА ─────────── */}
      <Section dark>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {broker && (
            <div>
              <div className="eyebrow text-gold-bright">
                <Icon name="users" size={14} />
                Ваш брокер по району
              </div>

              <div className="mt-6 flex items-start gap-5">
                <Avatar name={broker.name} tone={broker.photoTone} size="xl" />
                <div>
                  <h2 className="font-display text-2xl text-text-invert sm:text-3xl">
                    {broker.name}
                  </h2>
                  <p className="mt-1 max-w-xs text-sm leading-snug text-white/70">
                    {broker.title}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Icon name="star" size={15} className="fill-gold text-gold" />
                    <span className="font-semibold text-text-invert">
                      {broker.rating.toFixed(1)}
                    </span>
                    <span className="text-white/60">
                      · {broker.reviews} отзывов · {broker.dealsClosed} сделок
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75">
                {broker.bio}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {broker.specialties.map((s) => (
                  <Badge key={s} tone="glass">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  icon="chat"
                >
                  Написать в WhatsApp
                </Button>
                <Button href="/ai" variant="gold-outline" icon="wand">
                  AI-подбор по району
                </Button>
              </div>
            </div>
          )}

          <div id="lead" className="scroll-mt-24">
            <LeadForm
              dark
              title={`Заявка · ${d.name}`}
              subtitle={`Расскажите о бюджете и цели — подберём объекты в районе «${d.name}» и проведём сделку под ключ.`}
              cta="Получить подбор"
              context={`Район · ${d.name}`}
            />
          </div>
        </div>
      </Section>
    </article>
  );
}
