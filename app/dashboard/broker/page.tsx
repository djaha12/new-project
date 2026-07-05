import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBroker } from "@/lib/data/brokers";
import { propertiesByBroker } from "@/lib/data/properties";
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
  title: "Кабинет брокера",
  description:
    "Рабочий кабинет брокера MULK: объекты в работе, входящие лиды, задачи на день и AI-помощник для описаний и презентаций объектов.",
  robots: { index: false, follow: false },
};

// ─────────────────────────── Демо-данные кабинета ───────────────────────────

type LeadStatus = "new" | "progress" | "show";
const LEAD_STATUS: Record<LeadStatus, { label: string; tone: "gold" | "emerald" | "ink" }> = {
  new: { label: "Новый", tone: "gold" },
  progress: { label: "В работе", tone: "emerald" },
  show: { label: "Показ назначен", tone: "ink" },
};

const LISTING_STATS: { views: number; leads: number; days: number; hot?: boolean }[] = [
  { views: 1840, leads: 9, days: 12, hot: true },
  { views: 1120, leads: 4, days: 26 },
  { views: 2530, leads: 14, days: 8, hot: true },
];

const INCOMING_LEADS: {
  name: string;
  tone: number;
  channel: IconName;
  channelLabel: string;
  when: string;
  status: LeadStatus;
  listing: number;
}[] = [
  { name: "Нурлан Асанов", tone: 3, channel: "chat", channelLabel: "WhatsApp", when: "10 минут назад", status: "new", listing: 0 },
  { name: "Жамиля Кадырова", tone: 1, channel: "phone", channelLabel: "Звонок", when: "1 час назад", status: "progress", listing: 2 },
  { name: "Марат Сыдыков", tone: 4, channel: "globe", channelLabel: "Сайт", when: "3 часа назад", status: "show", listing: 1 },
  { name: "Бермет Токтоева", tone: 5, channel: "chat", channelLabel: "WhatsApp", when: "вчера", status: "progress", listing: 2 },
  { name: "Азиз Раимов", tone: 0, channel: "chat", channelLabel: "Telegram", when: "вчера", status: "new", listing: 0 },
];

const TASKS: {
  icon: IconName;
  title: string;
  detail: string;
  due: string;
  state: "today" | "overdue" | "upcoming";
  done?: boolean;
}[] = [
  { icon: "map-pin", title: "Показ объекта", detail: "Участок в Байтик · Нурлан Асанов", due: "Сегодня, 15:00", state: "today" },
  { icon: "phone", title: "Звонок клиенту", detail: "Жамиля Кадырова · обсудить цену коттеджа", due: "Сегодня, 17:30", state: "today" },
  { icon: "video", title: "Загрузить видеообзор", detail: "Участок 8 соток · Кой-Таш", due: "Просрочено", state: "overdue" },
  { icon: "file", title: "Подготовить договор задатка", detail: "Коттедж 180 м² в Джал", due: "Завтра", state: "upcoming" },
  { icon: "check-circle", title: "Обновить цену объекта", detail: "Коттедж в Джал · −3% к рынку", due: "До пятницы", state: "upcoming", done: true },
];

const TASK_STATE: Record<"today" | "overdue" | "upcoming", { tone: "gold" | "danger" | "neutral" }> = {
  today: { tone: "gold" },
  overdue: { tone: "danger" },
  upcoming: { tone: "neutral" },
};

const AI_ACTIONS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "wand", title: "Описание объекта", desc: "Продающий текст и характеристики за 10 секунд" },
  { icon: "file", title: "Презентация (PDF)", desc: "Инвест-презентация объекта для клиента" },
  { icon: "chat", title: "Ответ клиенту", desc: "Черновик ответа на заявку в WhatsApp" },
  { icon: "sparkles", title: "Пост для соцсетей", desc: "Instagram и Telegram с сильным хуком" },
];

export default function BrokerDashboardPage() {
  const broker = getBroker("azamat-osmonov");
  if (!broker) notFound();

  const listings = propertiesByBroker(broker.id);
  const newLeads = INCOMING_LEADS.filter((l) => l.status === "new").length;
  const todayTasks = TASKS.filter((t) => t.state === "today" && !t.done).length;

  const nav: DashNavItem[] = [
    { label: "Обзор", icon: "home", active: true },
    { label: "Мои объекты", icon: "building", count: broker.activeListings },
    { label: "Лиды", icon: "chat", count: newLeads },
    { label: "Задачи", icon: "check-circle", count: todayTasks },
    { label: "AI-инструменты", icon: "wand" },
  ];

  return (
    <DashboardShell
      roleLabel="Кабинет брокера"
      user={{ name: broker.name, tone: broker.photoTone, meta: "Брокер · MULK" }}
      nav={nav}
      roleSwitch={{ label: "Кабинет продавца", href: "/dashboard/seller", icon: "users" }}
    >
      {/* ───────────── Приветствие ───────────── */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-8 text-text-invert shadow-lift sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-64 w-64 rounded-full bg-emerald/10 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow text-gold-bright">
              <Icon name="shield" size={14} />
              Кабинет брокера
            </span>
            <h1 className="mt-4 font-display text-3xl leading-[1.08] sm:text-4xl">
              С возвращением, {broker.name.split(" ")[0]}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Сегодня {todayTasks}{" "}
              {pluralize(todayTasks, ["задача", "задачи", "задач"])} и{" "}
              <span className="font-semibold text-gold-bright">
                {newLeads} {pluralize(newLeads, ["новый лид", "новых лида", "новых лидов"])}
              </span>{" "}
              ждут вашего ответа. Не упустите горячие обращения.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/sell" variant="primary" icon="home">
                Добавить объект
              </Button>
              <Button href="#ai" variant="gold-outline" icon="wand">
                AI-презентация
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <Avatar name={broker.name} tone={broker.photoTone} size="lg" />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gold-bright">
                <Icon name="star" size={15} />
                {broker.rating.toFixed(1)}
                <span className="font-normal text-white/50">· {broker.reviews} отзывов</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {broker.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/75"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Метрики ───────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon="check-circle"
          tone="emerald"
          value={String(broker.dealsClosed)}
          label="Сделок закрыто"
          hint="за всё время работы"
        />
        <MetricCard
          icon="building"
          tone="gold"
          value={String(broker.activeListings)}
          label="Объектов в работе"
          hint={`${listings.length} требуют внимания`}
        />
        <MetricCard
          icon="trending"
          value={`${broker.avgDaysToSell} дн`}
          label="Средний срок продажи"
          trend={{ value: "быстрее рынка", up: true }}
        />
        <MetricCard
          icon="star"
          tone="gold"
          value={broker.rating.toFixed(1)}
          label="Рейтинг брокера"
          hint={`${broker.reviews} ${pluralize(broker.reviews, ["отзыв", "отзыва", "отзывов"])}`}
        />
      </div>

      {/* ───────────── Объекты + Задачи ───────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Мои объекты"
          icon="building"
          eyebrow="В продаже"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <Button href="/sell" variant="outline" size="sm" icon="home">
              Добавить
            </Button>
          }
        >
          <ul className="divide-y divide-line">
            {listings.map((p, i) => {
              const st = LISTING_STATS[i];
              return (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                  <PropertyMedia
                    tone={p.mediaTone}
                    category={p.category}
                    rounded="rounded-lg"
                    className="h-12 w-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-1 text-sm font-semibold text-text">{p.title}</span>
                      {st?.hot && (
                        <Badge tone="danger" icon="flame" className="hidden shrink-0 sm:inline-flex">
                          Спрос
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-soft">
                      <span className="font-semibold text-text">{formatPrice(p.price)}</span>
                      <span>{st?.views.toLocaleString("ru-RU")} просм.</span>
                      <span className="inline-flex items-center gap-1 font-medium text-gold">
                        <Icon name="chat" size={12} />
                        {st?.leads}
                      </span>
                      <span className="text-text-muted">{st?.days} дн в продаже</span>
                    </div>
                  </div>
                  <Link
                    href={`/property/${p.slug}`}
                    className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-gold hover:text-ink sm:inline-flex"
                  >
                    Открыть
                    <Icon name="arrow-up-right" size={14} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          title="Задачи на сегодня"
          icon="check-circle"
          eyebrow="План дня"
          className="lg:col-span-1"
          action={<span className="text-xs font-medium text-text-muted">{todayTasks} активных</span>}
        >
          <ul className="space-y-3">
            {TASKS.map((task, i) => {
              const state = TASK_STATE[task.state];
              return (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      task.done
                        ? "border-emerald bg-emerald-soft text-emerald"
                        : "border-line-strong text-transparent",
                    )}
                  >
                    <Icon name="check" size={12} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon name={task.icon} size={14} className="shrink-0 text-text-muted" />
                      <span
                        className={cn(
                          "text-sm font-semibold text-text",
                          task.done && "text-text-muted line-through",
                        )}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="mt-0.5 line-clamp-1 pl-6 text-xs text-text-soft">
                      {task.detail}
                    </div>
                    <div className="mt-1.5 pl-6">
                      <Badge tone={state.tone}>{task.due}</Badge>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* ───────────── Лиды + AI-помощник ───────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Входящие лиды"
          icon="chat"
          eyebrow="Заявки и обращения"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={
            <span className="text-xs font-medium text-text-muted">
              {newLeads} {pluralize(newLeads, ["новый", "новых", "новых"])}
            </span>
          }
        >
          <ul className="divide-y divide-line">
            {INCOMING_LEADS.map((lead, i) => {
              const p = listings[lead.listing] ?? listings[0];
              const s = LEAD_STATUS[lead.status];
              return (
                <li key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={lead.name} tone={lead.tone} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-text">{lead.name}</span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-text-muted">
                        <Icon name={lead.channel} size={11} />
                        {lead.channelLabel}
                      </span>
                    </div>
                    <div className="truncate text-xs text-text-soft">
                      {p.title} · {lead.when}
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
              Все лиды и история
              <Icon name="arrow-right" size={13} />
            </Link>
          </div>
        </Panel>

        <Panel title="AI-помощник" icon="wand" eyebrow="Генерация" className="lg:col-span-1">
          <div id="ai" className="scroll-mt-24 space-y-2">
            {AI_ACTIONS.map((a) => (
              <button
                key={a.title}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface-2 p-3 text-left transition-colors hover:border-gold/50 hover:bg-gold-wash/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-wash text-gold">
                  <Icon name={a.icon} size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text">{a.title}</span>
                  <span className="block text-xs leading-snug text-text-soft">{a.desc}</span>
                </span>
                <Icon name="chevron-right" size={16} className="shrink-0 text-text-muted" />
              </button>
            ))}
          </div>
          <p className="mt-4 border-t border-line pt-4 text-[11px] leading-relaxed text-text-muted">
            {AI_DISCLAIMER}
          </p>
        </Panel>
      </div>
    </DashboardShell>
  );
}
