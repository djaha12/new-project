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

  const rings = [500, 1000, 1500, 3000].filter((r) => r <= radiusM + 1);

  // Кластеризация: соседние по экрану места сливаем в один маркер со счётчиком,
  // чтобы при большом радиусе карта не превращалась в кашу из пинов.
  const CLUSTER_PX = 22;
  type Cluster = { x: number; y: number; members: NearbyPlace[] };
  const clusters: Cluster[] = [];
  for (const p of pins) {
    // pins отсортированы по возрастанию расстояния — первый в кластере ближайший
    let { x, y } = project(p.lat, p.lng);
    const d = Math.hypot(x - cx, y - cy);
    if (d > R - 8) { const k = (R - 8) / d; x = cx + (x - cx) * k; y = cy + (y - cy) * k; }
    const near = clusters.find((c) => Math.hypot(c.x - x, c.y - y) < CLUSTER_PX);
    if (near) near.members.push(p);
    else clusters.push({ x, y, members: [p] });
  }
  // Не более 20 маркеров — оставляем ближайшие (по первому члену).
  const shown = clusters
    .sort((a, b) => a.members[0].distM - b.members[0].distM)
    .slice(0, 20);

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

          {/* маркеры 2ГИС — одиночные места или кластеры со счётчиком, кликабельны */}
          {shown.map(({ x, y, members }, i) => {
            const rep = members[0];
            const n = members.length;
            const title =
              n === 1
                ? `${rep.name} · ${fmtM(rep.distM)} · ${rep.walkMin} мин${
                    rep.rating != null ? ` · ★ ${rep.rating.toFixed(1)}` : ""
                  } — открыть в 2ГИС`
                : `${n} мест 2ГИС рядом · ближайшее: ${rep.name} (${fmtM(rep.distM)}) — открыть в 2ГИС`;
            return (
              <a
                key={i}
                href={gis2Search(rep.name, rep.lat, rep.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="group/pin"
                style={{ cursor: "pointer" }}
              >
                <title>{title}</title>
                <circle cx={x} cy={y} r={16} fill="transparent" />
                <circle
                  cx={x}
                  cy={y}
                  r={n > 1 ? 13 : 11}
                  fill="#fff"
                  stroke={n > 1 ? "#B98B3E" : "#E7E2D9"}
                  strokeWidth={n > 1 ? 1.5 : 1}
                  className="transition-all group-hover/pin:stroke-[#B98B3E] group-hover/pin:stroke-2"
                />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12}>
                  {rep.emoji}
                </text>
                {n > 1 && (
                  <>
                    <circle cx={x + 10} cy={y - 10} r={7} fill="#0C1116" />
                    <text
                      x={x + 10}
                      y={y - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={8}
                      fontWeight={700}
                      fill="#fff"
                    >
                      {n}
                    </text>
                  </>
                )}
              </a>
            );
          })}

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
