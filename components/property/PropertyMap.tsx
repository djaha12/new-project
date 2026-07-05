import type { NearbyPlace } from "@/lib/poi";
import { gis2Url, gis2Search } from "@/lib/gis";
import { Icon } from "@/components/ui/Icon";

const fmtM = (m: number) => (m < 950 ? `${m} м` : `${(m / 1000).toFixed(1).replace(".", ",")} км`);

/**
 * Мини-карта на реальных координатах: объект в центре, ближайшие места 2ГИС
 * расставлены по их настоящим широте/долготе. Self-contained SVG — без внешних
 * тайлов и библиотек.
 */
export function PropertyMap({
  lat,
  lng,
  pins,
  radiusM,
  address,
}: {
  lat: number;
  lng: number;
  pins: NearbyPlace[];
  radiusM: number;
  address: string;
}) {
  const W = 400;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 26; // радиус карты в px
  const cosLat = Math.cos((lat * Math.PI) / 180);

  // Радиальный масштаб — корневой: сохраняем реальное направление на объект,
  // но «раздвигаем» близкие точки, иначе в плотном центре все пины слипаются.
  const ringPx = (m: number) => R * Math.sqrt(Math.min(m, radiusM) / radiusM);

  const project = (plat: number, plng: number) => {
    const northM = (plat - lat) * 111320;
    const eastM = (plng - lng) * 111320 * cosLat;
    const distM = Math.hypot(northM, eastM) || 1;
    const px = ringPx(distM);
    return { x: cx + (eastM / distM) * px, y: cy - (northM / distM) * px };
  };

  const rings = [500, 1000, 1500].filter((r) => r <= radiusM + 1);

  // Расставляем пины и мягко разводим накладывающиеся (declutter).
  const placed: { x: number; y: number; p: NearbyPlace }[] = [];
  for (const p of pins.slice(0, 12)) {
    let { x, y } = project(p.lat, p.lng);
    for (let iter = 0; iter < 12; iter++) {
      const hit = placed.find((q) => Math.hypot(q.x - x, q.y - y) < 23);
      if (!hit) break;
      const a = Math.atan2(y - hit.y || 0.01, x - hit.x || 0.01);
      x = hit.x + Math.cos(a) * 23;
      y = hit.y + Math.sin(a) * 23;
    }
    // держим внутри рамки
    const d = Math.hypot(x - cx, y - cy);
    if (d > R - 8) { const k = (R - 8) / d; x = cx + (x - cx) * k; y = cy + (y - cy) * k; }
    placed.push({ x, y, p });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          style={{ background: "linear-gradient(160deg,#F2EFE9,#EBE6DC)" }}
          role="img"
          aria-label="Карта окружения объекта по данным 2ГИС"
        >
          {/* лёгкая сетка «улиц» */}
          {[80, 160, 240, 320].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke="#00000008" strokeWidth={8} />
          ))}
          {[80, 160, 240].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke="#00000008" strokeWidth={8} />
          ))}

          {/* кольца радиусов */}
          {rings.map((r) => (
            <g key={r}>
              <circle cx={cx} cy={cy} r={ringPx(r)} fill="none" stroke="#B98B3E" strokeOpacity={0.28} strokeWidth={1} strokeDasharray="3 4" />
              <text x={cx} y={cy - ringPx(r) + 12} textAnchor="middle" fontSize={9} fill="#9B7B3A" fontWeight={600}>
                {r < 1000 ? `${r} м` : `${(r / 1000).toFixed(1).replace(".", ",")} км`}
              </text>
            </g>
          ))}

          {/* пины POI (реальные места 2ГИС) — кликабельны, открываются в 2ГИС */}
          {placed.map(({ x, y, p }, i) => (
            <a
              key={i}
              href={gis2Search(p.name, p.lat, p.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="group/pin"
              style={{ cursor: "pointer" }}
            >
              <title>
                {`${p.name} · ${fmtM(p.distM)} · ${p.walkMin} мин пешком${
                  p.rating != null ? ` · ★ ${p.rating.toFixed(1)}` : ""
                } — открыть в 2ГИС`}
              </title>
              {/* невидимая увеличенная зона клика */}
              <circle cx={x} cy={y} r={14} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={11}
                fill="#fff"
                stroke="#E7E2D9"
                strokeWidth={1}
                className="transition-all group-hover/pin:stroke-[#B98B3E] group-hover/pin:stroke-2"
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12}>
                {p.emoji}
              </text>
            </a>
          ))}

          {/* объект в центре */}
          <circle cx={cx} cy={cy} r={16} fill="#B98B3E" fillOpacity={0.16} />
          <circle cx={cx} cy={cy} r={8} fill="#B98B3E" stroke="#fff" strokeWidth={2} />
        </svg>

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink shadow-soft backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-gold" /> Объект
        </span>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-medium text-text-soft shadow-soft backdrop-blur">
          <Icon name="arrow-up-right" size={11} className="text-gold" /> Нажмите на место — откроется в 2ГИС
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-text-soft">
          <Icon name="map-pin" size={15} className="shrink-0 text-gold" />
          <span className="truncate">{address}</span>
        </div>
        <a
          href={gis2Url(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-ink"
        >
          Открыть в 2ГИС
          <Icon name="arrow-up-right" size={13} />
        </a>
      </div>
    </div>
  );
}
