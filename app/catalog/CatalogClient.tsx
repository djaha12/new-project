"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  TIER_LABELS,
  type Category,
  type DealType,
  type Property,
  type Tier,
} from "@/lib/types";
import { districts } from "@/lib/data/districts";
import { cn, formatPrice, pluralize } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CATEGORY_ICON } from "@/components/ui/category";
import { PropertyCard } from "@/components/PropertyCard";
import { SavedSearches } from "@/components/saved/SavedSearches";
import nearbyGroups from "@/lib/data/nearbyGroups.json";

// Предвычисленные группы 2ГИС рядом с каждым объектом (радиус 1,5 км).
const groupsData = nearbyGroups as Record<string, Record<string, number>>;

// Фильтр «Рядом есть» — по группам инфраструктуры 2ГИС.
const AMENITIES: { key: string; label: string; icon: IconName }[] = [
  { key: "education", label: "Школа / садик", icon: "landmark" },
  { key: "shops", label: "Магазины", icon: "store" },
  { key: "health", label: "Аптека / врач", icon: "shield" },
  { key: "finance", label: "Банк", icon: "layers" },
  { key: "sport", label: "Спорт", icon: "trending" },
  { key: "food", label: "Кафе", icon: "flame" },
];

type CategoryFilter = Category | "all";
type TierFilter = Tier | "all";
type DealFilter = DealType | "all";
type SortKey = "score" | "price-asc" | "price-desc";

/** Начальные значения фильтров, вычисленные из searchParams на сервере. */
export interface CatalogInitial {
  category: CategoryFilter;
  q: string;
  district: string; // "all" или имя района
  tier: TierFilter;
  deal: DealFilter;
  max: number | null;
  sort: SortKey;
}

const CATS = Object.keys(CATEGORY_LABELS) as Category[];
const TIERS: Tier[] = ["standard", "premium", "elite", "investment"];

const DEALS: { key: DealFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "sale", label: "Продажа" },
  { key: "rent", label: "Аренда" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "По AI-оценке" },
  { key: "price-asc", label: "Сначала дешевле" },
  { key: "price-desc", label: "Сначала дороже" },
];

function roundTo(value: number, step: number, dir: "up" | "down"): number {
  const fn = dir === "up" ? Math.ceil : Math.floor;
  return fn(value / step) * step;
}

export function CatalogClient({ properties }: { properties: Property[] }) {
  // Границы ползунка цены — из реального инвентаря.
  const priceCeil = useMemo(
    () => roundTo(Math.max(...properties.map((p) => p.price)), 10000, "up"),
    [properties],
  );
  const priceFloor = useMemo(
    () => roundTo(Math.min(...properties.map((p) => p.price)), 10000, "down"),
    [properties],
  );

  // Список районов, реально представленных в каталоге.
  const districtOptions = useMemo(
    () =>
      Array.from(new Set(properties.map((p) => p.district))).sort((a, b) =>
        a.localeCompare(b, "ru"),
      ),
    [properties],
  );

  // Дефолтные фильтры (страница статическая); значения из URL применяем на клиенте.
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [tier, setTier] = useState<TierFilter>("all");
  const [deal, setDeal] = useState<DealFilter>("all");
  const [district, setDistrict] = useState<string>("all");
  const [q, setQ] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("score");
  const [maxPrice, setMaxPrice] = useState<number>(priceCeil);
  const [showFilters, setShowFilters] = useState(false);

  const toggleAmenity = (key: string) =>
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  // Применяем фильтры из URL (?category=&q=&district=&tier=&deal=&max=&sort=)
  // после монтирования — так первый рендер совпадает с SSR (нет рассинхрона).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const cat = sp.get("category");
    if (cat && CATS.includes(cat as Category)) setCategory(cat as Category);
    const t = sp.get("tier");
    if (t && TIERS.includes(t as Tier)) setTier(t as Tier);
    const d = sp.get("deal");
    if (d === "sale" || d === "rent") setDeal(d);
    const query = sp.get("q");
    if (query) setQ(query.trim());
    const so = sp.get("sort");
    if (so === "price-desc") setSort("price-desc");
    else if (so === "price-asc" || so === "price") setSort("price-asc");
    const rawDistrict = (sp.get("district") ?? "").trim();
    if (rawDistrict) {
      const bySlug = districts.find((x) => x.slug === rawDistrict);
      const byName = districts.find((x) => x.name.toLowerCase() === rawDistrict.toLowerCase());
      const name = bySlug?.name ?? byName?.name ?? rawDistrict;
      if (districtOptions.includes(name)) setDistrict(name);
    }
    const mx = Number(sp.get("max"));
    if (Number.isFinite(mx) && mx > 0) setMaxPrice(Math.min(Math.max(mx, priceFloor), priceCeil));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const priceIsCapped = maxPrice < priceCeil;

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const filtered = properties.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (tier !== "all" && p.tier !== tier) return false;
      if (deal !== "all" && p.dealType !== deal) return false;
      if (district !== "all" && p.district !== district) return false;
      if (priceIsCapped && p.price > maxPrice) return false;
      if (
        amenities.length &&
        !amenities.every((a) => (groupsData[p.id]?.[a] ?? 0) > 0)
      )
        return false;
      if (needle) {
        const haystack = [
          p.title,
          p.hook,
          p.district,
          p.address,
          p.city,
          p.country,
          p.badge ?? "",
          p.investmentTags.join(" "),
          p.reasons.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => b.aiScore.overall - a.aiScore.overall);

    return sorted;
  }, [properties, category, tier, deal, district, priceIsCapped, maxPrice, q, amenities, sort]);

  const count = results.length;
  const hasActiveFilters =
    category !== "all" ||
    tier !== "all" ||
    deal !== "all" ||
    district !== "all" ||
    q.trim() !== "" ||
    amenities.length > 0 ||
    priceIsCapped;

  function reset() {
    setCategory("all");
    setTier("all");
    setDeal("all");
    setDistrict("all");
    setQ("");
    setAmenities([]);
    setMaxPrice(priceCeil);
    setSort("score");
  }

  const priceQuickPicks = [50000, 100000, 150000, 200000].filter(
    (v) => v > priceFloor && v < priceCeil,
  );

  return (
    <Section className="bg-surface-2">
      {/* Категории — крупные пиллы над каталогом */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
          <Pill active={category === "all"} onClick={() => setCategory("all")}>
            Все объекты
          </Pill>
          {CATS.map((c) => (
            <Pill
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              icon={CATEGORY_ICON[c]}
            >
              {CATEGORY_LABELS[c]}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Панель фильтров */}
        <aside className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-text">Фильтры</span>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-sm font-medium text-text"
            >
              <Icon name="layers" size={15} />
              {showFilters ? "Скрыть" : "Показать"}
            </button>
          </div>

          <div
            className={cn(
              "space-y-6 rounded-2xl border border-line bg-surface p-5 shadow-soft lg:sticky lg:top-24 lg:block",
              showFilters ? "block" : "hidden",
            )}
          >
            {/* Поиск по тексту */}
            <div>
              <FilterLabel>Поиск</FilterLabel>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3">
                <Icon name="search" size={17} className="text-text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Район, ЖК, слово…"
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
                />
                {q && (
                  <button
                    onClick={() => setQ("")}
                    aria-label="Очистить"
                    className="text-text-muted transition-colors hover:text-text"
                  >
                    <Icon name="x" size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Максимальная цена */}
            <div>
              <div className="flex items-center justify-between">
                <FilterLabel>Цена, до</FilterLabel>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    priceIsCapped ? "text-gold" : "text-text-muted",
                  )}
                >
                  {priceIsCapped ? formatPrice(maxPrice) : "Любая"}
                </span>
              </div>
              <input
                type="range"
                min={priceFloor}
                max={priceCeil}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full cursor-pointer accent-gold"
                aria-label="Максимальная цена"
              />
              <div className="mt-1 flex justify-between text-[11px] text-text-muted">
                <span>{formatPrice(priceFloor)}</span>
                <span>{formatPrice(priceCeil)}+</span>
              </div>
              {priceQuickPicks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {priceQuickPicks.map((v) => (
                    <button
                      key={v}
                      onClick={() => setMaxPrice(v)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                        maxPrice === v
                          ? "border-gold bg-gold-wash text-gold"
                          : "border-line bg-surface text-text-soft hover:border-gold hover:text-gold",
                      )}
                    >
                      до {formatPrice(v)}
                    </button>
                  ))}
                  <button
                    onClick={() => setMaxPrice(priceCeil)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      !priceIsCapped
                        ? "border-gold bg-gold-wash text-gold"
                        : "border-line bg-surface text-text-soft hover:border-gold hover:text-gold",
                    )}
                  >
                    Любая
                  </button>
                </div>
              )}
            </div>

            {/* Уровень объекта */}
            <div>
              <FilterLabel>Уровень объекта</FilterLabel>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Chip active={tier === "all"} onClick={() => setTier("all")}>
                  Все
                </Chip>
                {TIERS.map((t) => (
                  <Chip
                    key={t}
                    active={tier === t}
                    onClick={() => setTier(t)}
                  >
                    {TIER_LABELS[t]}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Район */}
            <div>
              <FilterLabel>Район</FilterLabel>
              <div className="relative mt-2">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-line bg-surface-2 pl-3 pr-9 text-sm text-text outline-none transition-colors focus:border-gold"
                >
                  <option value="all">Любой район</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
              </div>
            </div>

            {/* Тип сделки */}
            <div>
              <FilterLabel>Тип сделки</FilterLabel>
              <div className="mt-2 flex rounded-xl border border-line bg-surface-2 p-1">
                {DEALS.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDeal(d.key)}
                    className={cn(
                      "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                      deal === d.key
                        ? "bg-surface text-text shadow-soft"
                        : "text-text-muted hover:text-text",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Рядом есть (данные 2ГИС) */}
            <div>
              <div className="flex items-center justify-between">
                <FilterLabel>Рядом есть</FilterLabel>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald">
                  <Icon name="map-pin" size={11} /> 2ГИС
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {AMENITIES.map((a) => {
                  const active = amenities.includes(a.key);
                  return (
                    <button
                      key={a.key}
                      onClick={() => toggleAmenity(a.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "border-emerald bg-emerald-soft text-emerald"
                          : "border-line bg-surface text-text-soft hover:border-emerald hover:text-emerald",
                      )}
                    >
                      <Icon name={a.icon} size={13} />
                      {a.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-text-muted">
                Показываем объекты, у которых выбранное есть в пешей доступности (по данным 2ГИС).
              </p>
            </div>

            {hasActiveFilters && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-soft transition-colors hover:text-gold"
              >
                <Icon name="x" size={15} />
                Сбросить фильтры
              </button>
            )}

            <SavedSearches className="border-t border-line pt-5" />
          </div>
        </aside>

        {/* Результаты */}
        <div className="lg:col-span-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-soft">
              Найдено{" "}
              <span className="font-semibold text-text">{count}</span>{" "}
              {pluralize(count, ["объект", "объекта", "объектов"])}
            </p>

            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-text-muted sm:inline">
                Сортировать
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 appearance-none rounded-xl border border-line bg-surface pl-3.5 pr-9 text-sm font-medium text-text outline-none transition-colors focus:border-gold"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
              </div>
            </div>
          </div>

          {count > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  className="animate-fade-up"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-gold-bright">
                <Icon name="sparkles" size={26} />
              </span>
              <h3 className="mt-5 font-display text-2xl text-text">
                Под эти фильтры объектов пока нет
              </h3>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-text-soft">
                Смягчите условия или опишите задачу словами — AI-подбор соберёт
                варианты из всей базы и предложит близкие альтернативы.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button href="/ai" icon="sparkles">
                  Подобрать через AI
                </Button>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={reset} icon="x">
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* — Локальные UI-элементы фильтра — */

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
      {children}
    </span>
  );
}

function Pill({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: Parameters<typeof Icon>[0]["name"];
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-ink bg-ink text-text-invert shadow-soft"
          : "border-line-strong bg-surface text-text-soft hover:border-ink hover:text-text",
      )}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-gold bg-gold-wash text-gold"
          : "border-line bg-surface text-text-soft hover:border-gold hover:text-gold",
      )}
    >
      {children}
    </button>
  );
}
