import type { Category, Property } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { PropertyMedia } from "@/components/PropertyMedia";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_ICON } from "@/components/ui/category";

/** Подписи для «кадров» галереи по категории объекта. */
const CAPTIONS: Record<Category, [string, string, string, string]> = {
  land: ["Форма надела", "Подъезд к участку", "Вид на горы", "Границы и рельеф"],
  house: ["Фасад дома", "Гостиная зона", "Участок и двор", "Терраса"],
  apartment: ["Гостиная", "Кухня-столовая", "Вид из окна", "Санузел"],
  room: ["Комната", "Общая зона", "Вид из окна", "Санузел"],
  commercial: ["Входная группа", "Торговый зал", "Витрина / фасад", "Подсобные зоны"],
};

/**
 * Медиа-галерея объекта: крупный кадр 16:9 + строка миниатюр.
 * Внешних фото нет — используем фирменные градиент-плейсхолдеры MULK
 * с тоном, варьируемым по соседним значениям.
 */
export function Gallery({ property }: { property: Property }) {
  const p = property;
  const caps = CAPTIONS[p.category];

  return (
    <div className="space-y-3">
      <PropertyMedia
        tone={p.mediaTone}
        category={p.category}
        rounded="rounded-3xl"
        className="aspect-[16/9] shadow-soft ring-1 ring-black/5"
      >
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            <Icon name={CATEGORY_ICON[p.category]} size={13} />
            {CATEGORY_LABELS[p.category]}
          </span>
          {p.videoSec && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <Icon name="play" size={12} />
              Видеообзор · {p.videoSec}с
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            Премиальная фото- и видеосъёмка MULK
          </span>
        </div>
      </PropertyMedia>

      <div className="grid grid-cols-4 gap-3">
        {caps.map((caption, i) => (
          <PropertyMedia
            key={caption}
            tone={p.mediaTone + i + 1}
            category={p.category}
            rounded="rounded-xl"
            className="aspect-[4/3] ring-1 ring-black/5"
          >
            <span className="absolute inset-x-0 bottom-0 truncate p-2 text-[10px] font-medium text-white/85 sm:text-[11px]">
              {caption}
            </span>
          </PropertyMedia>
        ))}
      </div>
    </div>
  );
}
