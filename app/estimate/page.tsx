import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { EstimateForm } from "@/components/valuation/EstimateForm";

export const metadata: Metadata = {
  title: "Оценка недвижимости — сколько стоит ваш объект",
  description:
    "MULK Estimate — бесплатная онлайн-оценка недвижимости в Бишкеке по сопоставимым объектам. Узнайте рыночный диапазон, медианную цену за м² и обоснование расчёта за минуту. Не «чёрный ящик» — считаем по реальным предложениям.",
};

export default function EstimatePage() {
  const method: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "scale",
      title: "Собираем сопоставимые",
      desc: "Берём предложения той же категории, района и единицы площади — то, с чем ваш объект реально конкурирует на рынке.",
    },
    {
      icon: "ruler",
      title: "Считаем медиану $/ед.",
      desc: "Находим медианную цену за м² или сотку по сегменту — устойчивую к выбросам, в отличие от «средней по больнице».",
    },
    {
      icon: "trending",
      title: "Строим диапазон",
      desc: "Корректируем на уровень объекта и площадь, показываем диапазон и обоснованный ориентир — а не одну случайную цифру.",
    },
  ];

  const vsBoards: { icon: IconName; title: string; desc: string }[] = [
    {
      icon: "wand",
      title: "У досок нет оценки",
      desc: "Объявление показывает лишь цену, которую хочет продавец. Завышена она или занижена — вы не знаете. MULK Estimate сразу ставит цену в контекст рынка.",
    },
    {
      icon: "scale",
      title: "Считаем по сопоставимым",
      desc: "Не абстрактный «прайс за м² по городу», а именно ваш сегмент: категория, район, класс. Прозрачно видно, из чего сложился диапазон.",
    },
    {
      icon: "shield",
      title: "За цифрой — брокер",
      desc: "Онлайн-оценка — стартовая точка. Дальше брокер MULK уточняет цену по состоянию, документам и виду объекта и доводит до сделки.",
    },
    {
      icon: "sparkles",
      title: "Обоснование словами",
      desc: "Мы объясняем расчёт человеческим языком: почему такой диапазон и что на него влияет. Никакого «чёрного ящика».",
    },
  ];

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink text-text-invert">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-soft via-ink to-ink" />
        <div className="pointer-events-none absolute -right-40 -top-44 -z-10 h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-52 -left-44 -z-10 h-[32rem] w-[32rem] rounded-full bg-emerald/10 blur-3xl" />

        <div className="container py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">
              <Icon name="trending" size={14} className="text-gold-bright" />
              MULK Estimate
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-[3.9rem]">
              Сколько стоит{" "}
              <span className="text-gold-bright">ваш объект?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
              Бесплатная онлайн-оценка недвижимости в Бишкеке за минуту. Мы
              считаем не «на глаз», а по сопоставимым предложениям вашего
              сегмента — и честно показываем, из чего складывается цена.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#estimate" variant="primary" iconRight="arrow-right">
                Оценить объект
              </Button>
              <Button href="/sell" variant="gold-outline" icon="home">
                Продать с MULK
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── МЕТОДОЛОГИЯ ─────────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Как мы считаем"
          title="Оценка по сопоставимым, а не наугад"
          subtitle="MULK Estimate — прозрачный расчёт. Мы показываем каждый шаг: какие объекты взяли за основу, какая по ним медиана и как из неё получился ваш диапазон."
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {method.map((m, i) => (
            <div
              key={m.title}
              className="relative rounded-2xl border border-line bg-surface-2 p-6 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-wash text-gold">
                  <Icon name={m.icon} size={20} />
                </span>
                <span className="font-display text-4xl leading-none text-gold/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg text-text">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─────────────────────── КАЛЬКУЛЯТОР ─────────────────────── */}
      <Section id="estimate" className="bg-surface-2">
        <SectionHeading
          eyebrow="Оценка объекта"
          title="Узнайте рыночный диапазон"
          subtitle="Заполните параметры объекта — покажем диапазон, медиану по сегменту и обоснование расчёта. Оценка бесплатна и ни к чему не обязывает."
        />
        <EstimateForm />
      </Section>

      {/* ──────────────── ПОЧЕМУ MULK ТОЧНЕЕ ДОСОК ──────────────── */}
      <Section className="bg-surface">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">
              <Icon name="shield" size={14} />
              Не просто объявление
            </div>
            <h2 className="font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Почему MULK точнее досок объявлений
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-soft">
              На досках вы видите только желаемую цену продавца — без всякого
              контекста. MULK ставит объект в рынок и объясняет расчёт.
            </p>
          </div>
          <Badge tone="gold" icon="sparkles">
            MULK Estimate
          </Badge>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {vsBoards.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 rounded-2xl border border-line bg-surface-2 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-soft text-emerald">
                <Icon name={b.icon} size={20} />
              </span>
              <div>
                <h3 className="font-display text-lg text-text">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-soft">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-text-muted">
          MULK Estimate — ориентир на основе сопоставимых предложений каталога, а
          не заключение сертифицированного оценщика. Официальную оценку готовит
          оценщик, рыночную цену объекта — брокер MULK по состоянию, документам и
          виду объекта.
        </p>
      </Section>
    </>
  );
}
