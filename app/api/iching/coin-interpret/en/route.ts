import { NextResponse } from "next/server";
import { HEXAGRAMS_BY_NUMBER } from "@/domain/iching/hexagrams";
import { HEXAGRAM_ENGLISH } from "@/domain/iching/hexagramEnglish";
import { callIchingLlm, hasOpenAiKey } from "@/lib/ichingLlm";
import { checkAndRecordUsage, getIchingUserId } from "@/lib/ichingUsage";
import {
  buildFallbackCoinInterpretationEn,
  CATEGORY_LENSES_EN,
  guidanceForCategoryEn,
  normalizeCoinCategoryEn,
  type CoinInterpretationEn,
} from "@/lib/coinInterpretationEnglish";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_ICHING_INTERPRET_MODEL || "gpt-5.6-luna";
const LINE_LABELS_EN = ["First Line", "Second Line", "Third Line", "Fourth Line", "Fifth Line", "Top Line"];
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    situation: { type: "string" },
    changingPoint: { type: "string" },
    caution: { type: "string" },
    action: { type: "string" },
    reflection: { type: "string" },
  },
  required: ["situation", "changingPoint", "caution", "action", "reflection"],
};

const SYSTEM_EN = `You help a reader reflect on a present-day question through the I Ching. Use only the fixed Judgment and Line Texts supplied in the request. In the first sentence of situation, answer the user's actual question directly with “This hexagram may suggest…” or similarly careful language. Apply the selected category lens in at least situation and action. Give two or three concrete actions the user can take. Never claim certainty, predict a fixed future, or claim to know another person's private thoughts. In love readings, focus on communication, boundaries, and the user's own choices. For medical, legal, financial, or other high-stakes decisions, encourage reliable evidence and qualified advice. Write concise, plain contemporary English, one to three sentences per field, without repeating yourself. reflection must be one question grounded in the user's own situation.`;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim().slice(0, 200) : "";
  const category = normalizeCoinCategoryEn(body.category);
  const primaryNumber = Number(body.primaryNumber);
  const changing = Array.isArray(body.changingLineIndexes)
    ? [...new Set(body.changingLineIndexes.map(Number).filter((index) => Number.isInteger(index) && index >= 0 && index < 6))].sort((a, b) => a - b)
    : [];
  const relatingNumber = HEXAGRAMS_BY_NUMBER[Number(body.relatingNumber)] ? Number(body.relatingNumber) : null;

  if (!question || !HEXAGRAMS_BY_NUMBER[primaryNumber]) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  let interpretation: CoinInterpretationEn | null = null;
  let source: "llm" | "fallback" = "fallback";
  const userId = getIchingUserId(request) || crypto.randomUUID();

  if (hasOpenAiKey()) {
    const usage = await checkAndRecordUsage(userId, "interpret");
    if (usage.allowed) {
      const entry = HEXAGRAM_ENGLISH[primaryNumber];
      const guidance = guidanceForCategoryEn(primaryNumber, category);
      const lineText = changing.map((index) => `${LINE_LABELS_EN[index]}\nLine Text: ${entry.lines[index].original}\nModern English: ${entry.lines[index].modern}`).join("\n\n") || "No changing lines";
      const relating = relatingNumber
        ? `Relating Hexagram: ${relatingNumber}. ${HEXAGRAM_ENGLISH[relatingNumber].name}\n${HEXAGRAM_ENGLISH[relatingNumber].judgment.original}\n${HEXAGRAM_ENGLISH[relatingNumber].judgment.modern}`
        : "No Relating Hexagram";

      try {
        interpretation = await callIchingLlm<CoinInterpretationEn>({
          model: MODEL,
          system: SYSTEM_EN,
          user: `Question: ${question}\nCategory: ${category}\nCategory lens: ${CATEGORY_LENSES_EN[category]}\nExisting guidance: ${guidance}\nPrimary Hexagram: ${primaryNumber}. ${entry.name} (${entry.pinyin})\nThe Judgment: ${entry.judgment.original}\nModern English: ${entry.judgment.modern}\nKeywords: ${entry.keywords.join(", ")}\n\n${lineText}\n\n${relating}`,
          schemaName: "coin_iching_reading_en",
          schema: SCHEMA,
          maxOutputTokens: 900,
          timeoutMs: 18000,
          maxAttempts: 1,
          reasoningEffort: "none",
          verbosity: "low",
        });
        source = "llm";
      } catch {}
    }
  }

  interpretation ??= buildFallbackCoinInterpretationEn(question, category, primaryNumber, changing, relatingNumber);
  const response = NextResponse.json({ interpretation, source });
  if (!getIchingUserId(request)) {
    response.cookies.set("iching_user_id", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000,
      path: "/",
    });
  }
  return response;
}
