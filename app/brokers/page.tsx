import type { Metadata } from "next";
import { site } from "@/lib/site";
import { brokers } from "@/lib/data/brokers";
import { pluralize } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BrokerCard } from "@/components/BrokerCard";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Брокеры",
  description:
    "Профессиональные брокеры MULK — эксперты по сегментам: земля, элитка, коммерция, курорт и зарубежье. Персональный брокер ведёт вашу сделку от консультации до ключей.",
};

const whatsappHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;

const objForms: [string, string, string] = ["объект", "объекта", "объектов"];

/** Шаги формата «персональный брокер». */
const steps: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "chat",
    title: "Бесплатная консультация 15 минут",
    desc: "Созвон или встреча: брокер уточняет бюджет, задачу и сроки. Без обязательств и давления — только польза.",
  },
  {
    icon: "wand",
    title: "Подбор 3–5 объектов под запрос",
    desc: "Вместо сотен объявлений — короткий шорт-лист под вашу задачу, где каждый вариант обоснован цифрами.",
  },
  {
    icon: "file",
    title: "Проверка документов",
    desc: "Красная книга, собственник, обременения и назначение земли проверяются юристом до показа.",
  },
  {
    icon: "home",
    title: "Показ объектов",
    desc: "Брокер организует просмотры в удобное время и честно показывает и сильные, и слабые стороны.",
  },
  {
    icon: "scale",
    title: "Переговоры о цене",
    desc: "Брокер торгуется за вас и аргументирует цену данными рынка и AI-анализом объекта.",
  },
  {
    icon: "check-circle",
    title: "Сопровождение до сделки",
    desc: "Задаток, договор, расчёты и регистрация — до передачи ключей вы проходите каждый шаг не в одиночку.",
  },
];

/** Оффер для брокеров, которые хотят работать под брендом MULK. */
const offer: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "layers",
    title: "CRM и единая база объектов",
    desc: "Рабочее место брокера: сделки, задачи и статусы объектов в одном окне, без таблиц и заметок в мессенджерах.",
  },
  {
    icon: "users",
    title: "Поток тёплых лидов",
    desc: "Заявки с платформы приходят распределённо по вашей специализации — вы работаете, а не ищете клиентов.",
  },
  {
    icon: "sparkles",
    title: "Личный бренд и профиль",
    desc: "Публичная страница брокера с рейтингом, отзывами и объектами. Клиент выбирает вас по имени, а не по номеру.",
  },
  {
    icon: "trending",
    title: "AI-упаковка объектов",
    desc: "Property Score, анализ рисков и потенциала считаются автоматически — вы выходите на показ с готовой аналитикой.",
  },
  {
    icon: "video",
    title: "Медиа-продакшн",
    desc: "Видеообзоры, съёмка и продвижение в соцсетях. Ваши объекты видят как продукт, а не строку в ленте.",
  },
  {
    icon: "scale",
    title: "Прозрачные условия",
    desc: "Понятная комиссия и честное распределение сделок. Вы всегда знаете, за что и сколько получаете.",
  },
];

export default function BrokersPage() {
  const totalDeals = brokers.reduce((s, b) => s + b.dealsClosed, 0);
  const totalListings = brokers.reduce((s, b) => s + b.activeListings, 0);
  const avgRating = brokers.reduce((s, b) => s + b.rating, 0) / brokers.length;

  const heroStats: { icon: IconName; value: string; label: string }[] = [
    {
      icon: "users",
      value: String(brokers.length),
      label: pluralize(brokers.length, [
        "брокер-эксперт",
        "брокера-эксперта",
        "брокеров-экспертов",
      ]),
    },
    { icon: "check-circle", value: `${totalDeals}+`, label: "закрытых сделок" },
    { icon: "star", value: avgRating.toFixed(1), label: "средний рейтинг" },
    {
      icon: "home",
      value: String(totalListings),
      label: pluralize(totalListings, objForms) + " в работе",
    },
  ];

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-line bg-surface">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold/5 blur-3xl" />
        <div className="container py-16 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <div className="eyebrow mb-4">
              <Icon name="users" size={14} />
              Команда MULK
            </div>
            <h1 className="text-balance font-display text-4xl leading-[1.05] text-text sm:text-5xl lg:text-[3.5rem]">
              Профессиональные брокеры
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-text-soft sm:text-lg">
              В MULK ваш объект ведёт не безымянная студия и не колл-центр, а
              конкретный брокер, который отвечает за результат своим именем и
              рейтингом. Это лица проекта — эксперты по своим сегментам, к
              каждому из которых можно обратиться напрямую.
            </p>
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

      {/* ──────────────────────── СЕТКА БРОКЕРОВ ──────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Эксперты по сегментам"
          title="Выберите своего брокера"
          subtitle="Земля, элитка, коммерция, курорт и зарубежье — под каждую задачу есть профильный специалист. Откройте профиль, чтобы увидеть объекты, рейтинг и отзывы."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brokers.map((b) => (
            <BrokerCard key={b.id} broker={b} />
          ))}
        </div>
      </Section>

      {/* ─────────────── ФОРМАТ «ПЕРСОНАЛЬНЫЙ БРОКЕР» ─────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Как мы работаем"
          title={
            <>
              Формат{" "}
              <span className="text-gold">«персональный брокер»</span>
            </>
          }
          subtitle="Один брокер сопровождает вас на всём пути — от первого разговора до ключей. Без переброски между менеджерами и повторных объяснений."
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

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/catalog" variant="primary" iconRight="arrow-right">
            Смотреть каталог
          </Button>
          <Button href="/sell" variant="outline">
            Продать объект через брокера
          </Button>
        </div>
      </Section>

      {/* ─────────────────── СТАТЬ БРОКЕРОМ MULK ─────────────────── */}
      <Section dark id="career">
        <SectionHeading
          dark
          eyebrow="Карьера в MULK"
          title={
            <>
              Стать брокером{" "}
              <span className="text-gold-bright">MULK</span>
            </>
          }
          subtitle="Мы усиливаем брокеров, а не заменяем их. Инструменты, лиды и медиа берём на себя — вы фокусируетесь на клиентах и сделках."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offer.map((o) => (
            <div key={o.title} className="glass rounded-2xl p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold-bright">
                <Icon name={o.icon} size={20} />
              </span>
              <h3 className="mt-4 font-semibold text-text-invert">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {o.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl leading-tight text-text-invert">
              Готовы работать под брендом MULK?
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              Оставьте анкету или напишите нам напрямую. Мы разберём ваш опыт,
              покажем условия и подключим к платформе. Берём брокеров с фокусом
              на результат и репутацию.
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
              <Button
                href={`tel:${site.phone}`}
                variant="gold-outline"
                icon="phone"
              >
                {site.phone}
              </Button>
            </div>
          </div>

          <LeadForm
            dark
            title="Хочу стать брокером"
            subtitle="Расскажите о себе — свяжемся и обсудим условия."
            cta="Отправить анкету"
            context="Заявка: стать брокером MULK"
          />
        </div>
      </Section>
    </>
  );
}
