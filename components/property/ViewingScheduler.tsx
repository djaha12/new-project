"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Price } from "@/components/Price";
import { LeadForm } from "@/components/LeadForm";

/* ── Локальные словари дат (без внешних библиотек) ───────────────── */
const WD_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const WD_FULL = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];
const MON_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];
const MON_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/* Слоты по времени, шаг 1 час. */
const PERIODS: { label: string; icon: IconName; hours: number[] }[] = [
  { label: "Утро", icon: "sun", hours: [9, 10, 11] },
  { label: "День", icon: "sun", hours: [12, 13, 14, 15, 16] },
  { label: "Вечер", icon: "star", hours: [17, 18, 19] },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → floating local datetime для .ics: 20260705T090000 */
function icsStamp(d: Date): string {
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    "00"
  );
}

/** Экранирование текстовых значений .ics (RFC 5545). */
function icsEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function ViewingScheduler({
  brokerName,
  brokerWhatsapp,
  propertyTitle,
  propertyAddress,
  priceUsd,
  coords,
  triggerClassName,
}: {
  brokerName: string;
  brokerWhatsapp: string;
  propertyTitle: string;
  propertyAddress: string;
  priceUsd: number;
  coords?: { lat: number; lng: number };
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [dayIdx, setDayIdx] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  /* Ближайшие 7 дней от сегодняшней даты. Считается на клиенте — модалка
     закрыта при SSR, поэтому расхождений гидратации нет. */
  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  /* Блокировка прокрутки фона + закрытие по Esc. */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedDay = days[dayIdx];
  const ready = hour !== null;

  const start = useMemo(() => {
    const d = new Date(selectedDay);
    d.setHours(hour ?? 0, 0, 0, 0);
    return d;
  }, [selectedDay, hour]);

  const timeLabel = ready ? `${pad(hour as number)}:00` : "";

  /* Естественная подводка «сегодня / завтра / в среду, 8 июля». */
  const dateWaLabel =
    dayIdx === 0
      ? "сегодня"
      : dayIdx === 1
        ? "завтра"
        : `в ${WD_FULL[selectedDay.getDay()]}, ${selectedDay.getDate()} ${MON_GEN[selectedDay.getMonth()]}`;

  const dateHumanLabel = `${dayIdx === 0 ? "Сегодня" : dayIdx === 1 ? "Завтра" : WD_FULL[selectedDay.getDay()][0].toUpperCase() + WD_FULL[selectedDay.getDay()].slice(1)}, ${selectedDay.getDate()} ${MON_GEN[selectedDay.getMonth()]}`;

  const waText = `Здравствуйте! Хочу записаться на просмотр: ${propertyTitle}, ${propertyAddress}. Удобно ${dateWaLabel} в ${timeLabel}.`;
  const waHref = `https://wa.me/${brokerWhatsapp}?text=${encodeURIComponent(waText)}`;

  function downloadIcs() {
    if (!ready) return;
    const end = new Date(start);
    end.setHours(start.getHours() + 1);
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MULK//Просмотр объекта//RU",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${Date.now()}-${Math.round(Math.random() * 1e6)}@mulk.kg`,
      `DTSTAMP:${icsStamp(new Date())}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${icsEscape(`Просмотр ${propertyTitle}`)}`,
      `LOCATION:${icsEscape(propertyAddress)}`,
      `DESCRIPTION:${icsEscape(
        `Личный показ объекта с брокером MULK — ${brokerName}. Адрес: ${propertyAddress}.`,
      )}`,
      ...(coords ? [`GEO:${coords.lat};${coords.lng}`] : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mulk-prosmotr.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="dark"
        icon="check-circle"
        className={triggerClassName}
      >
        Записаться на просмотр
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Запись на просмотр"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-fade-up flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-lift sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="relative border-b border-line bg-surface px-5 py-5 sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              >
                <Icon name="x" size={18} />
              </button>
              <p className="eyebrow">Личный показ</p>
              <h3 className="mt-1 font-display text-xl text-text sm:text-2xl">
                Записаться на просмотр
              </h3>
              <p className="mt-2 text-sm font-medium text-text">{propertyTitle}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-text-soft">
                <Icon name="map-pin" size={14} className="shrink-0 text-text-muted" />
                {propertyAddress}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                <Price usd={priceUsd} approx />
              </p>
            </div>

            {/* Тело */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {leadOpen ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setLeadOpen(false)}
                    className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-text-soft transition-colors hover:text-text"
                  >
                    <Icon name="chevron-right" size={16} className="rotate-180" />
                    Назад к выбору времени
                  </button>
                  <LeadForm
                    title="Оставить заявку на показ"
                    subtitle="Брокер сам подберёт удобное время и подтвердит запись."
                    cta="Отправить заявку"
                    context={
                      ready
                        ? `${propertyTitle} · ${dateHumanLabel}, ${timeLabel}`
                        : propertyTitle
                    }
                    className="border-0 p-0 shadow-none"
                  />
                </div>
              ) : (
                <>
                  {/* Выбор дня */}
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                    Выберите день
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {days.map((d, i) => {
                      const active = i === dayIdx;
                      return (
                        <button
                          key={d.toISOString()}
                          type="button"
                          onClick={() => setDayIdx(i)}
                          className={cn(
                            "flex flex-col items-center rounded-xl border py-2.5 transition-all",
                            active
                              ? "border-gold bg-gold-wash shadow-soft"
                              : "border-line bg-surface hover:border-line-strong hover:bg-surface-2",
                          )}
                        >
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-wide",
                              active ? "text-gold" : "text-text-muted",
                            )}
                          >
                            {i === 0 ? "сегодня" : i === 1 ? "завтра" : WD_SHORT[d.getDay()]}
                          </span>
                          <span
                            className={cn(
                              "mt-0.5 font-display text-lg leading-none",
                              active ? "text-gold" : "text-text",
                            )}
                          >
                            {d.getDate()}
                          </span>
                          <span
                            className={cn(
                              "text-[10px]",
                              active ? "text-gold/80" : "text-text-muted",
                            )}
                          >
                            {MON_SHORT[d.getMonth()]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Выбор времени */}
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                    Выберите время
                  </p>
                  <div className="mt-3 space-y-4">
                    {PERIODS.map((period) => (
                      <div key={period.label}>
                        <p className="flex items-center gap-1.5 text-sm font-medium text-text-soft">
                          <Icon
                            name={period.icon}
                            size={14}
                            className="text-text-muted"
                          />
                          {period.label}
                        </p>
                        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
                          {period.hours.map((h) => {
                            const active = hour === h;
                            return (
                              <button
                                key={h}
                                type="button"
                                onClick={() => setHour(h)}
                                className={cn(
                                  "rounded-lg border py-2 text-sm font-medium tabular-nums transition-all",
                                  active
                                    ? "border-ink bg-ink text-text-invert shadow-soft"
                                    : "border-line bg-surface text-text hover:border-line-strong hover:bg-surface-2",
                                )}
                              >
                                {pad(h)}:00
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Подтверждение выбора */}
                  {ready && (
                    <div className="mt-6 flex items-center gap-2 rounded-xl bg-gold-wash px-4 py-3 text-sm text-gold">
                      <Icon name="check-circle" size={18} className="shrink-0" />
                      <span>
                        Выбрано:{" "}
                        <span className="font-semibold">
                          {dateHumanLabel}, {timeLabel}
                        </span>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Действия */}
            {!leadOpen && (
              <div className="border-t border-line bg-surface-2 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Button
                    href={ready ? waHref : undefined}
                    onClick={ready ? () => setOpen(false) : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    icon="chat"
                    className={cn(
                      "w-full sm:flex-1",
                      !ready && "pointer-events-none opacity-50",
                    )}
                  >
                    Написать в WhatsApp
                  </Button>
                  <Button
                    onClick={downloadIcs}
                    variant="outline"
                    icon="file"
                    className={cn(
                      "w-full sm:flex-1",
                      !ready && "pointer-events-none opacity-50",
                    )}
                  >
                    В календарь (.ics)
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => setLeadOpen(true)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-text-soft transition-colors hover:text-text"
                >
                  <Icon name="chat" size={15} />
                  Или оставьте заявку — брокер подберёт время
                </button>
                {!ready && (
                  <p className="mt-2 text-center text-[11px] text-text-muted">
                    Выберите день и время, чтобы продолжить.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
