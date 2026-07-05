/**
 * Лёгкие 2ГИС-хелперы без импорта большого датасета — безопасно использовать
 * в любых компонентах (в т.ч. клиентских), не раздувая бандл.
 */

/** Ссылка на точку в 2ГИС по координатам. */
export function gis2Url(lat: number, lng: number): string {
  return `https://2gis.kg/bishkek?m=${lng}%2C${lat}%2F16`;
}

/** Ссылка на поиск конкретного места в 2ГИС (по названию рядом с точкой). */
export function gis2Search(name: string, lat: number, lng: number): string {
  return `https://2gis.kg/bishkek/search/${encodeURIComponent(name)}?m=${lng}%2C${lat}%2F17`;
}
