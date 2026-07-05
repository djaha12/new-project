import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { abroadDirections, getAbroad } from "@/lib/data/abroad";
import { getBroker } from "@/lib/data/brokers";
import { foreignProperties } from "@/lib/data/properties";
import { formatPrice } from "@/lib/utils";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { PropertyCard } from "@/components/PropertyCard";
import { LeadForm } from "@/components/LeadForm";

export function generateStaticParams() {
  return abroadDirections.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dir = getAbroad(slug);
  if (!dir) return { title: "Направление не найдено" };
  return {
    title: `${dir.title} — недвижимость в ${dir.city}`,
    description: dir.blurb,
  };
}

export default async function AbroadDirectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dir = getAbroad(slug);
  if (!dir) notFound();

  const broker = getBroker("dana-niyazbekova");
  const objects = foreignProperties().filter((p) => p.country === dir.country);
  const whatsappHref = broker
    ? `https://wa.me/${broker.whatsapp.replace(/\D/g, "")}`
    : "#";

  const facts: { label: string; value: string }[] = [
    { label: "Страна", value: dir.country },
    { label: "Город", value: dir.city },
    { label: "Порог входа", value: `от ${formatPrice(dir.priceFromUsd)}` },
    { label: "Логика дохода", value: dir.yieldNote },
  ];

  return (
    <article className="bg-surface-2">
      {/* ─────────── Хлебные крошки ─────────── */}
      <nav aria-label="Хлебные крошки" className="border-b border-line bg-surface">
        <div className="container flex flex-wrap items-center gap-1.5 py-4 text-sm text-text-muted">
          <Link href="/abroad" className="hover:text-gold">
            Зарубежье
          </Link>
          <Icon name="chevron-right" size={14} className="text-line-strong" />
          <span className="text-text">
            {dir.city}, {dir.country}
          </span>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="border-b border-line bg-surface">
        <div className="container py-12 lg:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-4xl shadow-soft ring-1 ring-line">
                  {dir.flag}
                </span>
                <div className="flex flex-col gap-2">
                  <Badge tone="neutral" icon="map-pin">
                    {dir.city}, {dir.country}
                  </Badge>
                  <Badge tone="gold" icon="trending">
                    {dir.yieldNote}
                  </Badge>
                </div>
              </div>

              <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.06] text-text sm:text-5xl">
                {dir.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-soft sm:text-lg">
                {dir.blurb}
              </p>

              <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-text-muted">
                    Порог входа
                  </div>
                  <div className="font-display text-3xl leading-none text-text sm:text-4xl">
                    от {formatPrice(dir.priceFromUsd)}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#lead" variant="primary" iconRight="arrow-right">
                  Получить подбор
                </Button>
                <Button
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  icon="chat"
                >
                  Спросить брокера
                </Button>
              </div>
            </div>

            {/* Панель фактов */}
            <aside className="rounded-3xl border border-line bg-surface-2 p-6 shadow-soft lg:sticky lg:top-24">
              <div className="eyebrow mb-4">
                <Icon name="globe" size={14} />
                Кратко о направлении
              </div>
              <dl className="divide-y divide-line">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <dt className="text-sm text-text-muted">{f.label}</dt>
                    <dd className="text-right text-sm font-medium text-text">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-surface px-3 py-2.5 text-xs text-text-muted">
                <Icon name="shield" size={13} className="text-emerald" />
                Сделка под сопровождением брокера MULK
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────── ЧТО ВХОДИТ + СТРАТЕГИЯ ─────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Что вы получаете"
          title="Что входит в направление"
          subtitle="Не абстрактные обещания, а конкретные условия, на которых мы ведём это направление."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {dir.points.map((pt) => (
            <li
              key={pt}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                <Icon name="check" size={14} />
              </span>
              <span className="text-sm font-medium leading-snug text-text">
                {pt}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-3xl border-l-4 border-gold bg-surface p-7 shadow-soft sm:p-9">
          <div className="eyebrow">
            <Icon name="wand" size={14} />
            Стратегия направления
          </div>
          <p className="mt-3 max-w-3xl font-display text-xl leading-snug text-text sm:text-2xl sm:leading-snug">
            {dir.strategy}
          </p>
        </div>
      </Section>

      {/* ─────────── ОБЪЕКТЫ НАПРАВЛЕНИЯ ─────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Объекты направления"
          title={`Недвижимость в ${dir.city}`}
          subtitle={
            objects.length > 0
              ? "Проверенные объекты по направлению — с AI-анализом и брокером, как и в основном каталоге MULK."
              : undefined
          }
          link={
            objects.length > 0
              ? { label: "Весь каталог", href: "/catalog" }
              : undefined
          }
        />

        {objects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {objects.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-surface-2 p-10 text-center sm:p-14">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-wash text-gold">
              <Icon name="wand" size={24} />
            </span>
            <h3 className="mt-5 font-display text-2xl text-text">
              Объекты подбираем под ваш запрос
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-text-soft">
              По направлению «{dir.title}» мы работаем адресно: под ваш бюджет и
              цель брокер подберёт актуальные варианты от проверенных
              застройщиков и партнёров в {dir.city}.
            </p>
            <div className="mt-6">
              <Button href="#lead" variant="primary" iconRight="arrow-right">
                Запросить подбор объектов
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
                Ваш брокер по направлению
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
                <Button
                  href={`/brokers/${broker.slug}`}
                  variant="gold-outline"
                  iconRight="arrow-right"
                >
                  Профиль брокера
                </Button>
              </div>
            </div>
          )}

          <div id="lead" className="scroll-mt-24">
            <LeadForm
              dark
              title={`Заявка · ${dir.title}`}
              subtitle={`Расскажите о бюджете и цели — подберём объекты в ${dir.city} и проведём сделку под ключ.`}
              cta="Получить подбор"
              context={`Зарубежье · ${dir.title}, ${dir.city}`}
            />
          </div>
        </div>
      </Section>
    </article>
  );
}
