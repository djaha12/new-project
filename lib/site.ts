/**
 * Единая точка настройки бренда. Чтобы переименовать проект,
 * поменяйте значения здесь — весь UI подхватит их автоматически.
 */
export const site = {
  name: "MULK",
  // «мүлк» — имущество/собственность; ownable, локально звучащий бренд.
  tagline: "Брокерская платформа недвижимости",
  slogan: "Недвижимость, которую не просто размещают — её продают.",
  description:
    "Проверенные объекты, профессиональные брокеры и AI-анализ каждого объекта. Премиальная продажа недвижимости в Кыргызстане.",
  city: "Бишкек",
  country: "Кыргызстан",
  phone: "+996 700 000 000",
  whatsapp: "+996700000000",
  email: "hello@mulk.kg",
  telegram: "mulk_kg",
  instagram: "mulk.kg",
  url: "https://mulk.kg",
} as const;

/** Верхняя навигация. Используется в Nav и в Footer. */
export const primaryNav: { label: string; href: string }[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "Премиум", href: "/premium" },
  { label: "Зарубежье", href: "/abroad" },
  { label: "Брокеры", href: "/brokers" },
  { label: "AI-анализ", href: "/ai" },
  { label: "Продать объект", href: "/sell" },
];
