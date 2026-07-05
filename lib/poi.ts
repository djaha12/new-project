import poiRaw from "@/lib/data/poi.json";
import type { IconName } from "@/components/ui/Icon";

/**
 * Слой инфраструктуры на реальных данных 2ГИС (3176 мест по Бишкеку).
 * Используется ТОЛЬКО на сервере (страницы объектов — SSG), поэтому весь
 * набор данных остаётся на этапе сборки и не попадает в клиентский бандл —
 * в разметку идёт лишь небольшой вычисленный результат «что рядом».
 */

export interface Poi {
  n: string; // название
  c: string; // категория (слаг)
  b: string; // широкая категория
  e: string; // эмодзи
  la: number;
  lo: number;
  a: string; // адрес
  r: number | null; // рейтинг
  rv: number; // отзывы
}

const POIS = poiRaw as Poi[];

// ── Группировка 98 категорий в понятные покупателю группы ──
export interface GroupDef {
  key: string;
  label: string;
  icon: IconName;
  order: number;
}

export const GROUPS: Record<string, GroupDef> = {
  education: { key: "education", label: "Школы и сады", icon: "landmark", order: 1 },
  shops: { key: "shops", label: "Магазины и продукты", icon: "store", order: 2 },
  health: { key: "health", label: "Здоровье и аптеки", icon: "shield", order: 3 },
  food: { key: "food", label: "Кафе и рестораны", icon: "flame", order: 4 },
  finance: { key: "finance", label: "Банки и обмен", icon: "layers", order: 5 },
  sport: { key: "sport", label: "Спорт и фитнес", icon: "trending", order: 6 },
  beauty: { key: "beauty", label: "Красота и услуги", icon: "sparkles", order: 7 },
  auto: { key: "auto", label: "Авто и АЗС", icon: "car", order: 8 },
};

const EXPLICIT: Record<string, string> = {
  gym: "sport", cafe: "food", beauty_salon: "beauty", beauty_and_spa: "beauty",
  health_and_medical: "health", restaurant: "food", education: "education",
  fast_food_restaurant: "food", coffee_shop: "food", bar: "food", supermarket: "shops",
  school: "education", gas_station: "auto", dentist: "health", pharmacy: "health",
  college_university: "education", pizza_restaurant: "food", car_repair: "auto",
  bank_credit_union: "finance", clothing_store: "shops", optometrist: "health",
  car_wash: "auto", preschool: "education", flowers_and_gifts_shop: "shops",
  bakery: "food", hospital: "health", tire_shop: "auto", pet_store: "shops",
  jewelry_store: "shops", furniture_store: "shops", driving_school: "education",
  music_school: "education", sushi_restaurant: "food", medical_lab: "health",
  shoe_store: "shops", veterinary_care: "health", shopping_center: "shops",
  currency_exchange: "finance", grocery_store: "shops", mobile_phone_store: "shops",
  medical_center: "health", spas: "beauty", sports_complex: "sport",
  campus_building: "education", electronics_store: "shops", nail_salon: "beauty",
  barber: "beauty", convenience_store: "shops",
};

/** Определяет группу по слагу: сперва явная карта, затем ключевые слова. */
function groupOf(slug: string): string | null {
  if (EXPLICIT[slug]) return EXPLICIT[slug];
  const s = slug.toLowerCase();
  if (/(restaurant|cafe|coffee|_bar|^bar|pizza|sushi|burger|bakery|pub|dessert|juice|smoothie|food)/.test(s)) return "food";
  if (/(school|educat|college|univers|campus|preschool|kindergar|day_care|language)/.test(s)) return "education";
  if (/(medical|health|hospital|dental|dentist|pharm|drugstore|clinic|optometr|eyewear|_lab|prenatal|surgeon|skin_care|veterin)/.test(s)) return "health";
  if (/(store|shop|supermarket|market|mall|shopping|boutique|superstore|retail|grocery|convenience|wear)/.test(s)) return "shops";
  if (/(gym|sport|fitness|active|skating|golf|driving_range)/.test(s)) return "sport";
  if (/(beauty|salon|barber|spa|nail|cosmetic|manicure)/.test(s)) return "beauty";
  if (/(bank|credit|currency|exchange|atm)/.test(s)) return "finance";
  if (/(gas|car|tire|auto|oil|vehicle|petrol|azs|dealer)/.test(s)) return "auto";
  return null;
}

// ── Геометрия ──
function haversineM(la1: number, lo1: number, la2: number, lo2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(la2 - la1);
  const dLon = toRad(lo2 - lo1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Пешая доступность, мин (≈ 80 м/мин). */
function walkMin(distM: number): number {
  return Math.max(1, Math.round(distM / 80));
}

// Bbox покрытия 2ГИС (Бишкек). Вне его показываем «нет данных».
const BBOX = { latMin: 42.74, latMax: 43.02, lngMin: 74.38, lngMax: 74.78 };

export function hasCoverage(lat: number, lng: number): boolean {
  return lat >= BBOX.latMin && lat <= BBOX.latMax && lng >= BBOX.lngMin && lng <= BBOX.lngMax;
}

export interface NearbyPlace {
  name: string;
  emoji: string;
  group: string;
  distM: number;
  walkMin: number;
  rating: number | null;
  reviews: number;
  lat: number;
  lng: number;
  address: string;
}

export interface NearbyGroup {
  key: string;
  label: string;
  icon: IconName;
  count: number; // в радиусе
  nearest: NearbyPlace;
}

export interface NearbyResult {
  groups: NearbyGroup[];
  pins: NearbyPlace[]; // ближайшие для карты
  total: number;
  radiusM: number;
}

/** Считает реальную инфраструктуру вокруг координат по данным 2ГИС. */
export function nearby(lat: number, lng: number, radiusM = 1500): NearbyResult | null {
  if (!hasCoverage(lat, lng)) return null;

  const within: NearbyPlace[] = [];
  for (const p of POIS) {
    const g = groupOf(p.c);
    if (!g) continue;
    const d = haversineM(lat, lng, p.la, p.lo);
    if (d > radiusM) continue;
    within.push({
      name: p.n,
      emoji: p.e,
      group: g,
      distM: Math.round(d),
      walkMin: walkMin(d),
      rating: p.r,
      reviews: p.rv,
      lat: p.la,
      lng: p.lo,
      address: p.a,
    });
  }
  if (!within.length) return null;

  within.sort((a, b) => a.distM - b.distM);

  const byGroup = new Map<string, NearbyPlace[]>();
  for (const w of within) {
    const list = byGroup.get(w.group) || [];
    list.push(w);
    byGroup.set(w.group, list);
  }

  const groups: NearbyGroup[] = [];
  for (const [key, list] of byGroup) {
    const def = GROUPS[key];
    if (!def) continue;
    groups.push({ key, label: def.label, icon: def.icon, count: list.length, nearest: list[0] });
  }
  groups.sort((a, b) => (GROUPS[a.key]?.order ?? 99) - (GROUPS[b.key]?.order ?? 99));

  // Пины для карты: ближайший из каждой группы + добить самыми близкими до 14.
  const pinSet = new Map<string, NearbyPlace>();
  for (const g of groups) pinSet.set(g.nearest.name + g.nearest.distM, g.nearest);
  for (const w of within) {
    if (pinSet.size >= 14) break;
    pinSet.set(w.name + w.distM, w);
  }

  return {
    groups,
    pins: [...pinSet.values()].sort((a, b) => a.distM - b.distM),
    total: within.length,
    radiusM,
  };
}

/** Ссылка на объект в 2ГИС по координатам. */
export function gis2Url(lat: number, lng: number): string {
  return `https://2gis.kg/bishkek?m=${lng}%2C${lat}%2F16`;
}
