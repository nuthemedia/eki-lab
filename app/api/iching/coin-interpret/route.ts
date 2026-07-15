import { NextResponse } from "next/server";
import { HEXAGRAMS_BY_NUMBER, LINE_LABELS } from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import { callIchingLlm, hasOpenAiKey } from "@/lib/ichingLlm";
import { getCoinInterpretModel } from "@/lib/ichingModels";
import { checkAndRecordUsage, getIchingUserId } from "@/lib/ichingUsage";
import {
  buildFallbackCoinInterpretation, CATEGORY_LENSES, guidanceForCategory,
  normalizeCoinCategory, type CoinInterpretation,
} from "@/lib/coinInterpretation";

export const runtime = "nodejs";
const MODEL = getCoinInterpretModel();

const SCHEMA = { type: "object", additionalProperties: false, properties: { situation: { type: "string" }, changingPoint: { type: "string" }, caution: { type: "string" }, action: { type: "string" }, reflection: { type: "string" } }, required: ["situation", "changingPoint", "caution", "action", "reflection"] };

const SYSTEM = `あなたは易経を現代の問いに静かに読み合わせる補助者です。渡された固定の卦辞・爻辞だけを根拠にしてください。situationの最初の文で、ユーザーの問いに対して「この卦は、〜と読む可能性があります」と直接答えてください。卦の一般説明を繰り返すだけにせず、指定されたカテゴリの視点をsituationとactionを含む2項目以上に反映します。actionはユーザーが実行できる具体的な行動を2〜3個示してください。未来を断定せず、「必ず」「絶対」「相手はこう思っている」と言わず、恐怖や依存を生まないでください。恋愛では相手の内心を推測せず、対話・境界・自分の行動に焦点を置きます。医療・法律・投資など重大な判断は現実の情報や専門家への確認も促します。各項目は1〜3文の平易な日本語で短くし、同じ説明を繰り返さないでください。reflectionはユーザー自身が考えるための、問いに即した一つの疑問文にしてください。`;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 200) : "";
  const category = normalizeCoinCategory(body.category);
  const primaryNumber = Number(body.primaryNumber);
  const changing = Array.isArray(body.changingLineIndexes) ? [...new Set(body.changingLineIndexes.map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < 6))].sort((a,b) => a-b) : [];
  const relatingNumber = HEXAGRAMS_BY_NUMBER[Number(body.relatingNumber)] ? Number(body.relatingNumber) : null;
  if (!question || !HEXAGRAMS_BY_NUMBER[primaryNumber]) return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  let interpretation: CoinInterpretation | null = null;
  let source: "llm" | "fallback" = "fallback";
  const userId = getIchingUserId(request) || crypto.randomUUID();
  if (hasOpenAiKey()) {
    const usage = await checkAndRecordUsage(request, userId, "interpret");
    if (usage.allowed) {
      const hex = HEXAGRAMS_BY_NUMBER[primaryNumber], text = HEXAGRAM_TEXTS[primaryNumber], entry = HEXAGRAM_DICTIONARY[primaryNumber];
      const guidance = guidanceForCategory(primaryNumber, category);
      const lineText = changing.map(i => `${LINE_LABELS[i]}\n爻辞：${text.lines[i].original}\n現代語訳：${text.lines[i].modern}`).join("\n\n") || "変爻なし";
      const relating = relatingNumber ? `之卦：第${relatingNumber}卦 ${HEXAGRAMS_BY_NUMBER[relatingNumber].name}\n${HEXAGRAM_TEXTS[relatingNumber].judgment.original}\n${HEXAGRAM_TEXTS[relatingNumber].judgment.modern}` : "之卦なし";
      try {
        interpretation = await callIchingLlm<CoinInterpretation>({ model: MODEL, system: SYSTEM, user: `問い：${question}\nカテゴリ：${category}\nカテゴリの読み方：${CATEGORY_LENSES[category]}\nこのカテゴリ向けの既存ガイド：${guidance}\n本卦：第${primaryNumber}卦 ${hex.name}\n卦辞：${text.judgment.original}\n現代語訳：${text.judgment.modern}\nキーワード：${entry.keywords.join("、")}\n\n${lineText}\n\n${relating}`, schemaName: "coin_iching_reading", schema: SCHEMA, maxOutputTokens: 900, timeoutMs: 18000, maxAttempts: 1, reasoningEffort: "none", verbosity: "low" });
        source = "llm";
      } catch {}
    }
  }
  interpretation ??= buildFallbackCoinInterpretation(question, category, primaryNumber, changing, relatingNumber);
  const response = NextResponse.json({ interpretation, source });
  if (!getIchingUserId(request)) response.cookies.set("iching_user_id", userId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 31536000, path: "/" });
  return response;
}
