import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brokers, getBroker } from "@/lib/data/brokers";
import { propertiesByBroker } from "@/lib/data/properties";
import { pluralize } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { PropertyCard } from "@/components/PropertyCard";
import { LeadForm } from "@/components/LeadForm";

export function generateStaticParams() {
  return brokers.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBroker(slug);
  if (!b) return { title: "Брокер не найден" };
  return {
    title: `${b.name} — ${b.title}`,
    description: `${b.name}: ${b.title}. Рейтинг ${b.rating.toFixed(1)}, ${b.reviews} отзывов, ${b.dealsClosed} закрытых сделок. Персональный брокер MULK — подбор, проверка документов и сопровождение до сделки.`,
  };
}

const objForms: [string, string, string] = ["объект", "объекта", "объектов"];
const reviewForms: [string, string, string] = ["отзыв", "отзыва", "отзывов"];

/** 5 звёзд, заполненных до округлённого рейтинга. */
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={15}
          className={i < full ? "fill-gold text-gold" : "text-line-strong"}
        />
      ))}
    </span>
  );
}

export default async function BrokerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBroker(slug);
  if (!b) notFound();

  const listings = propertiesByBroker(b.id);
  const whatsappHref = `https://wa.me/${b.whatsapp.replace(/\D/g, "")}`;

  const stats: { value: string; label: string }[] = [
    { value: String(b.dealsClosed), label: "закрытых сделок" },
    { value: String(b.activeListings), label: "объектов в продаже" },
    { value: `${b.avgDaysToSell} дн.`, label: "средний срок продажи" },
    {
      value: String(b.reviews),
      label: pluralize(b.reviews, reviewForms),
    },
  ];

  return (
    <>
      {/* ─────────────────────────── ПРОФИЛЬ ─────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="container py-10 sm:py-14">
          <Link
            href="/brokers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-gold"
          >
            <Icon name="arrow-right" size={15} className="rotate-180" />
            Все брокеры
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            {/* Левая колонка — личность и bio */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <Avatar name={b.name} tone={b.photoTone} size="xl" />
                  {b.hasVideo && (
                    <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white ring-4 ring-surface">
                      <Icon name="play" size={14} />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="font-display text-3xl leading-tight text-text sm:text-4xl">
                    {b.name}
                  </h1>
                  <p className="mt-1.5 text-[15px] text-text-soft">{b.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
                    <Stars rating={b.rating} />
                    <span className="font-semibold text-text">
                      {b.rating.toFixed(1)}
                    </span>
                    <span className="text-text-muted">
                      · {b.reviews} {pluralize(b.reviews, reviewForms)}
                    </span>
                  </div>
                </div>
              </div>

              {b.badges.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {b.badges.map((badge) => (
                    <Badge key={badge} tone="gold" icon="sparkles">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <div className="eyebrow mb-2">Специализация</div>
                  <div className="flex flex-wrap gap-1.5">
                    {b.specialties.map((s) => (
                      <Badge key={s} tone="neutral">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="eyebrow mb-2">Языки</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-soft">
                    {b.languages.map((lang) => (
                      <span key={lang} className="inline-flex items-center gap-1.5">
                        <Icon name="globe" size={14} className="text-gold" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-text-soft">
                {b.bio}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="#zayavka" variant="primary" iconRight="arrow-right">
                  Подобрать объект через брокера
                </Button>
                <Button href="/sell" variant="outline">
                  Хочу, чтобы он продал мой объект
                </Button>
              </div>
            </div>

            {/* Правая колонка — карточка статистики и контактов */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-surface-2 p-6 shadow-soft">
                <div className="text-sm font-semibold text-text">
                  Показатели брокера
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-line bg-surface p-4"
                    >
                      <div className="font-display text-2xl leading-none text-text">
                        {s.value}
                      </div>
                      <div className="mt-1.5 text-xs leading-snug text-text-muted">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2.5 border-t border-line pt-5">
                  <Button
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="dark"
                    icon="chat"
                    className="w-full"
                  >
                    Написать в WhatsApp
                  </Button>
                  <Button
                    href={`tel:${b.phone}`}
                    variant="outline"
                    icon="phone"
                    className="w-full"
                  >
                    {b.phone}
                  </Button>
                </div>

                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-text-muted">
                  <Icon
                    name="shield"
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald"
                  />
                  Персональный брокер MULK: подбор, проверка документов и
                  сопровождение до сделки.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ──────────────────────── ОБЪЕКТЫ БРОКЕРА ──────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Портфель"
          title="Объекты брокера"
          subtitle={
            listings.length > 0
              ? `${listings.length} ${pluralize(listings.length, objForms)} в работе — каждый проверен и упакован лично.`
              : "Сейчас активных объектов в публичной витрине нет — напишите брокеру, и он подберёт вариант под запрос."
          }
          link={{ label: "Весь каталог", href: "/catalog" }}
        />
        {listings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-wash text-gold">
              <Icon name="wand" size={24} />
            </span>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-soft">
              У {b.name.split(" ")[0]} сейчас нет объектов в открытой витрине.
              Оставьте заявку — брокер подберёт варианты под ваш бюджет и задачу.
            </p>
            <Button
              href="#zayavka"
              variant="primary"
              size="sm"
              className="mt-5"
              iconRight="arrow-right"
            >
              Оставить заявку
            </Button>
          </div>
        )}
      </Section>

      {/* ─────────────────────────── ЗАЯВКА ─────────────────────────── */}
      <Section dark id="zayavka">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="eyebrow">Персональный запрос</div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text-invert sm:text-[2.4rem]">
              Связаться с {b.name.split(" ")[0]}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Опишите, что ищете или что хотите продать. {b.name.split(" ")[0]}{" "}
              разберёт запрос, предложит 3–5 вариантов и проведёт сделку от
              первого показа до ключей.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                icon="chat"
              >
                Написать в WhatsApp
              </Button>
              <Button href={`tel:${b.phone}`} variant="gold-outline" icon="phone">
                {b.phone}
              </Button>
            </div>
          </div>

          <LeadForm
            dark
            title={`Заявка брокеру ${b.name}`}
            subtitle="Оставьте контакты — брокер свяжется с вами лично."
            cta="Отправить брокеру"
            context={"Брокер: " + b.name}
          />
        </div>
      </Section>
    </>
  );
}
