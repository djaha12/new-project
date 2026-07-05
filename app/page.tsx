import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import {
  properties,
  featured,
  premiumProperties,
  foreignProperties,
} from "@/lib/data/properties";
import { brokers } from "@/lib/data/brokers";
import { districts } from "@/lib/data/districts";
import { abroadDirections, sellPlans } from "@/lib/data/abroad";
import { AI_DISCLAIMER } from "@/lib/ai";
import { cn, formatPrice, pluralize } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PropertyCard } from "@/components/PropertyCard";
import { BrokerCard } from "@/components/BrokerCard";
import { Hero } from "@/components/home/Hero";
import { FindAssistant } from "@/components/ai/FindAssistant";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline} в ${site.city}` },
  description: site.description,
};

const objForms: [string, string, string] = ["объект", "объекта", "объектов"];

export default function HomePage() {
  const count = (pred: (p: (typeof properties)[number]) => boolean) =>
    properties.filter(pred).length;

  const heroStats: { key: "verified" | "brokers" | "ai" | "fees"; icon: IconName; value: string }[] = [
    { key: "verified", icon: "shield", value: String(properties.length) },
    { key: "brokers", icon: "users", value: String(brokers.length) },
    { key: "ai", icon: "sparkles", value: "AI" },
    { key: "fees", icon: "scale", value: "0" },
  ];

  const tiles: {
    label: string;
    icon: IconName;
    href: string;
    n: number;
    gold?: boolean;
  }[] = [
    { label: "Квартиры", icon: "building", href: "/catalog?category=apartment", n: count((p) => p.category === "apartment") },
    { label: "Дома", icon: "home", href: "/catalog?category=house", n: count((p) => p.category === "house") },
    { label: "Участки", icon: "tree", href: "/catalog?category=land", n: count((p) => p.category === "land") },
    { label: "Коммерция", icon: "store", href: "/catalog?category=commercial", n: count((p) => p.category === "commercial") },
    { label: "Премиум", icon: "sparkles", href: "/premium", n: premiumProperties().length, gold: true },
    { label: "Зарубежье", icon: "globe", href: "/abroad", n: foreignProperties().length },
    { label: "Иссык-Куль", icon: "sun", href: "/catalog?district=issyk-kul", n: count((p) => p.district === "Иссык-Куль") },
    { label: "Инвестиции", icon: "trending", href: "/catalog?tier=investment", n: count((p) => p.tier === "investment"), gold: true },
  ];

  const aiFeatures: { icon: IconName; title: string; desc: string }[] = [
    { icon: "shield", title: "Property Score", desc: "Оценка ликвидности, документов, локации и рисков — 0–10 по каждому объекту." },
    { icon: "wand", title: "Подбор словами", desc: "Опишите, что ищете, как брокеру — AI предложит подходящие объекты из каталога." },
    { icon: "scale", title: "Риски и потенциал", desc: "AI подсвечивает, на что смотреть до сделки и что можно построить или улучшить." },
  ];

  const whyItems: { icon: IconName; title: string; desc: string }[] = [
    { icon: "shield", title: "Проверенные объекты", desc: "Документы, собственник и цена проверяются до публикации. Никаких фейков и «уже продано»." },
    { icon: "users", title: "Профессиональные брокеры", desc: "Каждый объект ведёт брокер-эксперт по своему сегменту: земля, элитка, коммерция, зарубежье." },
    { icon: "sparkles", title: "AI-анализ объекта", desc: "Property Score, риски, потенциал и сравнение с рынком — понятная аналитика перед сделкой." },
    { icon: "video", title: "Медиа-продажа", desc: "Видеообзоры, продающая упаковка и продвижение в соцсетях — объект показан с лучшей стороны." },
  ];

  const sellBullets = [
    "Проверка документов и оценка объекта по рынку",
    "AI-анализ и Property Score с сильными сторонами",
    "Видеообзор и премиальная медиа-упаковка",
    "Показы проверенным покупателям и сопровождение до сделки",
  ];

  const ctaBullets = [
    "Ответим и подберём варианты в течение 15 минут",
    "Только проверенные объекты и честные цены",
    "AI-аналитика и брокер на каждом этапе сделки",
  ];

  return (
    <>
      {/* ─────────────────────────── HERO (i18n) ─────────────────────────── */}
      <Hero stats={heroStats} />

      {/* ────────────────────── БЫСТРЫЕ КАТЕГОРИИ ────────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Разделы каталога"
          title="Что вы ищете?"
          subtitle="Выберите категорию — покажем проверенные объекты с AI-анализом и брокером."
        />
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {tiles.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    t.gold ? "bg-ink text-gold-bright" : "bg-gold-wash text-gold",
                  )}
                >
                  <Icon name={t.icon} size={20} />
                </span>
                <Icon
                  name="arrow-up-right"
                  size={16}
                  className="text-text-muted transition-colors group-hover:text-gold"
                />
              </div>
              <div className="mt-8">
                <div className="font-display text-lg text-text">{t.label}</div>
                <div className="mt-0.5 text-xs text-text-muted">
                  {t.n} {pluralize(t.n, objForms)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ─────────────────────── ОБЪЕКТЫ НЕДЕЛИ ─────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Витрина недели"
          title="Объекты недели"
          subtitle="Отобранные брокерами объекты с сильной ценой, чистыми документами и потенциалом."
          link={{ label: "Весь каталог", href: "/catalog" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured(6).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </Section>

      {/* ───────────────────────── AI-ПОДБОР ───────────────────────── */}
      <Section dark>
        <SectionHeading
          dark
          eyebrow="AI-анализ недвижимости"
          title={
            <>
              Опишите словами —{" "}
              <span className="text-gold-bright">AI подберёт объект</span>
            </>
          }
          subtitle="Не нужно листать сотни объявлений. Расскажите, что ищете, — а мы покажем подходящее и объясним почему."
        />

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {aiFeatures.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold-bright">
                <Icon name={f.icon} size={18} />
              </span>
              <div className="mt-3 font-semibold text-text-invert">{f.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>

        <FindAssistant compact />

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-white/40">
          {AI_DISCLAIMER}
        </p>
      </Section>

      {/* ────────────────────────── БРОКЕРЫ ────────────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Команда MULK"
          title="Брокеры, которые ведут сделку"
          subtitle="Эксперты по сегментам: земля, элитка, коммерция, курорт и зарубежье."
          link={{ label: "Все брокеры", href: "/brokers" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brokers.slice(0, 3).map((b) => (
            <BrokerCard key={b.id} broker={b} />
          ))}
        </div>
      </Section>

      {/* ────────────────────── ПРЕМИУМ-ТИЗЕР ────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Premium & Elite"
          title="Объекты премиум-класса"
          subtitle="Видовые квартиры, коттеджи и статусные адреса для жизни и сохранения капитала."
          link={{ label: "Премиум-витрина", href: "/premium" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {premiumProperties()
            .slice(0, 3)
            .map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
        </div>
      </Section>

      {/* ─────────────────── ПРОДАТЬ ОБЪЕКТ (CTA) ─────────────────── */}
      <Section className="bg-gold-wash">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Продавцам</div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Продайте объект как инвесткейс
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-soft">
              Профессиональное описание, AI-анализ, видеообзор и продвижение. Ваш
              объект видят как продукт, а не как строку в ленте объявлений.
            </p>
            <ul className="mt-6 space-y-2.5">
              {sellBullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-text-soft">
                  <span className="mt-0.5 shrink-0 text-emerald">
                    <Icon name="check-circle" size={18} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/sell" variant="dark" iconRight="arrow-right">
                Продать с MULK
              </Button>
              <Button href="/sell" variant="outline">
                Тарифы упаковки
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-surface p-6 shadow-soft">
            <div className="text-sm font-semibold text-text">
              Тарифы упаковки объекта
            </div>
            <div className="mt-4 divide-y divide-line">
              {sellPlans.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text">{plan.name}</span>
                      {plan.featured && <Badge tone="gold">Популярный</Badge>}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted">
                      {plan.tagline}
                    </div>
                  </div>
                  <div className="whitespace-nowrap font-display text-lg text-gold">
                    {plan.priceLabel}
                  </div>
                </div>
              ))}
            </div>
            <Button
              href="/sell"
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              iconRight="arrow-right"
            >
              Все тарифы и условия
            </Button>
          </div>
        </div>
      </Section>

      {/* ────────────────────────── РАЙОНЫ ────────────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="География"
          title="Районы и направления"
          subtitle="От Золотого квадрата до Иссык-Куля — где покупают для жизни и во что вкладывают."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <Link
              key={d.slug}
              href={`/catalog?district=${d.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl text-text transition-colors group-hover:text-gold">
                  {d.name}
                </h3>
                <span className="whitespace-nowrap text-xs font-semibold text-gold">
                  от {formatPrice(d.priceFromUsd)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">{d.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {d.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                Смотреть объекты
                <Icon
                  name="arrow-right"
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ──────────────────── ЗАРУБЕЖЬЕ-ТИЗЕР ──────────────────── */}
      <Section dark>
        <SectionHeading
          dark
          eyebrow="Зарубежная недвижимость"
          title="Инвестиции за рубежом"
          subtitle="Кураторские направления с понятной доходностью и сопровождением сделки на русском языке."
          link={{ label: "Все направления", href: "/abroad" }}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {abroadDirections.slice(0, 2).map((d) => (
            <Link
              key={d.id}
              href="/abroad"
              className="group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl leading-none" aria-hidden="true">
                  {d.flag}
                </span>
                <Badge tone="glass">{d.country}</Badge>
              </div>
              <h3 className="mt-4 font-display text-2xl text-text-invert">{d.title}</h3>
              <div className="text-sm text-white/50">{d.city}</div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{d.blurb}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/80">
                <Icon name="trending" size={14} className="text-gold-bright" />
                {d.yieldNote}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/60">
                  от {formatPrice(d.priceFromUsd)}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-bright">
                  Смотреть направление
                  <Icon
                    name="arrow-right"
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ──────────────────────── ПОЧЕМУ MULK ──────────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Почему MULK"
          title="Не витрина объявлений, а брокерская работа"
          subtitle="Четыре принципа, которые отличают нас от досок объявлений."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-line bg-surface-2 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-wash text-gold">
                <Icon name={w.icon} size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg text-text">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">{w.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────────────── ФИНАЛЬНЫЙ CTA ───────────────────── */}
      <Section className="bg-surface-2">
        <div className="relative isolate overflow-hidden rounded-3xl bg-ink text-text-invert">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="eyebrow">Начнём</div>
              <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text-invert sm:text-[2.4rem]">
                Готовы купить или продать недвижимость?
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Оставьте заявку — брокер MULK подберёт объекты под ваш запрос,
                проверит документы и проведёт сделку от первого показа до ключей.
              </p>
              <ul className="mt-6 space-y-2.5">
                {ctaBullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm text-white/80"
                  >
                    <span className="mt-0.5 shrink-0 text-gold-bright">
                      <Icon name="check-circle" size={18} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  icon="chat"
                >
                  Написать в WhatsApp
                </Button>
                <Button href={`tel:${site.phone}`} variant="gold-outline" icon="phone">
                  {site.phone}
                </Button>
              </div>
            </div>

            <LeadForm
              dark
              title="Оставьте заявку"
              subtitle="Купить, продать или получить консультацию — брокер MULK на связи."
              context="Заявка с главной страницы MULK"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
