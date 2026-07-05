/**
 * i18n MULK — каркас на 3 языка (RU/KG/EN).
 * MVP-охват: навигация, футер и hero главной переведены полностью;
 * остальной контент — на русском, структура готова к расширению словарей.
 */

export type Locale = "ru" | "ky" | "en";

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "mulk_locale";

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "ru", label: "Русский", short: "RU" },
  { code: "ky", label: "Кыргызча", short: "KG" },
  { code: "en", label: "English", short: "EN" },
];

export function isLocale(v: string | undefined): v is Locale {
  return v === "ru" || v === "ky" || v === "en";
}

interface Dict {
  nav: {
    catalog: string;
    premium: string;
    abroad: string;
    brokers: string;
    ai: string;
    sell: string;
    aiPick: string;
    sellCta: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    subtitle: string;
    stats: { verified: string; brokers: string; ai: string; fees: string };
    tabs: { apartment: string; house: string; land: string; commercial: string };
    placeholder: string;
    find: string;
    aiHint: string;
  };
  footer: {
    slogan: string;
    colCatalog: string;
    colServices: string;
    colCabinets: string;
    links: {
      apartments: string;
      houses: string;
      land: string;
      commercial: string;
      premium: string;
      aiAnalysis: string;
      sell: string;
      abroad: string;
      brokers: string;
      sellerCabinet: string;
      brokerCabinet: string;
      estimate: string;
      districts: string;
      saved: string;
    };
    disclaimer: string;
  };
}

export const dict: Record<Locale, Dict> = {
  ru: {
    nav: {
      catalog: "Каталог",
      premium: "Премиум",
      abroad: "Зарубежье",
      brokers: "Брокеры",
      ai: "AI-анализ",
      sell: "Продать объект",
      aiPick: "AI-подбор",
      sellCta: "Продать объект",
    },
    hero: {
      eyebrow: "Брокерская платформа недвижимости",
      titleLead: "Недвижимость, которую не просто размещают —",
      titleHighlight: "её продают.",
      subtitle:
        "Проверенные объекты, профессиональные брокеры и AI-анализ каждого объекта. Премиальная продажа недвижимости в Кыргызстане.",
      stats: {
        verified: "проверенных объектов",
        brokers: "брокеров-экспертов",
        ai: "анализ каждого объекта",
        fees: "скрытых комиссий",
      },
      tabs: { apartment: "Квартиры", house: "Дома", land: "Участки", commercial: "Коммерция" },
      placeholder: "Район, ЖК, цена или запрос словами…",
      find: "Найти",
      aiHint: "Или опишите словами — AI подберёт объект",
    },
    footer: {
      slogan: "Недвижимость, которую не просто размещают — её продают.",
      colCatalog: "Каталог",
      colServices: "Сервисы",
      colCabinets: "Кабинеты",
      links: {
        apartments: "Квартиры",
        houses: "Дома",
        land: "Участки",
        commercial: "Коммерция",
        premium: "Премиум",
        aiAnalysis: "AI-анализ объекта",
        sell: "Продать объект",
        abroad: "Зарубежная недвижимость",
        brokers: "Наши брокеры",
        sellerCabinet: "Кабинет продавца",
        brokerCabinet: "Кабинет брокера",
        estimate: "Оценить объект",
        districts: "Районы Бишкека",
        saved: "Избранное",
      },
      disclaimer: "AI-анализ не является юридическим заключением.",
    },
  },
  ky: {
    nav: {
      catalog: "Каталог",
      premium: "Премиум",
      abroad: "Чет өлкө",
      brokers: "Брокерлер",
      ai: "AI-талдоо",
      sell: "Объектти сатуу",
      aiPick: "AI-тандоо",
      sellCta: "Объектти сатуу",
    },
    hero: {
      eyebrow: "Кыймылсыз мүлк боюнча брокердик платформа",
      titleLead: "Жөн гана жарыялабай турган кыймылсыз мүлк —",
      titleHighlight: "аны сатабыз.",
      subtitle:
        "Текшерилген объекттер, кесипкөй брокерлер жана ар бир объектке AI-талдоо. Кыргызстанда кыймылсыз мүлктү премиум деңгээлде сатуу.",
      stats: {
        verified: "текшерилген объект",
        brokers: "эксперт-брокер",
        ai: "ар бир объектке талдоо",
        fees: "жашыруун комиссия",
      },
      tabs: { apartment: "Батирлер", house: "Үйлөр", land: "Жер тилкелери", commercial: "Коммерция" },
      placeholder: "Район, турак-жай комплекси, баа же сурам…",
      find: "Издөө",
      aiHint: "Же сөз менен сүрөттөп бериңиз — AI объект тандап берет",
    },
    footer: {
      slogan: "Жөн гана жарыялабай турган кыймылсыз мүлк — аны сатабыз.",
      colCatalog: "Каталог",
      colServices: "Сервистер",
      colCabinets: "Кабинеттер",
      links: {
        apartments: "Батирлер",
        houses: "Үйлөр",
        land: "Жер тилкелери",
        commercial: "Коммерция",
        premium: "Премиум",
        aiAnalysis: "Объектке AI-талдоо",
        sell: "Объектти сатуу",
        abroad: "Чет өлкөдөгү мүлк",
        brokers: "Биздин брокерлер",
        sellerCabinet: "Сатуучунун кабинети",
        brokerCabinet: "Брокердин кабинети",
        estimate: "Объектти баалоо",
        districts: "Бишкектин райондору",
        saved: "Тандалмалар",
      },
      disclaimer: "AI-талдоо юридикалык корутунду болуп саналбайт.",
    },
  },
  en: {
    nav: {
      catalog: "Catalog",
      premium: "Premium",
      abroad: "Abroad",
      brokers: "Brokers",
      ai: "AI analysis",
      sell: "Sell property",
      aiPick: "AI match",
      sellCta: "Sell property",
    },
    hero: {
      eyebrow: "Real estate brokerage platform",
      titleLead: "Real estate that isn't just listed —",
      titleHighlight: "it's sold.",
      subtitle:
        "Verified listings, professional brokers and AI analysis on every property. Premium real estate sales in Kyrgyzstan.",
      stats: {
        verified: "verified listings",
        brokers: "expert brokers",
        ai: "analysis on every listing",
        fees: "hidden fees",
      },
      tabs: { apartment: "Apartments", house: "Houses", land: "Land", commercial: "Commercial" },
      placeholder: "District, complex, price or free-text query…",
      find: "Search",
      aiHint: "Or describe it in words — AI will find the property",
    },
    footer: {
      slogan: "Real estate that isn't just listed — it's sold.",
      colCatalog: "Catalog",
      colServices: "Services",
      colCabinets: "Dashboards",
      links: {
        apartments: "Apartments",
        houses: "Houses",
        land: "Land",
        commercial: "Commercial",
        premium: "Premium",
        aiAnalysis: "AI property analysis",
        sell: "Sell property",
        abroad: "Property abroad",
        brokers: "Our brokers",
        sellerCabinet: "Seller dashboard",
        brokerCabinet: "Broker dashboard",
        estimate: "Estimate a property",
        districts: "Bishkek districts",
        saved: "Saved",
      },
      disclaimer: "AI analysis is not a legal conclusion.",
    },
  },
};
