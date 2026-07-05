import type { Metadata } from "next";
import { properties } from "@/lib/data/properties";
import { districts } from "@/lib/data/districts";
import {
  CATEGORY_LABELS,
  type Category,
  type DealType,
  type Tier,
} from "@/lib/types";
import { pluralize } from "@/lib/utils";
import { CatalogClient, type CatalogInitial } from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог недвижимости",
  description:
    "Проверенные квартиры, дома, участки и коммерция в Бишкеке и по Кыргызстану. Фильтры по категории, району, цене и уровню объекта, AI-оценка каждого лота.",
};

const CATS = Object.keys(CATEGORY_LABELS) as Category[];
const TIERS: Tier[] = ["standard", "premium", "elite", "investment"];

function first(v?: string | string[]): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const rawCat = first(sp.category);
  const category: CatalogInitial["category"] =
    rawCat && CATS.includes(rawCat as Category) ? (rawCat as Category) : "all";

  const rawTier = first(sp.tier);
  const tier: CatalogInitial["tier"] =
    rawTier && TIERS.includes(rawTier as Tier) ? (rawTier as Tier) : "all";

  const rawDeal = first(sp.deal);
  const deal: DealType | "all" =
    rawDeal === "sale" || rawDeal === "rent" ? rawDeal : "all";

  const q = (first(sp.q) ?? "").trim();

  // Район приходит как имя или slug — приводим к каноничному имени района.
  const rawDistrict = (first(sp.district) ?? "").trim();
  let district = "all";
  if (rawDistrict) {
    const bySlug = districts.find((d) => d.slug === rawDistrict);
    const byName = districts.find(
      (d) => d.name.toLowerCase() === rawDistrict.toLowerCase(),
    );
    district = bySlug?.name ?? byName?.name ?? rawDistrict;
  }

  const rawMax = first(sp.max);
  const maxNum = rawMax ? Number(rawMax) : NaN;
  const max = Number.isFinite(maxNum) && maxNum > 0 ? maxNum : null;

  const rawSort = first(sp.sort);
  const sort: CatalogInitial["sort"] =
    rawSort === "price-desc"
      ? "price-desc"
      : rawSort === "price-asc" || rawSort === "price"
        ? "price-asc"
        : "score";

  const initial: CatalogInitial = { category, q, district, tier, deal, max, sort };

  const total = properties.length;
  const districtCount = new Set(properties.map((p) => p.district)).size;

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container py-10 sm:py-14">
          <div className="eyebrow mb-3">Каталог</div>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-text sm:text-5xl">
            Каталог недвижимости
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-soft">
            Только проверенные объекты с прозрачными документами и AI-оценкой
            ликвидности. Настройте фильтры под задачу — или опишите запрос
            словами, и наш подбор соберёт варианты за вас.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
            <span>
              <span className="font-semibold text-text">{total}</span>{" "}
              {pluralize(total, ["объект", "объекта", "объектов"])} в продаже
            </span>
            <span className="hidden h-4 w-px bg-line sm:inline-block" />
            <span>
              <span className="font-semibold text-text">{districtCount}</span>{" "}
              {pluralize(districtCount, ["район", "района", "районов"])} Бишкека и
              региона
            </span>
            <span className="hidden h-4 w-px bg-line sm:inline-block" />
            <span>Каждый лот проверен брокером MULK</span>
          </div>
        </div>
      </div>

      <CatalogClient properties={properties} initial={initial} />
    </>
  );
}
