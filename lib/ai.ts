import { properties } from "@/lib/data/properties";
import {
  CATEGORY_LABELS,
  SCORE_LABELS,
  type AiScore,
  type Category,
  type Property,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";

/**
 * Слой AI-аналитики MULK.
 *
 * Работает в двух режимах:
 *  • Живой — если задан ANTHROPIC_API_KEY, запросы уходят в Claude API.
 *  • Оффлайн — детерминированные генераторы на основе данных объектов,
 *    так что демо и все AI-функции работают всегда, без ключа.
 *
 * ВАЖНО: AI-анализ — не юридическое заключение. Кадастровые и правовые
 * данные проверяются брокером/юристом отдельно.
 */

export function hasLiveAI(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Низкоуровневый вызов Claude. Возвращает текст ответа или null при сбое. */
export async function callClaude(
  system: string,
  user: string,
  maxTokens = 1024,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

/** Краткая сводка каталога для передачи в промпт живого режима. */
export function catalogDigest(): string {
  return properties
    .map(
      (p) =>
        `#${p.id} | ${CATEGORY_LABELS[p.category]} | ${p.district} | ${formatPrice(
          p.price,
        )} | ${p.area}${p.areaUnit === "m2" ? "м²" : " сот"} | tier:${p.tier} | ${p.hook}`,
    )
    .join("\n");
}

// ─────────────────────── «Найди мне объект» ───────────────────────

export interface FindResult {
  reply: string;
  ids: string[];
  live: boolean;
}

const CATEGORY_HINTS: [RegExp, Category][] = [
  [/участ|земл|сот[кої]|барнхаус|дач/i, "land"],
  [/квартир|апартам|студи|комнатн/i, "apartment"],
  [/дом|коттедж|особняк|резиденц/i, "house"],
  [/коммерц|помещен|магазин|офис|аренд.*бизнес|стрит/i, "commercial"],
];

/** Достаёт максимальную цену из запроса: «до 50 000», «$50000», «50к». */
function parseBudget(q: string): number | null {
  const kMatch = q.match(/(\d+)\s*[кk]\b/i);
  if (kMatch) return parseInt(kMatch[1], 10) * 1000;
  const nums = q
    .replace(/[^\d\s]/g, " ")
    .split(/\s+/)
    .map((n) => parseInt(n, 10))
    .filter((n) => !Number.isNaN(n) && n >= 1000);
  if (nums.length) return Math.max(...nums);
  return null;
}

/** Оффлайн-подбор объектов по естественному запросу. */
export function findFallback(query: string): FindResult {
  const q = query.toLowerCase();
  const budget = parseBudget(q);
  const wantCats = CATEGORY_HINTS.filter(([re]) => re.test(q)).map(([, c]) => c);
  const wantRent =
    /сдав|аренд|посуточ|доход|инвест|окупа|зараб/i.test(q) ? true : false;
  const wantForeign = /дубай|дубае|оаэ|турци|анталь|казах|алмат|батуми|грузи|за рубеж|зарубеж/i.test(q);
  const wantIssyk = /иссык|куль|озер|чолпон|бостери/i.test(q);
  const wantCenter = /центр|золот.*квадрат|элит|премиум/i.test(q);

  const scored = properties
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];
      if (wantCats.length && wantCats.includes(p.category)) {
        score += 4;
        reasons.push(CATEGORY_LABELS[p.category].toLowerCase());
      }
      if (budget != null) {
        if (p.price <= budget) {
          score += 3;
          reasons.push(`в бюджете ${formatPrice(budget)}`);
        } else if (p.price <= budget * 1.15) {
          score += 1;
        } else {
          score -= 3;
        }
      }
      if (wantRent && (p.tier === "investment" || /аренд|доход|посуточ/i.test(p.investmentNote))) {
        score += 3;
        reasons.push("под доход/аренду");
      }
      if (wantForeign && p.isForeign) {
        score += 4;
        reasons.push("за рубежом");
      }
      if (!wantForeign && p.isForeign) score -= 2;
      if (wantIssyk && p.district === "Иссык-Куль") {
        score += 4;
        reasons.push("Иссык-Куль");
      }
      if (wantCenter && (p.district === "Золотой квадрат" || p.tier === "elite")) {
        score += 2;
        reasons.push("центр/премиум");
      }
      return { p, score, reasons };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 4);

  let reply: string;
  if (!top.length) {
    reply =
      "По вашему запросу пока не нашлось точного совпадения. Попробуйте указать категорию (участок, квартира, дом, коммерция) и примерный бюджет — я подберу варианты. Или оставьте заявку, и брокер соберёт подборку под вас.";
    // мягкий фолбэк: покажем 3 разных объекта
    return { reply, ids: properties.slice(0, 3).map((p) => p.id), live: false };
  }

  const parts: string[] = [];
  if (wantCats.length) parts.push(CATEGORY_LABELS[wantCats[0]].toLowerCase());
  if (budget != null) parts.push(`до ${formatPrice(budget)}`);
  if (wantRent) parts.push("с доходом от аренды");
  if (wantIssyk) parts.push("на Иссык-Куле");
  if (wantForeign) parts.push("за рубежом");

  reply = `Подобрал ${top.length} ${
    top.length === 1 ? "вариант" : "варианта"
  }${parts.length ? " (" + parts.join(", ") + ")" : ""}. Лучшее совпадение — «${
    top[0].p.title
  }»: ${top[0].p.hook.toLowerCase()}. ${
    wantRent ? "Все варианты отобраны с учётом арендного потенциала. " : ""
  }Откройте карточку — там AI-анализ, риски и брокер объекта.`;

  return { reply, ids: top.map((t) => t.p.id), live: false };
}

// ─────────────────────── «Сравнить объекты» ───────────────────────

const avgScore = (s: AiScore) =>
  (s.liquidity + s.price + s.documents + s.location + s.condition + s.potential + s.risks) / 7;

/** Оффлайн-вердикт по сравнению 2–3 объектов. */
export function compareFallback(ids: string[]): { verdict: string; live: boolean } {
  const items = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean) as Property[];
  if (items.length < 2)
    return { verdict: "Выберите минимум два объекта для сравнения.", live: false };

  const cheapest = [...items].sort((a, b) => a.price - b.price)[0];
  const bestLiquidity = [...items].sort((a, b) => b.aiScore.liquidity - a.aiScore.liquidity)[0];
  const bestDocs = [...items].sort((a, b) => b.aiScore.documents - a.aiScore.documents)[0];
  const bestPotential = [...items].sort((a, b) => b.aiScore.potential - a.aiScore.potential)[0];
  const bestOverall = [...items].sort((a, b) => avgScore(b.aiScore) - avgScore(a.aiScore))[0];

  const lines = [
    `Дешевле всех — «${cheapest.title}» (${formatPrice(cheapest.price)}).`,
    `Лучше по ликвидности — «${bestLiquidity.title}».`,
    `Чище по документам — «${bestDocs.title}».`,
    `Выше потенциал — «${bestPotential.title}».`,
    `Сильнее в сумме по AI-оценке — «${bestOverall.title}».`,
  ];

  const advice =
    bestOverall.id === cheapest.id
      ? `Итог: «${bestOverall.title}» выглядит наиболее сбалансированным — и по цене, и по оценке.`
      : `Итог: если приоритет — цена, берите «${cheapest.title}»; если баланс и надёжность — «${bestOverall.title}».`;

  return { verdict: lines.join(" ") + " " + advice, live: false };
}

// ─────────────── Property Score → человеческий вывод ───────────────

export function scoreBreakdown(score: AiScore): { label: string; value: number }[] {
  return (Object.keys(SCORE_LABELS) as (keyof AiScore)[])
    .filter((k) => k !== "overall")
    .map((k) => ({ label: SCORE_LABELS[k], value: score[k] }));
}

/** Класс объекта по общей оценке. */
export function scoreTier(overall: number): { label: string; tone: "gold" | "emerald" | "muted" } {
  if (overall >= 8.5) return { label: "Отличный объект", tone: "gold" };
  if (overall >= 7.5) return { label: "Сильный объект", tone: "emerald" };
  if (overall >= 6) return { label: "Хороший объект", tone: "emerald" };
  return { label: "Требует внимания", tone: "muted" };
}

export const AI_DISCLAIMER =
  "AI-анализ не является юридическим заключением. Документы, назначение земли и кадастровые данные проверяются брокером и юристом отдельно.";
