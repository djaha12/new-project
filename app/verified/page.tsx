import type { Metadata } from "next";
import { site } from "@/lib/site";
import { brokers } from "@/lib/data/brokers";
import { AI_DISCLAIMER } from "@/lib/ai";
import type { CheckItem } from "@/lib/types";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CheckList } from "@/components/CheckList";
import { BrokerCard } from "@/components/BrokerCard";

export const metadata: Metadata = {
  title: "Как мы проверяем объекты",
  description:
    "Проверка недвижимости в MULK: документы, личность собственника, красная книга и техпаспорт, назначение земли, обременения и цена к рынку. Работаем в белую — договор, публичный брокер и прозрачная комиссия.",
};

/** Страхи покупателя на вторичном рынке и как MULK их закрывает. */
const FEARS: { icon: IconName; title: string; desc: string; solved: string }[] = [
  {
    icon: "file",
    title: "Документы не в порядке",
    desc: "Отсутствуют или вызывают вопросы правоустанавливающие документы, продавец «донесёт потом».",
    solved: "Проверяем документы до публикации — объект без чистых бумаг в каталог не попадает.",
  },
  {
    icon: "landmark",
    title: "Красная книга и техпаспорт",
    desc: "Данные в техпаспорте не совпадают с реальной планировкой, самовольные пристройки и переустройство.",
    solved: "Сверяем красную книгу и техпаспорт с объектом и фиксируем расхождения заранее.",
  },
  {
    icon: "users",
    title: "Цепочка посредников",
    desc: "За объявлением — несколько перекупщиков, до собственника не достучаться, цена накручена по пути.",
    solved: "Работаем от собственника, а объект ведёт один закреплённый брокер с публичным профилем.",
  },
  {
    icon: "scale",
    title: "Скрытые комиссии",
    desc: "Комиссия «зашита» в цену, о доплатах узнаёшь только на сделке, итоговая сумма растёт.",
    solved: "Комиссия известна заранее и прописана в договоре. Наценок на цену объекта нет.",
  },
];

/** 8 пунктов проверки объекта перед публикацией. */
const CHECKLIST: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "file",
    title: "Документы загружены и проверены",
    desc: "Правоустанавливающие документы получены, прочитаны и приложены к карточке объекта.",
  },
  {
    icon: "shield",
    title: "Личность собственника подтверждена",
    desc: "Сверяем, что продавец — реальный собственник или имеет оформленную доверенность.",
  },
  {
    icon: "home",
    title: "Брокер осмотрел объект лично",
    desc: "Закреплённый брокер был на месте: планировка, состояние и окружение совпадают с описанием.",
  },
  {
    icon: "landmark",
    title: "Красная книга и техпаспорт сверены",
    desc: "Площадь, этажность и планировка в документах соответствуют фактическому объекту.",
  },
  {
    icon: "tree",
    title: "Назначение земли проверено",
    desc: "Для участков и домов уточняем категорию и назначение земли — под ИЖС, сад или иное.",
  },
  {
    icon: "scale",
    title: "Обременения и аресты",
    desc: "Проверяем залоги, аресты, ограничения и права третьих лиц на объект.",
  },
  {
    icon: "phone",
    title: "Коммуникации подтверждены",
    desc: "Свет, вода, газ, отопление и канализация — статус каждой коммуникации зафиксирован в карточке.",
  },
  {
    icon: "trending",
    title: "Цена сверена с рынком",
    desc: "AI и брокер сопоставляют цену с похожими объектами района — вы видите, где объект в рынке.",
  },
];

/** Документы, необходимые для государственной регистрации прав. */
const REG_DOCS: CheckItem[] = [
  {
    label: "Заявление о государственной регистрации права",
    status: "yes",
    note: "заполняется в регистрирующем органе",
  },
  {
    label: "Документ, удостоверяющий личность",
    status: "yes",
    note: "паспорт или ID-карта сторон сделки",
  },
  {
    label: "Правоустанавливающие документы",
    status: "yes",
    note: "договор купли-продажи, дарения или свидетельство о наследстве",
  },
  {
    label: "Технический паспорт объекта",
    status: "yes",
    note: "с актуальными характеристиками и планировкой",
  },
  {
    label: "Квитанция об оплате госпошлины",
    status: "yes",
    note: "подтверждение оплаты регистрационного сбора",
  },
];

/** Принципы работы «в белую». */
const WHITE: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "file",
    title: "Официальный договор",
    desc: "Письменный договор с фиксированными условиями и сроками. Никаких устных обещаний.",
  },
  {
    icon: "users",
    title: "Публичная карточка брокера",
    desc: "За объектом закреплён брокер с профилем, рейтингом и историей сделок — вы знаете, кто отвечает.",
  },
  {
    icon: "scale",
    title: "Прозрачная комиссия",
    desc: "Размер комиссии известен заранее и прописан в договоре. Скрытых наценок на цену нет.",
  },
  {
    icon: "shield",
    title: "Реклама только по договору",
    desc: "Объект публикуем и продвигаем лишь с согласия собственника, зафиксированного в договоре.",
  },
];

const HERO_STATS: { value: string; label: string }[] = [
  { value: "8", label: "ключевых пунктов проверки объекта" },
  { value: "100%", label: "объектов с закреплённым брокером" },
  { value: "0", label: "скрытых комиссий и наценок на цену" },
];

export default function VerifiedPage() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink text-text-invert">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-soft via-ink to-ink" />
        <div className="pointer-events-none absolute -right-40 -top-44 -z-10 h-[36rem] w-[36rem] rounded-full bg-emerald/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-52 -left-44 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl" />

        <div className="container py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">
              <Icon name="shield" size={14} className="text-gold-bright" />
              Доверие
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-[3.9rem]">
              Как мы проверяем{" "}
              <span className="text-gold-bright">объекты.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg">
              Покупка недвижимости — это про документы и людей, а не только про
              красивые фото. Поэтому каждый объект MULK проходит проверку до
              публикации: документы, собственник, красная книга и цена к рынку.
              В каталог попадает только то, за что мы можем отвечать.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#checklist" variant="primary" icon="shield">
                Что мы проверяем
              </Button>
              <Button href="/catalog" variant="gold-outline" iconRight="arrow-right">
                Смотреть каталог
              </Button>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-9">
            {HERO_STATS.map((s, i) => (
              <div
                key={s.label}
                className={
                  "flex items-baseline gap-3" +
                  (i > 0 ? " sm:border-l sm:border-white/10 sm:pl-10" : "")
                }
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

      {/* ──────────────────── ЗАЧЕМ ЭТО: СТРАХИ ──────────────────── */}
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Зачем это нужно"
          title="Что тревожит покупателя"
          subtitle="На вторичном рынке легко потерять деньги и нервы. Вот четыре главных риска — и как MULK закрывает каждый из них ещё до показа."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {FEARS.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-2xl border border-line bg-surface-2 p-6 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger">
                  <Icon name={f.icon} size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg text-text">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-soft">
                    {f.desc}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald/15 bg-emerald-soft/60 p-3.5">
                <span className="mt-0.5 shrink-0 text-emerald">
                  <Icon name="check-circle" size={17} />
                </span>
                <p className="text-sm leading-snug text-text-soft">
                  <span className="font-semibold text-emerald">Как решаем MULK: </span>
                  {f.solved}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ──────────────── ЧЕК-ЛИСТ ПРОВЕРКИ ОБЪЕКТА ──────────────── */}
      <Section id="checklist" className="bg-surface-2">
        <SectionHeading
          eyebrow="Проверка объекта"
          title="Восемь пунктов перед публикацией"
          subtitle="Единый чек-лист, который проходит каждый объект каталога. Пока не закрыт весь список — объект не выходит в продажу."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKLIST.map((item, i) => (
            <div
              key={item.title}
              className="relative flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                  <Icon name="check" size={20} />
                </span>
                <span className="font-display text-3xl leading-none text-emerald/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-emerald">
                <Icon name={item.icon} size={16} />
              </div>
              <h3 className="mt-2 font-display text-[17px] leading-snug text-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <Badge tone="emerald" icon="shield">
            Проверено брокером
          </Badge>
          <p className="text-sm leading-relaxed text-text-soft">
            Итог проверки виден прямо в карточке объекта — в блоке «Проверено» со
            статусом каждого пункта. Ничего не прячем: если по объекту есть нюанс,
            он указан честно.
          </p>
        </div>
      </Section>

      {/* ──────────── ДОКУМЕНТЫ ДЛЯ РЕГИСТРАЦИИ ПРАВ ──────────── */}
      <Section className="bg-surface">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow">
              <Icon name="file" size={14} />
              Документы
            </div>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-text sm:text-[2.6rem]">
              Документы для регистрации прав
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-soft">
              Чтобы зарегистрировать переход права собственности, к сделке готовят
              стандартный пакет документов. Брокер MULK помогает собрать и
              проверить его заранее — чтобы регистрация прошла с первого раза, без
              возвратов и переносов.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/sell" variant="outline" icon="file">
                Продать объект
              </Button>
              <Button
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold-outline"
                icon="chat"
              >
                Спросить брокера
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface-2 p-6 shadow-lift sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-sm font-semibold text-text">
                Пакет для регистрации
              </div>
              <Badge tone="neutral" icon="check-circle">
                5 документов
              </Badge>
            </div>
            <CheckList items={REG_DOCS} />
            <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-text-muted">
              Точный перечень зависит от типа объекта и сделки. Актуальный список
              брокер подтвердит под ваш конкретный объект.
            </p>
          </div>
        </div>
      </Section>

      {/* ──────────────────── РАБОТАЕМ В БЕЛУЮ ──────────────────── */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Прозрачно"
          title="Работаем в белую"
          subtitle="Никаких серых схем и скрытых наценок. Условия зафиксированы в договоре, а за каждым объектом стоит брокер с публичным профилем."
        />
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid gap-4 sm:grid-cols-2">
            {WHITE.map((t) => (
              <div
                key={t.title}
                className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-soft text-emerald">
                  <Icon name={t.icon} size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg text-text">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-soft">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
              <Icon name="users" size={16} className="text-gold" />
              За объектом закреплён брокер
            </div>
            <BrokerCard broker={brokers[0]} />
            <p className="mt-3 text-sm leading-relaxed text-text-soft">
              Публичный профиль с рейтингом, отзывами и историей сделок. Вы всегда
              знаете, кто ведёт объект, проверяет документы и отвечает за
              результат.
            </p>
          </div>
        </div>
      </Section>

      {/* ─────────────────── CTA + ДИСКЛЕЙМЕР ─────────────────── */}
      <Section dark>
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow justify-center">
            <Icon name="check-circle" size={14} className="text-gold-bright" />
            Проверено
          </div>
          <h2 className="mt-4 text-balance font-display text-3xl leading-[1.05] text-text-invert sm:text-[2.6rem]">
            Покупайте проверенное
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            Откройте каталог с уже проверенными объектами или доверьте нам продажу
            своего — с проверкой документов, упаковкой и брокером под ключ.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/catalog" variant="primary" icon="search">
              Смотреть каталог
            </Button>
            <Button href="/sell" variant="gold-outline" iconRight="arrow-right">
              Продать объект
            </Button>
          </div>

          <p className="mx-auto mt-10 max-w-2xl border-t border-white/10 pt-6 text-xs leading-relaxed text-white/45">
            {AI_DISCLAIMER}
          </p>
        </div>
      </Section>
    </>
  );
}
