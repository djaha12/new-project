import type { Metadata } from "next";
import Link from "next/link";

import { districts } from "@/lib/data/districts";
import { properties } from "@/lib/data/properties";
import { formatPrice, pluralize } from "@/lib/utils";
import type { District } from "@/lib/types";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Районы Бишкека и региона — гид по локациям",
  description:
    "Куда вложиться и где жить: гиды по районам Бишкека, загородной зоне и Иссык-Кулю. Ценовой индекс $/м², порог входа, кому подходит район, плюсы и минусы, реальная инфраструктура по данным 2ГИС и объекты MULK.",
};

/** Сколько объектов MULK привязано к каждому району — для витрины на карточке. */
function objectsInDistrict(name: string): number {
  return properties.filter((p) => p.district === name).length;
}

export default function DistrictsPage() {
  const minEntry = Math.min(...districts.map((d) => d.priceFromUsd));
  const covered = districts.filter((d) => d.coords).length;

  const heroStats: { icon: IconName; value: string; label: string }[] = [
    {
      icon: "map-pin",
      value: String(districts.length),
      label: pluralize(districts.length, ["район", "района", "районов"]),
    },
    {
      icon: "trending",
      value: `от ${formatPrice(minEntry)}`,
      label: "порог входа",
    },
    {
      icon: "shield",
      value: String(covered),
      label: "с данными 2ГИС",
    },
    {
      icon: "wand",
      value: "AI",
      label: "подбор под задачу",
    },
  ];

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-line bg-surface">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold/5 blur-3xl" />
        <div className="container py-16 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <div className="eyebrow mb-4">
              <Icon name="map-pin" size={14} />
              Гид по локациям
            </div>
            <h1 className="text-balance font-display text-4xl leading-[1.05] text-text sm:text-5xl lg:text-[3.5rem]">
              Районы Бишкека и региона
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-text-soft sm:text-lg">
              Локация решает всё: ликвидность, доходность аренды и то, как вы
              будете жить каждый день. Мы собрали честные гиды по районам — с
              ценовым индексом, порогом входа, плюсами и минусами и реальной
              инфраструктурой по данным 2ГИС. Выберите район, а не случайный
              адрес.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              {districts.map((d) => (
                <Link
                  key={d.slug}
                  href={`/districts/${d.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-text-soft shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:text-text"
                >
                  <Icon name="map-pin" size={13} className="text-gold" />
                  {d.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            {heroStats.map((s, i) => (
              <div
                key={s.label}
                className={
                  "flex items-center gap-3" +
                  (i > 0 ? " sm:border-l sm:border-line sm:pl-8" : "")
                }
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-wash text-gold">
                  <Icon name={s.icon} size={17} />
                </span>
                <div>
                  <div className="font-display text-xl leading-none text-text">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-text-muted">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── СЕТКА РАЙОНОВ ──────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Все локации"
          title="Выберите район"
          subtitle="Каждый гид — это стратегия: где растёт цена, где стабильная аренда, а где свой дом за городом. Откройте карточку, чтобы увидеть индекс цен, инфраструктуру и объекты."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <DistrictCard key={d.slug} district={d} />
          ))}
        </div>
      </Section>

      {/* ──────────────────────── ФИНАЛЬНЫЙ CTA ──────────────────────── */}
      <Section dark>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="eyebrow text-gold-bright">
            <Icon name="wand" size={14} />
            Не знаете, какой район ваш?
          </div>
          <h2 className="mt-4 font-display text-3xl leading-tight text-text-invert sm:text-4xl">
            Подберём район под вашу задачу
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            Расскажите о бюджете и цели — жить, сдавать или сохранить капитал.
            Брокер MULK или AI-подбор сузят выбор до двух-трёх районов и
            конкретных объектов.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href="/ai" variant="primary" icon="wand">
              AI-подбор района
            </Button>
            <Button href="/catalog" variant="gold-outline" iconRight="arrow-right">
              Смотреть каталог
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

/** Карточка района для сетки на витрине. */
function DistrictCard({ district: d }: { district: District }) {
  const perM2 = d.pricePerM2.toLocaleString("ru-RU").replace(/,/g, " ");
  const count = objectsInDistrict(d.name);

  return (
    <Link
      href={`/districts/${d.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line bg-surface-2 p-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-gold">
            <Icon name="map-pin" size={16} />
            <span className="text-xs uppercase tracking-wide text-text-muted">
              Район
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl leading-tight text-text group-hover:text-gold">
            {d.name}
          </h3>
        </div>
        <Badge tone="gold" icon="ruler">
          {perM2} $/м²
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-text-soft">{d.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {d.tags.map((t) => (
            <Badge key={t} tone="neutral">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-text-muted">
              Порог входа
            </div>
            <div className="font-display text-lg leading-none text-text">
              от {formatPrice(d.priceFromUsd)}
            </div>
            {count > 0 && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald">
                <Icon name="home" size={11} />
                {count} {pluralize(count, ["объект", "объекта", "объектов"])} в
                продаже
              </div>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold">
            Открыть гид
            <Icon
              name="arrow-right"
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
