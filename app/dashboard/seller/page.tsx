import type { Metadata } from "next";
import Link from "next/link";
import { properties } from "@/lib/data/properties";
import { getBroker } from "@/lib/data/brokers";
import { CATEGORY_LABELS, type Property } from "@/lib/types";
import { AI_DISCLAIMER } from "@/lib/ai";
import { cn, formatPrice, pluralize } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { PropertyMedia } from "@/components/PropertyMedia";
import { DashboardShell, type DashNavItem } from "@/components/dashboard/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";

export const metadata: Metadata = {
  title: "Кабинет продавца",
  description:
    "Личный кабинет продавца MULK: объекты на продаже, просмотры и заявки, статус проверки и AI-рекомендации по упаковке объявлений.",
  robots: { index: false, follow: false },
};

// ─────────────────────────── Демо-данные кабинета ───────────────────────────

const SELLER = { name: "Марат Дуйшенов", tone: 2, meta: "Продавец · Бишкек" };

/** Объекты продавца (демо-выборка каталога). */
const myListings = properties.slice(0, 4);

/** Стабильные демо-показатели по каждому объекту. */
const LISTING_STATS: { views: number; leads: number; published: boolean }[] = [
  { views: 1284, leads: 6, published: true },
  { views: 742, leads: 2, published: true },
  { views: 968, leads: 4, published: false },
  { views: 2461, leads: 11, published: true },
];

type LeadStatus = "new" | "progress" | "show" | "done";
const LEAD_STATUS: Record<LeadStatus, { label: string; tone: "gold" | "emerald" | "ink" | "neutral" }> = {
  new: { label: "Новая", tone: "gold" },
  progress: { label: "В работе", tone: "emerald" },
  show: { label: "Показ назначен", tone: "ink" },
  done: { label: "Закрыта", tone: "neutral" },
};

const SELLER_LEADS: { name: string; tone: number; when: string; status: LeadStatus; note: string; listing: number }[] = [
  { name: "Айбек Жумабеков", tone: 3, when: "20 минут назад", status: "new", note: "Просит закрытый показ", listing: 3 },
  { name: "Динара Сатыбалдиева", tone: 1, when: "2 часа назад", status: "progress", note: "Запросила документы", listing: 0 },
  { name: "Эрлан Мамбетов", tone: 4, when: "5 часов назад", status: "show", note: "Показ в субботу, 12:00", listing: 2 },
  { name: "Гульнара Токтосунова", tone: 5, when: "вчера", status: "progress", note: "Уточняет рассрочку", listing: 1 },
  { name: "Бакыт Нурланов", tone: 0, when: "вчера", status: "new", note: "Впервые на связи", listing: 0 },
];

const short = (p: Property) => `${CATEGORY_LABELS[p.category].toLowerCase()} · ${p.district}`;

export default function SellerDashboardPage() {
  const totalViews = LISTING_STATS.reduce((s, x) => s + x.views, 0);
  const totalLeads = LISTING_STATS.reduce((s, x) => s + x.leads, 0);
  const newLeads = SELLER_LEADS.filter((l) => l.status === "new").length;
  const avgDays = Math.round(
    myListings.reduce((s, p) => s + (getBroker(p.brokerId)?.avgDaysToSell ?? 40), 0) /
      myListings.length,
  );

  // AI-рекомендации, выведенные из реальных данных объектов
  const noVideo = myListings.find((p) => !p.videoSec);
  const partialItem = myListings
    .flatMap((p) => p.verified.map((v) => ({ p, v })))
    .find(({ v }) => v.status === "partial");
  const nearComm = myListings.find((p) => p.communications.some((c) => c.status === "near"));

  const aiTips: { icon: IconName; title: string; text: string; tone: "gold" | "emerald" }[] = [];
  if (noVideo)
    aiTips.push({
      icon: "video",
      title: `Добавьте видеообзор — ${short(noVideo)}`,
      text: "Объявления с вертикальным видео получают до 40% больше заявок. Заказать съёмку можно в тарифе Premium.",
      tone: "gold",
    });
  if (partialItem)
    aiTips.push({
      icon: "file",
      title: `Закройте документ по объекту «${partialItem.p.district}»`,
      text: `Пункт «${partialItem.v.label}» ещё на проверке — покупатели уходят из-за неясного статуса. Догрузите подтверждение.`,
      tone: "gold",
    });
  if (nearComm)
    aiTips.push({
      icon: "map-pin",
      title: `Уточните коммуникации — ${short(nearComm)}`,
      text: "Часть коммуникаций отмечена как «рядом». Добавьте условия и стоимость подключения — это снимает главный вопрос покупателя.",
      tone: "gold",
    });
  aiTips.push({
    icon: "sparkles",
    title: "Соберите участки в единый инвест-лот",
    text: "Ваши объекты можно упаковать в одну презентацию под инвестора. Брокер подготовит расчёт доходности и сценарии застройки.",
    tone: "emerald",
  });

  const nav: DashNavItem[] = [
    { label: "Обзор", icon: "home", active: true },
    { label: "Мои объекты", icon: "building", count: myListings.length },
    { label: "Заявки", icon: "chat", count: newLeads },
    { label: "Аналитика", icon: "trending" },
    { label: "AI-упаковка", icon: "sparkles" },
  ];

  return (
    <DashboardShell
      roleLabel="Кабинет продавца"
      user={SELLER}
      nav={nav}
      roleSwitch={{ label: "Кабинет брокера", href: "/dashboard/broker", icon: "users" }}
    >
      {/* ───────────── Приветствие ───────────── */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-8 text-text-invert shadow-lift sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-64 w-64 rounded-full bg-emerald/10 blur-3xl" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow text-gold-bright">
              <Icon name="sun" size={14} />
              Кабинет продавца
            </span>
            <h1 className="mt-4 font-display text-3xl leading-[1.08] sm:text-4xl">
              Добрый день, {SELLER.name.split(" ")[0]}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              На продаже {myListings.length}{" "}
              {pluralize(myListings.length, ["объект", "объекта", "объектов"])}, за месяц их
              посмотрели {totalViews.toLocaleString("ru-RU")} раз. Ждут ответа{" "}
              <span className="font-semibold text-gold-bright">
                {newLeads} {pluralize(newLeads, ["новая заявка", "новые заявки", "новых заявок"])}
              </span>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/sell" variant="primary" icon="home">
                Добавить объект
              </Button>
              <Button href="/sell#plans" variant="gold-outline" icon="wand">
                AI-упаковка объекта
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Всего заявок
            </div>
            <div className="mt-1 font-display text-4xl text-gold-bright">{totalLeads}</div>
            <div className="mt-1 text-xs text-white/60">за последние 30 дней</div>
          </div>
        </div>
      </section>

      {/* ───────────── Метрики ───────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon="building"
          tone="gold"
          value={String(myListings.length)}
          label="Объектов на продаже"
          hint="все прошли проверку"
        />
        <MetricCard
          icon="trending"
          tone="emerald"
          value={totalViews.toLocaleString("ru-RU")}
          label="Просмотров за 30 дней"
          trend={{ value: "+18%", up: true }}
        />
        <MetricCard
          icon="chat"
          tone="gold"
          value={String(totalLeads)}
          label="Заявок от покупателей"
          hint={`${newLeads} новых, ждут ответа`}
        />
        <MetricCard
          icon="check-circle"
          value={`${avgDays} дн`}
          label="Средний срок продажи"
          hint="по вашим брокерам"
        />
      </div>

      {/* ───────────── Мои объекты ───────────── */}
      <Panel
        title="Мои объекты"
        icon="building"
        eyebrow="Активные объявления"
        bodyClassName="p-0"
        action={
          <Button href="/sell" variant="outline" size="sm" icon="home">
            Добавить объект
          </Button>
        }
      >
        {/* Таблица — десктоп */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-3 font-semibold">Объект</th>
                <th className="px-3 py-3 font-semibold">Цена</th>
                <th className="px-3 py-3 font-semibold">Просмотры</th>
                <th className="px-3 py-3 font-semibold">Заявки</th>
                <th className="px-3 py-3 font-semibold">Статус</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {myListings.map((p, i) => {
                const st = LISTING_STATS[i];
                return (
                  <tr
                    key={p.id}
                    className="border-b border-line/70 last:border-0 transition-colors hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <PropertyMedia
                          tone={p.mediaTone}
                          category={p.category}
                          rounded="rounded-lg"
                          className="h-12 w-16 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="line-clamp-1 font-semibold text-text">{p.title}</div>
                          <div className="text-xs text-text-muted">
                            <Icon name="map-pin" size={11} className="mr-0.5 inline align-[-2px]" />
                            {p.district}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-text">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-text-soft">
                      {st.views.toLocaleString("ru-RU")}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-text">
                        <Icon name="chat" size={13} className="text-gold" />
                        {st.leads}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge tone="emerald" icon="shield">
                          Проверено
                        </Badge>
                        {!st.published && (
                          <Badge tone="gold" icon="sparkles">
                            На модерации
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/property/${p.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-ink"
                      >
                        Открыть
                        <Icon name="arrow-up-right" size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Карточки — мобильные */}
        <div className="divide-y divide-line lg:hidden">
          {myListings.map((p, i) => {
            const st = LISTING_STATS[i];
            return (
              <Link
                key={p.id}
                href={`/property/${p.slug}`}
                className="flex gap-3 p-4 transition-colors hover:bg-surface-2/60"
              >
                <PropertyMedia
                  tone={p.mediaTone}
                  category={p.category}
                  rounded="rounded-xl"
                  className="h-16 w-20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-semibold text-text">{p.title}</div>
                  <div className="mt-0.5 text-xs text-text-muted">{p.district}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-soft">
                    <span className="font-semibold text-text">{formatPrice(p.price)}</span>
                    <span>{st.views.toLocaleString("ru-RU")} просм.</span>
                    <span className="inline-flex items-center gap-1 font-medium text-gold">
                      <Icon name="chat" size={12} />
                      {st.leads} заявок
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="emerald" icon="shield">
                      Проверено
                    </Badge>
                    {!st.published && <Badge tone="gold">На модерации</Badge>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Panel>

      {/* ───────────── Заявки + AI-рекомендации ───────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Заявки покупателей"
          icon="chat"
          eyebrow="Входящие"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={<span className="text-xs font-medium text-text-muted">{SELLER_LEADS.length} всего</span>}
        >
          <ul className="divide-y divide-line">
            {SELLER_LEADS.map((lead, i) => {
              const p = myListings[lead.listing];
              const s = LEAD_STATUS[lead.status];
              return (
                <li key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={lead.name} tone={lead.tone} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-text">{lead.name}</span>
                      <span className="hidden shrink-0 text-xs text-text-muted sm:inline">
                        · {lead.when}
                      </span>
                    </div>
                    <div className="truncate text-xs text-text-soft">
                      {p.title} — {lead.note}
                    </div>
                  </div>
                  <Badge tone={s.tone} className="shrink-0">
                    {s.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line px-5 py-3">
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-ink"
            >
              Все заявки
              <Icon name="arrow-right" size={13} />
            </Link>
          </div>
        </Panel>

        <Panel title="Рекомендации AI" icon="wand" eyebrow="Что улучшить" className="lg:col-span-1">
          <ul className="space-y-4">
            {aiTips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    tip.tone === "emerald"
                      ? "bg-emerald-soft text-emerald"
                      : "bg-gold-wash text-gold",
                  )}
                >
                  <Icon name={tip.icon} size={16} />
                </span>
                <div>
                  <div className="text-sm font-semibold leading-snug text-text">{tip.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-text-soft">{tip.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-[11px] leading-relaxed text-text-muted">
            {AI_DISCLAIMER}
          </p>
        </Panel>
      </div>
    </DashboardShell>
  );
}
