/** Категории объектов. */
export type Category =
  | "apartment"
  | "house"
  | "land"
  | "commercial"
  | "room";

export type DealType = "sale" | "rent";

/** Уровень объекта — управляет витринами «Премиум» и подборками. */
export type Tier = "standard" | "premium" | "elite" | "investment";

/** Статус пункта в блоке «Проверено» / коммуникациях. */
export type CheckStatus = "yes" | "no" | "near" | "partial" | "unknown";

/** Оценки AI Property Score. Каждая — 0..10, выше = лучше.
 *  Для `risks`: выше = меньше рисков (объект «чище»). */
export interface AiScore {
  overall: number;
  liquidity: number;
  price: number;
  documents: number;
  location: number;
  condition: number;
  potential: number;
  risks: number;
}

export interface KeyValue {
  label: string;
  value: string;
}

export interface CheckItem {
  label: string;
  status: CheckStatus;
  note?: string;
}

/** Сценарий застройки участка («Что можно построить?»). */
export interface BuildScenario {
  title: string;
  emoji: string;
  desc: string;
  budgetUsd: number;
  roiNote: string;
}

export interface Property {
  id: string;
  slug: string;
  category: Category;
  dealType: DealType;
  tier: Tier;

  title: string;
  /** Короткое продающее преимущество под заголовком. */
  hook: string;
  price: number; // USD
  installment?: boolean; // рассрочка
  exchange?: boolean; // обмен

  area: number;
  areaUnit: "m2" | "sotka";
  rooms?: number;
  floor?: number;
  floors?: number;
  landArea?: number; // для домов — площадь участка в сотках

  district: string;
  address: string;
  city: string;
  country: string;
  isForeign?: boolean;
  coords?: { lat: number; lng: number };

  /** Тон медиа-плейсхолдера (0..7) — стабильная «фотография»-градиент. */
  mediaTone: number;
  badge?: string; // «Эксклюзив», «Топ недели», «Новинка»…
  videoSec?: number; // длительность видеообзора, если есть

  /** 3 главные причины купить. */
  reasons: string[];
  features: KeyValue[];
  communications: CheckItem[];
  verified: CheckItem[];
  infrastructure: KeyValue[];

  /** AI-контент (предгенерирован в seed, живой режим уточняет через API). */
  aiScore: AiScore;
  aiSummary: string; // человеческое описание объекта
  lifestyle: string; // «сценарий жизни»
  investmentNote: string;
  investmentTags: string[];
  risks: string[];
  buildScenarios?: BuildScenario[]; // только для участков

  brokerId: string;
  createdAt: string; // ISO
}

export interface Broker {
  id: string;
  slug: string;
  name: string;
  title: string; // «Старший брокер»
  specialties: string[];
  photoTone: number;
  bio: string;
  rating: number; // 0..5
  reviews: number;
  dealsClosed: number;
  activeListings: number;
  avgDaysToSell: number;
  languages: string[];
  hasVideo: boolean;
  phone: string;
  whatsapp: string;
  badges: string[];
}

export interface District {
  name: string;
  slug: string;
  blurb: string;
  tone: number;
  priceFromUsd: number;
  tags: string[];
}

export interface AbroadDirection {
  id: string;
  slug: string;
  country: string;
  flag: string;
  city: string;
  title: string;
  blurb: string;
  tone: number;
  priceFromUsd: number;
  yieldNote: string; // доходность/логика
  points: string[];
  strategy: string;
}

/** Тариф упаковки объекта для продавца. */
export interface SellPlan {
  id: string;
  name: string;
  priceLabel: string;
  tagline: string;
  featured?: boolean;
  features: string[];
}

/** Метки для AI Property Score (ключ → человекочитаемое имя). */
export const SCORE_LABELS: Record<keyof AiScore, string> = {
  overall: "Общий рейтинг",
  liquidity: "Ликвидность",
  price: "Цена к рынку",
  documents: "Документы",
  location: "Локация",
  condition: "Состояние",
  potential: "Потенциал",
  risks: "Чистота (риски)",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  apartment: "Квартира",
  house: "Дом",
  land: "Участок",
  commercial: "Коммерция",
  room: "Комната",
};

export const CATEGORY_PLURAL: Record<Category, string> = {
  apartment: "Квартиры",
  house: "Дома",
  land: "Участки",
  commercial: "Коммерция",
  room: "Комнаты",
};

export const TIER_LABELS: Record<Tier, string> = {
  standard: "Стандарт",
  premium: "Premium",
  elite: "Elite",
  investment: "Инвестиция",
};
