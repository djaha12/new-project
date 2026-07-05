import { NextResponse } from "next/server";
import { callClaude, compareFallback } from "@/lib/ai";
import { properties } from "@/lib/data/properties";
import { formatPrice } from "@/lib/utils";
import { SCORE_LABELS, type AiScore } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let ids: string[] = [];
  try {
    const body = (await req.json()) as { ids?: string[] };
    ids = Array.isArray(body.ids) ? body.ids.slice(0, 3) : [];
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const items = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean);
  if (items.length < 2) {
    return NextResponse.json({
      verdict: "Выберите минимум два объекта для сравнения.",
      live: false,
    });
  }

  const system = `Ты — AI-аналитик недвижимости MULK. Сравни объекты честно и коротко (3-5 предложений, русский).
Дай практичный вывод: что дешевле, что ликвиднее, что чище по документам, что брать под какую цель. Без markdown, только текст.`;

  const digest = items
    .map((p) => {
      const s = p!.aiScore;
      const scores = (Object.keys(SCORE_LABELS) as (keyof AiScore)[])
        .map((k) => `${SCORE_LABELS[k]}:${s[k]}`)
        .join(", ");
      return `«${p!.title}» — ${formatPrice(p!.price)}, ${p!.district}. Оценки: ${scores}. ${p!.hook}`;
    })
    .join("\n");

  const raw = await callClaude(system, `Сравни:\n${digest}`, 500);
  if (raw && raw.length > 20) {
    return NextResponse.json({ verdict: raw.trim(), live: true });
  }

  return NextResponse.json(compareFallback(ids));
}
