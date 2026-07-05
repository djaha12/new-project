import type { Metadata } from "next";
import Link from "next/link";
import { abroadDirections } from "@/lib/data/abroad";
import { getBroker } from "@/lib/data/brokers";
import { foreignProperties } from "@/lib/data/properties";
import { formatPrice, pluralize } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { LeadForm } from "@/components/LeadForm";
import type { AbroadDirection } from "@/lib/types";

export const metadata: Metadata = {
  title: "Зарубежная недвижимость",
  description:
    "Зарубежная недвижимость как инвестнаправления, а не хаос объявлений. Дубай, Турция, Казахстан и Грузия — курируемые направления с сопровождением сделки под ключ от брокера MULK.",
};

/** Этапы сопровождения зарубежной сделки — от подбора до аренды. */
const steps: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "wand",
    title: "Подбор направления и объекта",
    desc: "Начинаем с задачи и бюджета: под аренду, перепродажу или переезд. Показываем 2–3 направления и короткий шорт-лист объектов, а не сотни ссылок.",
  },
  {
    icon: "building",
    title: "Проверенный застройщик",
    desc: "Работаем с застройщиками по прямым партнёрствам. Проверяем репутацию, сроки сдачи и escrow-счета, чтобы деньги были защищены на всём этапе стройки.",
  },
  {
    icon: "scale",
    title: "Рассрочка и финансирование",
    desc: "Помогаем зафиксировать рассрочку от застройщика и понятный график платежей. Считаем полную стоимость владения, а не только цену входа.",
  },
  {
    icon: "shield",
    title: "Безопасные расчёты",
    desc: "Сопровождаем платежи и валютные переводы по прозрачной схеме. Каждый этап расчётов проходит под контролем брокера и юриста.",
  },
  {
    icon: "check-circle",
    title: "Оформление и передача",
    desc: "Договор, регистрация права и передача объекта — дистанционно или с выездом. Доводим сделку до ключей, без поездок наугад.",
  },
  {
    icon: "globe",
    title: "Аренда и управление",
    desc: "После покупки подключаем управляющую компанию и арендный поток. Объект работает и приносит доход, пока вы в Бишкеке.",
  },
];

export default function AbroadPage() {
  const broker = getBroker("dana-niyazbekova");
  const countries = new Set(abroadDirections.map((d) => d.country)).size;
  const minEntry = Math.min(...abroadDirections.map((d) => d.priceFromUsd));
  const objectsAbroad = foreignProperties().length;
  const whatsappHref = broker
    ? `https://wa.me/${broker.whatsapp.replace(/\D/g, "")}`
    : "#";

  const heroStats: { icon: IconName; value: string; label: string }[] = [
    {
      icon: "globe",
      value: String(abroadDirections.length),
      label: pluralize(abroadDirections.length, [
        "инвестнаправление",
        "инвестнаправления",
        "инвестнаправлений",
      ]),
    },
    {
      icon: "landmark",
      value: String(countries),
      label: pluralize(countries, ["страна", "страны", "стран"]),
    },
    {
      icon: "trending",
      value: formatPrice(minEntry),
      label: "порог входа",
    },
    {
      icon: "shield",
      value: "Под ключ",
      label: "сопровождение сделки",
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
              <Icon name="globe" size={14} />
              Зарубежная недвижимость
            </div>
            <h1 className="text-balance font-display text-4xl leading-[1.05] text-text sm:text-5xl lg:text-[3.5rem]">
              Зарубежная недвижимость как инвестнаправления
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-text-soft sm:text-lg">
              Мы не выкладываем тысячи объявлений из других стран и не оставляем
              вас разбираться в них в одиночку. Вместо хаоса — несколько
              курируемых направлений, у каждого понятная логика: сколько стоит
              вход, откуда доходность и как проходит сделка. Вы выбираете
              стратегию, а не случайную квартиру в незнакомом городе.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              {abroadDirections.map((d) => (
                <Link
                  key={d.id}
                  href={`/abroad/${d.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-text-soft shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:text-text"
                >
                  <span className="text-base leading-none">{d.flag}</span>
                  {d.city}
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

      {/* ──────────────────────── НАПРАВЛЕНИЯ ──────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Курируемые направления"
          title="Выберите инвестнаправление"
          subtitle="Каждое направление — это стратегия с понятным входом и доходностью, а не разрозненные лоты. Откройте карточку, чтобы увидеть полную логику, объекты и брокера."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {abroadDirections.map((d) => (
            <DirectionCard key={d.id} direction={d} />
          ))}
        </div>
      </Section>

      {/* ──────────── КАК МЫ СОПРОВОЖДАЕМ СДЕЛКУ ЗА РУБЕЖОМ ──────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Сделка под ключ"
          title={
            <>
              Как мы сопровождаем сделку{" "}
              <span className="text-gold">за рубежом</span>
            </>
          }
          subtitle="Покупка недвижимости в другой стране пугает именно неизвестностью. Мы берём на себя каждый шаг — от первого созвона до аренды готового объекта."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative flex flex-col rounded-2xl border border-line bg-surface-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-display text-base text-gold-bright">
                  {i + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-wash text-gold">
                  <Icon name={s.icon} size={19} />
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg leading-snug text-text">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ──────────────────── БРОКЕР ЗАРУБЕЖЬЯ ──────────────────── */}
      {broker && (
        <Section dark id="consult">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="eyebrow text-gold-bright">
                <Icon name="users" size={14} />
                Брокер направления «Зарубежье»
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
                {broker.badges.map((b) => (
                  <Badge key={b} tone="glass" icon="sparkles">
                    {b}
                  </Badge>
                ))}
              </div>

              <div className="mt-7 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-center">
                <DarkStat value={broker.dealsClosed} label="сделок" />
                <DarkStat value={broker.activeListings} label="в работе" />
                <DarkStat value={objectsAbroad} label="объектов за рубежом" />
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

            <LeadForm
              dark
              title="Консультация по зарубежью"
              subtitle="Расскажите о бюджете и цели — подберём направление и объекты, посчитаем доходность и проведём сделку под ключ."
              cta="Получить подбор"
              context="Заявка: зарубежная недвижимость"
            />
          </div>
        </Section>
      )}
    </>
  );
}

/** Крупная карточка направления для сетки. */
function DirectionCard({ direction: d }: { direction: AbroadDirection }) {
  return (
    <Link
      href={`/abroad/${d.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line bg-surface-2 p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-3xl shadow-soft ring-1 ring-line">
            {d.flag}
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-text-muted">
              {d.country}
            </div>
            <div className="font-display text-xl leading-tight text-text group-hover:text-gold">
              {d.city}
            </div>
          </div>
        </div>
        <Badge tone="neutral">{d.title}</Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-text-soft">{d.blurb}</p>

        <div className="mt-4">
          <Badge tone="gold" icon="trending">
            {d.yieldNote}
          </Badge>
        </div>

        <ul className="mt-4 space-y-2">
          {d.points.slice(0, 3).map((pt) => (
            <li key={pt} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                <Icon name="check" size={12} />
              </span>
              <span className="text-sm leading-snug text-text-soft">{pt}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-text-muted">
              Порог входа
            </div>
            <div className="font-display text-lg leading-none text-text">
              от {formatPrice(d.priceFromUsd)}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold">
            Смотреть направление
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

function DarkStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-ink px-3 py-4">
      <div className="font-display text-xl leading-none text-text-invert">
        {value}
      </div>
      <div className="mt-1 text-[11px] leading-tight text-white/55">{label}</div>
    </div>
  );
}
