import type { Metadata } from "next";
import { site } from "@/lib/site";
import { sellPlans } from "@/lib/data/abroad";
import { brokers } from "@/lib/data/brokers";
import { AI_DISCLAIMER } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BrokerCard } from "@/components/BrokerCard";
import { ScoreRing } from "@/components/ScoreRing";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Продать объект",
  description:
    "Продайте недвижимость дороже и быстрее с MULK. Мы не просто размещаем объявление — упаковываем объект как продукт: AI-описание и Property Score, фото и видео, персональный брокер, показы и сделка под ключ в Бишкеке.",
};

export default function SellPage() {
  const avgDays = Math.round(
    brokers.reduce((s, b) => s + b.avgDaysToSell, 0) / brokers.length,
  );
  const totalDeals = brokers.reduce((s, b) => s + b.dealsClosed, 0);

  const heroStats: { value: string; label: string }[] = [
    { value: String(avgDays), label: "дней — средний срок продажи объекта" },
    { value: `${totalDeals}+`, label: "сделок закрыто брокерами MULK" },
    { value: "0", label: "скрытых комиссий и наценок на цену" },
  ];

  const steps: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "home",
      title: "Загрузите объект",
      desc: "Опишите объект в пару шагов или пришлите данные брокеру — адрес, площадь, цену и документы. Остальное соберём мы.",
    },
    {
      icon: "wand",
      title: "AI-описание и Property Score",
      desc: "AI готовит продающее описание и оценку 0–10: ликвидность, цена к рынку, документы и риски объекта.",
    },
    {
      icon: "video",
      title: "Фото, видео и упаковка",
      desc: "Обрабатываем фотографии, снимаем вертикальный видеообзор и собираем объект как продукт, а не строку в ленте.",
    },
    {
      icon: "users",
      title: "Персональный брокер",
      desc: "За объектом закрепляется брокер-эксперт по вашему сегменту. Он отвечает за цену, показы и результат.",
    },
    {
      icon: "scale",
      title: "Показы и переговоры",
      desc: "Приводим проверенных покупателей, ведём показы и торг — защищаем ваш интерес и держим цену.",
    },
    {
      icon: "check-circle",
      title: "Сделка",
      desc: "Сопровождаем сделку до подписи и передачи ключей: договор, расчёты и документы — прозрачно и в белую.",
    },
  ];

  const aiGives: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "sparkles",
      title: "Продающий заголовок",
      desc: "Формулируем заголовок и хук, которые цепляют именно вашего покупателя.",
    },
    {
      icon: "file",
      title: "Готовое описание",
      desc: "Структурированный текст: характеристики, преимущества и окружение объекта.",
    },
    {
      icon: "trending",
      title: "Цена к рынку",
      desc: "Сравнение с похожими объектами — где вы в рынке и есть ли запас по цене.",
    },
    {
      icon: "shield",
      title: "Что улучшить",
      desc: "Что подготовить перед продажей, чтобы поднять ценность и Property Score.",
    },
    {
      icon: "scale",
      title: "Что мешает продаже",
      desc: "AI подсвечивает слабые места и риски заранее — до того, как их найдёт покупатель.",
    },
  ];

  const trustPoints: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "file",
      title: "Официальный договор",
      desc: "Письменный договор с фиксированными условиями и сроками. Никаких устных обещаний.",
    },
    {
      icon: "scale",
      title: "Прозрачная комиссия",
      desc: "Комиссия известна заранее и прописана в договоре. Никаких скрытых наценок на цену объекта.",
    },
    {
      icon: "shield",
      title: "Проверка до публикации",
      desc: "Документы, собственник и цена проверяются до выхода объекта в каталог.",
    },
  ];

  const finalBullets = [
    "Бесплатная оценка объекта и рекомендация по цене",
    "Персональный план продажи под ваш объект и сроки",
    "Договор, прозрачная комиссия и сопровождение до сделки",
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
              Продавцам
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-[3.9rem]">
              Продайте объект{" "}
              <span className="text-gold-bright">дороже и быстрее.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
              Мы не просто размещаем объявление. Мы упаковываем объект как
              продукт: проверяем документы, готовим AI-описание и Property Score,
              снимаем медиа и продаём его через персонального брокера — от первого
              показа до ключей.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#lead" variant="primary" iconRight="arrow-right">
                Оставить объект
              </Button>
              <Button href="#plans" variant="gold-outline" icon="layers">
                Смотреть тарифы
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
                <div className="max-w-[9rem] text-xs leading-snug text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── КАК ЭТО РАБОТАЕТ ──────────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Процесс"
          title="Как это работает"
          subtitle="Шесть шагов от заявки до сделки. Вся упаковка, аналитика и переговоры — на стороне MULK, вы контролируете решения."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-line bg-surface-2 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-wash text-gold">
                  <Icon name={s.icon} size={20} />
                </span>
                <span className="font-display text-4xl leading-none text-gold/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg text-text">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─────────────────────────── ТАРИФЫ ─────────────────────────── */}
      <Section id="plans" className="bg-surface-2">
        <SectionHeading
          eyebrow="Тарифы упаковки"
          title="Выберите, как продавать объект"
          subtitle="Разовая упаковка объекта — от аккуратного размещения до закрытой продажи под ключ. Всё, что нужно для сильной цены и быстрой сделки."
        />
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sellPlans.map((plan) => {
            const isCustom = plan.priceLabel === "Индивидуально";
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                  plan.featured
                    ? "border-gold shadow-glow ring-1 ring-gold/20"
                    : "border-line",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                    {plan.name}
                  </div>
                  {plan.featured && (
                    <Badge tone="gold" icon="sparkles">
                      Популярный
                    </Badge>
                  )}
                </div>

                <div
                  className={cn(
                    "mt-4 font-display text-text",
                    isCustom ? "text-2xl" : "text-4xl",
                  )}
                >
                  {plan.priceLabel}
                </div>
                <div className="mt-1 text-xs text-text-muted">
                  {isCustom ? "под ваш объект" : "разовая упаковка объекта"}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-text-soft">
                  {plan.tagline}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-text-soft"
                    >
                      <span className="mt-0.5 shrink-0 text-emerald">
                        <Icon name="check" size={16} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Button
                    href="#lead"
                    variant={plan.featured ? "primary" : "outline"}
                    className="w-full"
                    iconRight="arrow-right"
                  >
                    {isCustom ? "Обсудить объект" : "Выбрать тариф"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ──────────────────────── AI-УПАКОВКА ──────────────────────── */}
      <Section className="bg-surface">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Левая колонка — что даёт AI */}
          <div>
            <div className="eyebrow">
              <Icon name="wand" size={14} />
              AI-упаковка объекта
            </div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Ваш объект — как инвестиционный кейс
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-soft">
              AI разбирает объект глазами покупателя и брокера одновременно:
              готовит текст, сравнивает цену с рынком и подсказывает, что усилить
              перед продажей, а что может её тормозить.
            </p>

            <div className="mt-8 space-y-4">
              {aiGives.map((f) => (
                <div key={f.title} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-wash text-gold">
                    <Icon name={f.icon} size={18} />
                  </span>
                  <div>
                    <div className="font-semibold text-text">{f.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-text-soft">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка — пример AI-отчёта */}
          <div className="rounded-3xl border border-line bg-surface-2 p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <Badge tone="gold" icon="sparkles">
                Пример AI-отчёта
              </Badge>
              <ScoreRing value={8.4} size={76} label="Сильный объект" />
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Продающий заголовок
              </div>
              <div className="mt-1.5 font-display text-lg leading-snug text-text">
                3-комн. в Золотом квадрате с панорамой на горы
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-surface p-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Цена к рынку
                </div>
                <div className="mt-1 text-sm text-text-soft">
                  Ниже похожих объектов района
                </div>
              </div>
              <Badge tone="emerald" icon="trending">
                −4% к рынку
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold">
                  <Icon name="wand" size={14} />
                  Что улучшить
                </div>
                <ul className="mt-2.5 space-y-1.5 text-sm text-text-soft">
                  <li>Снять видеообзор квартиры</li>
                  <li>Освежить фото кухни при дневном свете</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                  <Icon name="scale" size={14} />
                  Что мешает
                </div>
                <ul className="mt-2.5 space-y-1.5 text-sm text-text-soft">
                  <li>Нет техпаспорта в объявлении</li>
                  <li>Цена без указания рассрочки</li>
                </ul>
              </div>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-text-muted">
              {AI_DISCLAIMER}
            </p>
          </div>
        </div>
      </Section>

      {/* ──────────────────────── РАБОТАЕМ В БЕЛУЮ ──────────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Прозрачно"
          title="Работаем в белую"
          subtitle="Никаких серых схем и скрытых наценок. Условия зафиксированы в договоре, а за объектом закреплён брокер с публичным профилем."
        />
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Принципы */}
          <div className="space-y-4">
            {trustPoints.map((t) => (
              <div
                key={t.title}
                className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-soft text-emerald">
                  <Icon name={t.icon} size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg text-text">{t.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-soft">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Карточка брокера */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
              <Icon name="users" size={16} className="text-gold" />
              За объектом закреплён брокер
            </div>
            <BrokerCard broker={brokers[0]} />
            <p className="mt-3 text-sm leading-relaxed text-text-soft">
              Публичный профиль с рейтингом, отзывами и историей сделок. Вы всегда
              знаете, кто ведёт ваш объект и отвечает за результат.
            </p>
          </div>
        </div>
      </Section>

      {/* ───────────────────── ФИНАЛЬНЫЙ CTA ───────────────────── */}
      <Section id="lead" dark>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow">
              <Icon name="sparkles" size={14} className="text-gold-bright" />
              Начнём
            </div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text-invert sm:text-[2.6rem]">
              Оставьте объект на продажу
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
              Расскажите об объекте — брокер MULK оценит его, предложит план
              продажи и цену по рынку. Первичная консультация бесплатна и ни к
              чему не обязывает.
            </p>

            <ul className="mt-7 space-y-2.5">
              {finalBullets.map((b) => (
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
            title="Оставить объект на продажу"
            subtitle="Брокер оценит объект и предложит план продажи"
            cta="Продать с MULK"
            context="Заявка на продажу объекта"
          />
        </div>
      </Section>
    </>
  );
}
