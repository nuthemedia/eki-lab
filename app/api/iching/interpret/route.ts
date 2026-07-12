import { NextResponse } from "next/server";
import {
  HEXAGRAMS_BY_NUMBER,
  LINE_LABELS,
  linesOfHexagram,
} from "@/domain/iching/hexagrams";
import { HEXAGRAM_TEXTS } from "@/domain/iching/hexagramTexts";
import type { Interpretation } from "@/domain/iching/types";
import { callIchingLlm, hasOpenAiKey } from "@/lib/ichingLlm";
import { checkAndRecordUsage, getIchingUserId } from "@/lib/ichingUsage";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_ICHING_INTERPRET_MODEL || "gpt-5-mini";

const SYSTEM_PROMPT = `あなたは易占いアプリの解釈アシスタントです。

ユーザーの問い、出た卦、本卦、変爻、之卦、固定された卦辞・爻辞データをもとに、現代語でわかりやすく解釈してください。

重要：
- 易を未来予言として断定しない
- ユーザーを怖がらせない
- 依存を生まない
- 「必ずこうなる」と言わない
- 医療、法律、投資、重大な人生決定では専門家や現実情報の確認を促す
- 卦辞・爻辞の意味を勝手に創作しない
- 渡された固定データをもとに解釈する
- ユーザーの問いに戻して読む
- 問いに答えずに一般論だけを述べない
- 最後は「今どう向き合うか」に着地する

トーン：
- 落ち着いていて、静かで、わかりやすく、現代的
- 断定しないが、曖昧すぎない
- 神秘性はあるが、煽らない

避ける表現の例：「絶対にこうなります」「運命です」「悪い卦です」「別れるべきです」「今すぐ辞めなさい」「このままだと不幸になります」
望ましい表現の例：「この卦は、今すぐ押し切るより、時機を見る姿勢を示しています」「今回は、結論を急ぐより、相手の反応を見られる一歩に留めるのがよさそうです」

出力(JSON)：
- answer: 「今回の問い」に正面から答える最終回答。卦の結果(本卦・変爻・之卦)を根拠に、問いが求める選択(進む/待つ、連絡する/しない等)への方向をはっきり示す。3〜5文。「必ず」「絶対」は使わず「〜が良さそうです」「〜の時です」調で、方向は曖昧にしない。最後は前向きな小さな一歩で締める
- essence: 卦の要点。問いに即した短い一文
- primaryReading: 本卦の読み。卦辞をユーザーの問いに沿って2〜4文で
- changingReading: 変爻の読み。爻辞を問いに沿って2〜3文で(変爻がない場合は null)
- relatingReading: 之卦の読み。変化の方向を1〜3文で(之卦がない場合は null)
- advice: 今どう向き合うか。命令ではなく、具体的で控えめな提案を2〜3文で
- caution: 注意点。断定・依存を避ける補足を1〜2文で`;

const INTERPRET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string" },
    essence: { type: "string" },
    primaryReading: { type: "string" },
    changingReading: { type: ["string", "null"] },
    relatingReading: { type: ["string", "null"] },
    advice: { type: "string" },
    caution: { type: "string" },
  },
  required: [
    "answer",
    "essence",
    "primaryReading",
    "changingReading",
    "relatingReading",
    "advice",
    "caution",
  ],
};

const FIXED_CAUTION =
  "易は未来を固定するものではなく、今の状況の見方を与えるものです。大きな決断は、現実の情報や信頼できる人への相談も合わせて判断してください。";

function lineNameFor(primaryNumber: number, lineIndex: number): string {
  const lines = linesOfHexagram(primaryNumber);
  const numeral = lines?.[lineIndex] === "yang" ? "九" : "六";
  if (lineIndex === 0) return `初${numeral}`;
  if (lineIndex === 5) return `上${numeral}`;
  return `${numeral}${["", "二", "三", "四", "五"][lineIndex]}`;
}

/** 手持ちの現代語訳から組み立てる簡易解釈(キー未設定・失敗時) */
function fallbackInterpretation(
  primaryNumber: number,
  changingLineIndexes: number[],
  relatingNumber: number | null,
): Interpretation {
  const primary = HEXAGRAMS_BY_NUMBER[primaryNumber];
  const primaryText = HEXAGRAM_TEXTS[primaryNumber];
  const relating = relatingNumber ? HEXAGRAMS_BY_NUMBER[relatingNumber] : null;
  const relatingText = relatingNumber ? HEXAGRAM_TEXTS[relatingNumber] : null;

  const changingReading =
    changingLineIndexes.length > 0
      ? changingLineIndexes
          .map(
            (i) =>
              `${lineNameFor(primaryNumber, i)} — ${primaryText.lines[i].modern}`,
          )
          .join("\n")
      : null;

  return {
    answer: `${primary.name}の示すところでは、${primaryText.judgment.modern}この問いについては、卦の言葉が示す姿勢を手がかりに、急がず方向を定めるのが良さそうです。`,
    essence: primaryText.judgment.modern,
    primaryReading: `${primary.name}の卦辞は「${primaryText.judgment.original}」。${primaryText.judgment.modern}`,
    changingReading,
    relatingReading:
      relating && relatingText
        ? `之卦は${relating.name}。${relatingText.judgment.modern}`
        : null,
    advice:
      "卦の言葉を、いまの状況に重ねてゆっくり読み返してみてください。結論を急ぐより、小さく確かめられる一歩から始めるのがよさそうです。",
    caution: FIXED_CAUTION,
  };
}

export async function POST(request: Request) {
  let body: {
    rawInput?: unknown;
    finalInquiry?: unknown;
    primaryNumber?: unknown;
    changingLineIndexes?: unknown;
    relatingNumber?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const rawInput = typeof body.rawInput === "string" ? body.rawInput.trim().slice(0, 500) : "";
  const finalInquiry =
    typeof body.finalInquiry === "string" ? body.finalInquiry.trim().slice(0, 200) : "";
  const primaryNumber = Number(body.primaryNumber);
  const changingLineIndexes = Array.isArray(body.changingLineIndexes)
    ? body.changingLineIndexes
        .map(Number)
        .filter((i) => Number.isInteger(i) && i >= 0 && i <= 5)
        .sort((a, b) => a - b)
    : [];
  const relatingNumberRaw = Number(body.relatingNumber);
  const relatingNumber =
    Number.isInteger(relatingNumberRaw) && HEXAGRAMS_BY_NUMBER[relatingNumberRaw]
      ? relatingNumberRaw
      : null;

  if (!finalInquiry || !HEXAGRAMS_BY_NUMBER[primaryNumber]) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const userId = getIchingUserId(request) || crypto.randomUUID();

  let interpretation: Interpretation | null = null;
  let source: "llm" | "fallback" = "fallback";
  let remaining: number | null = null;

  if (hasOpenAiKey()) {
    const usage = await checkAndRecordUsage(userId, "interpret");
    remaining = usage.remaining;
    if (usage.allowed) {
      const primary = HEXAGRAMS_BY_NUMBER[primaryNumber];
      const primaryText = HEXAGRAM_TEXTS[primaryNumber];
      const relatingText = relatingNumber ? HEXAGRAM_TEXTS[relatingNumber] : null;
      const changingBlocks = changingLineIndexes
        .map((i) => {
          const name = lineNameFor(primaryNumber, i);
          const text = primaryText.lines[i];
          return `変爻 ${LINE_LABELS[i]}(${name})\n爻辞: ${text.original}\n爻辞の現代語訳: ${text.modern}`;
        })
        .join("\n\n");

      const user = [
        `ユーザーの元の相談:\n${rawInput || "(未入力)"}`,
        `今回の問い(占的):\n${finalInquiry}`,
        `本卦: 第${primary.number}卦 ${primary.name}(${primary.reading})`,
        `卦辞: ${primaryText.judgment.original}`,
        `卦辞の現代語訳: ${primaryText.judgment.modern}`,
        changingBlocks || "変爻: なし",
        relatingNumber && relatingText
          ? `之卦: 第${relatingNumber}卦 ${HEXAGRAMS_BY_NUMBER[relatingNumber].name}\n之卦の卦辞: ${relatingText.judgment.original}\n之卦の卦辞の現代語訳: ${relatingText.judgment.modern}`
          : "之卦: なし",
      ].join("\n\n");

      try {
        const llmResult = await callIchingLlm<Interpretation>({
          model: MODEL,
          system: SYSTEM_PROMPT,
          user,
          schemaName: "iching_interpretation",
          schema: INTERPRET_SCHEMA,
          maxOutputTokens: 2000,
          timeoutMs: 40000,
        });
        if (
          llmResult &&
          typeof llmResult.answer === "string" &&
          typeof llmResult.essence === "string" &&
          llmResult.advice
        ) {
          interpretation = llmResult;
          source = "llm";
        }
      } catch {
        // フォールバックに落とす
      }
    }
  }

  if (!interpretation) {
    interpretation = fallbackInterpretation(
      primaryNumber,
      changingLineIndexes,
      relatingNumber,
    );
  }

  const response = NextResponse.json({ interpretation, source, remaining });
  if (!getIchingUserId(request)) {
    response.cookies.set("iching_user_id", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return response;
}
