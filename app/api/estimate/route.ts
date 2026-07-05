import { NextResponse } from "next/server";
import { estimateFromInput } from "@/lib/valuation";
import { callClaude } from "@/lib/ai";
import { CATEGORY_LABELS, TIER_LABELS, type Category, type Tier } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export const runtime = "nodejs";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const TIERS = Object.keys(TIER_LABELS) as Tier[];

interface Body {
  category?: string;
  district?: string;
  area?: number;
  areaUnit?: string;
  tier?: string;
  floor?: number;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const category = CATEGORIES.includes(body.category as Category)
    ? (body.category as Category)
    : null;
  const tier = TIERS.includes(body.tier as Tier) ? (body.tier as Tier) : "standard";
  const areaUnit: "m2" | "sotka" = body.areaUnit === "sotka" ? "sotka" : "m2";
  const area = typeof body.area === "number" && body.area > 0 ? body.area : 0;
  const district =
    typeof body.district === "string" && body.district.trim()
      ? body.district.trim()
      : undefined;
  const floor =
    typeof body.floor === "number" && body.floor > 0 ? Math.round(body.floor) : undefined;

  if (!category || !area) {
    return NextResponse.json(
      { error: "Укажите категорию и площадь объекта." },
      { status: 400 },
    );
  }

  const est = estimateFromInput({ category, area, areaUnit, tier, district });
  const unitLabel = areaUnit === "m2" ? "м²" : "сотку";

  // Шаблонный комментарий из чисел — работает всегда, без ключа.
  const fallbackNarrative = est.compsCount
    ? `По ${est.compsCount} сопоставимым предложениям сегмента «${CATEGORY_LABELS[category]}»${
        district ? ` в районе ${district}` : ""
      } медиана составляет ${formatPrice(est.medianUnit)} за ${unitLabel}. Для объекта площадью ${area} ${
        areaUnit === "m2" ? "м²" : "сот."
      } уровня «${TIER_LABELS[tier]}» рыночный диапазон — от ${formatPrice(
        est.low,
      )} до ${formatPrice(est.high)}, а обоснованный ориентир для выхода на рынок — ${formatPrice(
        est.base,
      )}.`
    : `Для заданных параметров пока мало сопоставимых предложений в каталоге. Ориентировочный диапазон — от ${formatPrice(
        est.low,
      )} до ${formatPrice(est.high)}; точную цену брокер MULK определит по состоянию и документам объекта.`;

  let narrative = fallbackNarrative;
  let live = false;

  // Живой режим: если задан ключ — просим Claude дать обоснование на русском.
  if (est.compsCount) {
    const system = `Ты — старший брокер премиальной платформы недвижимости MULK в Бишкеке. Пиши по-русски, тоном спокойного эксперта: без воды, без обещаний доходности, без markdown. Дай 2–3 предложения обоснования рыночной оценки объекта на основе переданных чисел. Объясни, из чего складывается диапазон (медиана по сопоставимым, уровень объекта), и мягко подведи к тому, что финальную цену брокер уточнит по состоянию и документам.`;
    const user = `Объект: ${CATEGORY_LABELS[category]}${
      district ? `, район ${district}` : ""
    }, площадь ${area} ${areaUnit === "m2" ? "м²" : "соток"}${
      floor ? `, этаж ${floor}` : ""
    }, уровень «${TIER_LABELS[tier]}».
Медиана по сегменту: ${formatPrice(est.medianUnit)} за ${unitLabel}.
Сопоставимых объектов: ${est.compsCount}.
Рыночный диапазон: ${formatPrice(est.low)} — ${formatPrice(est.high)}, ориентир ${formatPrice(
      est.base,
    )}.
Напиши обоснование (2–3 предложения).`;

    const raw = await callClaude(system, user, 400);
    if (raw && raw.trim()) {
      narrative = raw.trim();
      live = true;
    }
  }

  return NextResponse.json({
    low: est.low,
    base: est.base,
    high: est.high,
    medianUnit: est.medianUnit,
    areaUnit: est.areaUnit,
    compsCount: est.compsCount,
    narrative,
    live,
  });
}
