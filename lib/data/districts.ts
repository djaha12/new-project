import type { District } from "@/lib/types";

export const districts: District[] = [
  {
    name: "Золотой квадрат",
    slug: "zolotoy-kvadrat",
    blurb: "Исторический центр Бишкека: статус, инфраструктура, максимальная ликвидность.",
    tone: 1,
    priceFromUsd: 120000,
    tags: ["Центр", "Элитка", "Ликвидность"],
  },
  {
    name: "Джал",
    slug: "jal",
    blurb: "Виды на горы, новостройки бизнес-класса, спокойные зелёные микрорайоны.",
    tone: 3,
    priceFromUsd: 70000,
    tags: ["Новостройки", "Виды", "Семейный"],
  },
  {
    name: "Асанбай",
    slug: "asanbay",
    blurb: "Современные ЖК рядом с центром, развитая инфраструктура и парки.",
    tone: 2,
    priceFromUsd: 65000,
    tags: ["ЖК", "Парки", "Комфорт"],
  },
  {
    name: "Восток-5",
    slug: "vostok-5",
    blurb: "Практичный спрос, доступные цены, стабильная аренда и быстрые сделки.",
    tone: 4,
    priceFromUsd: 42000,
    tags: ["Доступно", "Аренда", "Спрос"],
  },
  {
    name: "Байтик / Кой-Таш",
    slug: "baytik-koytash",
    blurb: "Загородная зона у подножия гор: участки и дома под резиденции и барнхаусы.",
    tone: 6,
    priceFromUsd: 28000,
    tags: ["Загород", "Участки", "Горы"],
  },
  {
    name: "Иссык-Куль",
    slug: "issyk-kul",
    blurb: "Курортное направление: коттеджи, апартаменты и участки под посуточную аренду.",
    tone: 5,
    priceFromUsd: 35000,
    tags: ["Курорт", "Аренда", "Инвестиция"],
  },
];

export function getDistrict(slug: string): District | undefined {
  return districts.find((d) => d.slug === slug);
}
