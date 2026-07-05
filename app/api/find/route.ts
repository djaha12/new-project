import { NextResponse } from "next/server";
import { callClaude, catalogDigest, findFallback } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let query = "";
  try {
    const body = (await req.json()) as { query?: string };
    query = (body.query || "").slice(0, 500);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!query.trim()) {
    return NextResponse.json({ reply: "Опишите, что вы ищете.", ids: [], live: false });
  }

  // Живой режим — если задан ключ.
  const system = `Ты — AI-брокер платформы недвижимости MULK в Бишкеке. Помогаешь подобрать объект из каталога.
Отвечай ТОЛЬКО валидным JSON без markdown: {"reply": "<1-3 предложения на русском>", "ids": ["<id>", ...до 4]}.
Выбирай id строго из каталога ниже. Учитывай категорию, бюджет, район и цель (жить/сдавать/инвестировать).
Каталог:
${catalogDigest()}`;

  const raw = await callClaude(system, query, 700);
  if (raw) {
    try {
      const jsonStr = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
      const parsed = JSON.parse(jsonStr) as { reply?: string; ids?: string[] };
      if (parsed.reply && Array.isArray(parsed.ids)) {
        return NextResponse.json({
          reply: parsed.reply,
          ids: parsed.ids.slice(0, 4),
          live: true,
        });
      }
    } catch {
      // упадём в фолбэк ниже
    }
  }

  return NextResponse.json(findFallback(query));
}
