import type { Metadata } from "next";
import { site } from "@/lib/site";
import { properties, premiumProperties } from "@/lib/data/properties";
import { sellPlans } from "@/lib/data/abroad";
import { CATEGORY_LABELS, TIER_LABELS } from "@/lib/types";
import {
  cn,
  formatArea,
  formatPrice,
  pluralize,
  pricePerUnit,
} from "@/lib/utils";
import { AI_DISCLAIMER, scoreTier } from "@/lib/ai";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CATEGORY_ICON } from "@/components/ui/category";
import { PropertyMedia } from "@/components/PropertyMedia";
import { PropertyCard } from "@/components/PropertyCard";
import { ScoreRing } from "@/components/ScoreRing";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Премиум · Prime & Elite",
  description:
    "Закрытая витрина статусной недвижимости MULK: видовые пентхаусы, коттеджи и курортные объекты уровня Prime и Elite в Бишкеке и на Иссык-Куле. Проверенные объекты, AI-анализ и закрытые продажи для сохранения капитала.",
};

const badgeTone = (tone: "gold" | "emerald" | "muted") =>
  tone === "gold" ? "gold" : tone === "emerald" ? "emerald" : "neutral";

export default function PremiumPage() {
  const premium = premiumProperties();
  const issyk = properties.filter((p) => p.district === "Иссык-Куль");
  const elite = sellPlans.find((p) => p.id === "elite")!;

  const avgScore = (
    premium.reduce((s, p) => s + p.aiScore.overall, 0) / premium.length
  ).toFixed(1);

  const heroStats: { value: string; label: string }[] = [
    {
      value: String(premium.length),
      label: `${pluralize(premium.length, ["объект", "объекта", "объектов"])} Prime · Elite`,
    },
    { value: avgScore, label: "средний Property Score" },
    { value: "0", label: "скрытых комиссий" },
  ];

  const issykPoints: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "sun",
      title: "Курортные локации",
      desc: "Бостери и Чолпон-Ата — премиальные адреса у самого озера с растущим спросом.",
    },
    {
      icon: "trending",
      title: "Доход в сезон",
      desc: "Гостевые дома и посуточная аренда превращают объект в актив, который работает каждое лето.",
    },
    {
      icon: "shield",
      title: "Проверено брокером",
      desc: "Документы, назначение земли и цена подтверждены до первого показа.",
    },
  ];

  const eliteStages: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "globe",
      title: "Отдельный лендинг объекта",
      desc: "Персональная страница с медиа, AI-аналитикой и историей объекта — вне общей ленты.",
    },
    {
      icon: "users",
      title: "Закрытый показ",
      desc: "Только проверенным покупателям, конфиденциально, без публичного объявления.",
    },
    {
      icon: "scale",
      title: "Переговоры",
      desc: "Ведём сделку и защищаем ваш интерес — от первого предложения до подписи.",
    },
    {
      icon: "trending",
      title: "Стратегия продажи",
      desc: "Персональный план: цена, позиционирование и каналы под конкретный объект.",
    },
  ];

  const ctaBullets = [
    "Оценка объекта и стратегия продажи за 24 часа",
    "Показы только проверенным покупателям",
    "Сопровождение сделки и защита интереса собственника",
  ];

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
              Prime · Elite
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-[3.9rem]">
              Статусная недвижимость —{" "}
              <span className="text-gold-bright">
                для жизни и сохранения капитала.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
              Закрытая витрина уровня Prime и Elite: видовые пентхаусы Золотого
              квадрата, коттеджи и курортные объекты у Иссык-Куля. Каждый объект
              проверен, упакован как инвестиционный кейс и сопровождается брокером
              MULK — от закрытого показа до ключей.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#showcase" variant="primary" iconRight="arrow-right">
                Смотреть объекты
              </Button>
              <Button href="#lead" variant="gold-outline" icon="chat">
                Обсудить закрытую продажу
              </Button>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-9">
            {heroStats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex items-baseline gap-3",
                  i > 0 && "sm:border-l sm:border-white/10 sm:pl-10",
                )}
              >
                <div className="font-display text-3xl text-gold-bright sm:text-4xl">
                  {s.value}
                </div>
                <div className="max-w-[8rem] text-xs leading-snug text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── ВИТРИНА PRIME · ELITE (крупно) ──────────────── */}
      <Section id="showcase" className="bg-surface-2">
        <SectionHeading
          eyebrow="Витрина"
          title="Избранные объекты Prime · Elite"
          subtitle="Каждый объект мы упаковываем как инвестиционный кейс: проверенные документы, AI Property Score, сценарий жизни и брокер, который ведёт сделку лично."
        />

        <div>
          {premium.map((p, i) => {
            const flip = i % 2 === 1;
            const st = scoreTier(p.aiScore.overall);
            const location = p.isForeign ? `${p.city}, ${p.country}` : p.district;

            const meta: string[] = [];
            if (p.rooms) meta.push(`${p.rooms}-комн.`);
            meta.push(formatArea(p.area, p.areaUnit));
            if (p.floor && p.floors) meta.push(`${p.floor}/${p.floors} эт.`);
            if (p.category === "house" && p.landArea)
              meta.push(`участок ${p.landArea} сот.`);

            return (
              <div
                key={p.id}
                className={cn(
                  "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
                  i > 0 && "mt-16 sm:mt-24",
                )}
              >
                {/* Медиа */}
                <div className={cn("relative", flip && "lg:order-2")}>
                  <PropertyMedia
                    tone={p.mediaTone}
                    category={p.category}
                    rounded="rounded-3xl"
                    className="aspect-[4/3] shadow-lift"
                  >
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="glass" icon="sparkles">
                          {TIER_LABELS[p.tier]}
                        </Badge>
                        {p.badge && <Badge tone="glass">{p.badge}</Badge>}
                      </div>
                      {p.videoSec && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                          <Icon name="play" size={11} />
                          {p.videoSec}с
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-end p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        <Icon name={CATEGORY_ICON[p.category]} size={13} />
                        {CATEGORY_LABELS[p.category]}
                      </span>
                    </div>
                  </PropertyMedia>

                  {/* Плавающая карточка AI Property Score */}
                  <div className="absolute -bottom-6 right-6 hidden rounded-2xl border border-line bg-surface p-3 text-center shadow-lift lg:block">
                    <ScoreRing value={p.aiScore.overall} size={68} />
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      AI Score
                    </div>
                  </div>
                </div>

                {/* Текст */}
                <div className={cn(flip && "lg:order-1")}>
                  <div className="eyebrow">
                    <Icon name="map-pin" size={13} />
                    {location}
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-text sm:text-[2rem]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-text-soft">
                    {p.hook}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
                    <Icon name="map-pin" size={14} />
                    {p.address}
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {p.reasons.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2.5 text-sm text-text-soft"
                      >
                        <span className="mt-0.5 shrink-0 text-gold">
                          <Icon name="check-circle" size={18} />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Badge tone={badgeTone(st.tone)} icon="shield">
                      {p.aiScore.overall.toFixed(1)} · {st.label}
                    </Badge>
                    {meta.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-text-soft"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-6">
                    <div>
                      <div className="font-display text-3xl text-text sm:text-4xl">
                        {formatPrice(p.price)}
                      </div>
                      <div className="mt-1 text-xs text-text-muted">
                        {pricePerUnit(p.price, p.area, p.areaUnit)}
                        {p.installment ? " · рассрочка" : ""}
                      </div>
                    </div>
                    <Button
                      href={`/property/${p.slug}`}
                      variant="dark"
                      iconRight="arrow-right"
                    >
                      Смотреть объект
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-16 max-w-3xl text-center text-xs leading-relaxed text-text-muted">
          {AI_DISCLAIMER}
        </p>
      </Section>

      {/* ──────────────────── ИССЫК-КУЛЬ PREMIUM ──────────────────── */}
      <Section dark>
        <SectionHeading
          dark
          eyebrow="Курортное направление"
          title="Иссык-Куль Premium"
          subtitle="Премиальная недвижимость у озера: дома и участки под гостевой формат в самых востребованных курортных зонах. Объект для отдыха, который сохраняет и приумножает капитал."
          link={{ label: "Все объекты у озера", href: "/catalog?district=issyk-kul" }}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {issyk.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {issykPoints.map((pt) => (
            <div key={pt.title} className="glass rounded-2xl p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold-bright">
                <Icon name={pt.icon} size={18} />
              </span>
              <div className="mt-3 font-semibold text-text-invert">{pt.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─────────────── ЧТО ВХОДИТ В ELITE-ПРОДАЖУ ─────────────── */}
      <Section className="bg-surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Левая колонка — описание и полный список */}
          <div>
            <div className="eyebrow">{elite.name}</div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Что входит в Elite-продажу
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-soft">
              Для собственников статусных объектов, которым важна не скорость, а
              результат и приватность. {elite.tagline}: отдельная витрина, закрытые
              показы, переговоры и персональная стратегия под ключ.
            </p>

            <ul className="mt-7 space-y-3">
              {elite.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-text-soft"
                >
                  <span className="mt-0.5 shrink-0 text-gold">
                    <Icon name="check-circle" size={18} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/sell" variant="dark" iconRight="arrow-right">
                Условия Elite-продажи
              </Button>
              <Button href="#lead" variant="gold-outline" icon="chat">
                Обсудить объект
              </Button>
            </div>
          </div>

          {/* Правая колонка — тёмная карточка тарифа */}
          <div className="relative isolate overflow-hidden rounded-3xl bg-ink p-7 text-text-invert shadow-lift sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/15 blur-3xl" />
            <div className="flex items-center justify-between gap-4">
              <Badge tone="gold" icon="sparkles">
                {elite.name}
              </Badge>
              <div className="text-right">
                <div className="font-display text-2xl text-gold-bright">
                  {elite.priceLabel}
                </div>
                <div className="text-[11px] text-white/50">под ваш объект</div>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {eliteStages.map((stg) => (
                <div key={stg.title} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-bright">
                    <Icon name={stg.icon} size={18} />
                  </span>
                  <div>
                    <div className="font-semibold text-text-invert">
                      {stg.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {stg.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              href="#lead"
              variant="primary"
              className="mt-8 w-full"
              iconRight="arrow-right"
            >
              Обсудить закрытую продажу
            </Button>
          </div>
        </div>
      </Section>

      {/* ───────────────────── ФИНАЛЬНЫЙ CTA ───────────────────── */}
      <Section id="lead" dark>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow">
              <Icon name="sparkles" size={14} className="text-gold-bright" />
              Prime · Elite
            </div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text-invert sm:text-[2.6rem]">
              Обсудить закрытую продажу
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
              Продаёте пентхаус, коттедж или курортный объект? Обсудим стратегию,
              цену и формат закрытого показа. Первую консультацию проводит старший
              брокер MULK — конфиденциально и без обязательств.
            </p>

            <ul className="mt-7 space-y-2.5">
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

            <div className="mt-8 flex flex-wrap gap-3">
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
            title="Заявка на закрытую продажу"
            subtitle="Старший брокер MULK свяжется с вами конфиденциально — обычно в течение 15 минут в рабочее время."
            cta="Отправить заявку"
            context="Premium / Elite"
          />
        </div>
      </Section>
    </>
  );
}
