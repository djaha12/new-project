import type { Metadata } from "next";
import { properties } from "@/lib/data/properties";
import { pluralize } from "@/lib/utils";
import { CatalogClient } from "./CatalogClient";

export const metadata: Metadata = {
  title: "Каталог недвижимости",
  description:
    "Проверенные квартиры, дома, участки и коммерция в Бишкеке и по Кыргызстану. Фильтры по категории, району, цене и уровню объекта, AI-оценка каждого лота.",
};

// Фильтры из URL читаются в CatalogClient на клиенте (window.location.search),
// поэтому страница остаётся полностью статической (годится для статик-экспорта).
export default function CatalogPage() {
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

      <CatalogClient properties={properties} />
    </>
  );
}
