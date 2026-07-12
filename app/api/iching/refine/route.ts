import { NextResponse } from "next/server";
import { callIchingLlm, hasOpenAiKey } from "@/lib/ichingLlm";
import { checkAndRecordUsage, getIchingUserId } from "@/lib/ichingUsage";
import type { RefineResult } from "@/domain/iching/types";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_ICHING_REFINE_MODEL || "gpt-5-nano";
const MAX_INPUT_LENGTH = 500;

const SYSTEM_PROMPT = `あなたは易占いアプリの「問いを整える」ためのアシスタントです。

ユーザーの悩みをそのまま占うのではなく、易が答えやすい占的へ整えてください。

目的は、ユーザーの悩みを心理分析することではありません。
目的は、「何を占うのか」を一つに定めることです。

ルール：
- 未来を断定しない
- ユーザーの本心を決めつけない
- 不安を煽らない
- 恋愛、仕事、人間関係、事業、創作、人生などのカテゴリを推定する
- 曖昧な相談は、対象・行動・時期のどれが曖昧かを見る
- 占的候補を3〜4個出す
- 候補は短く、具体的にする
- 「どうなりますか」より「今どう向き合うか」「進むべきか待つべきか」に寄せる
- 質問が必要な場合は、確認質問を1つだけ出す
- 質問を重ねすぎない
- 出力は必ずJSONにする
- summary・label・inquiry は日本語で書く

よい占的の例：
- 今の会社に在籍しながら転職活動を始めるべきか
- この関係において、今、自分から連絡を取るべきか
- この案件を今月中に進めることの可否
- この人との協業を進めてよいか
- 今は押すべきか、待つべきか
- この計画を始める時機としてよいか

悪い占的の例：
- 私の人生はどうなりますか
- 幸せになれますか
- 恋愛運はどうですか
- 仕事運を見てください
- 彼は私を好きですか
- 全体的に占ってください`;

const REFINE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    category: {
      type: "string",
      enum: ["love", "work", "relationship", "business", "creative", "life", "other"],
    },
    ambiguityLevel: { type: "string", enum: ["low", "medium", "high"] },
    needsClarification: { type: "boolean" },
    clarifyingQuestion: { type: ["string", "null"] },
    suggestedQuestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          inquiry: { type: "string" },
          focus: {
            type: "string",
            enum: ["situation", "action", "relationship", "timing", "other"],
          },
        },
        required: ["id", "label", "inquiry", "focus"],
      },
    },
    recommendedInquiry: { type: "string" },
  },
  required: [
    "summary",
    "category",
    "ambiguityLevel",
    "needsClarification",
    "clarifyingQuestion",
    "suggestedQuestions",
    "recommendedInquiry",
  ],
};

/** キー未設定・API失敗時でもフローを止めない汎用テンプレート */
function fallbackRefine(rawInput: string): RefineResult {
  const head = rawInput.trim().slice(0, 60);
  return {
    summary: `「${head}${rawInput.trim().length > 60 ? "…" : ""}」という相談。`,
    category: "other",
    ambiguityLevel: "medium",
    needsClarification: false,
    clarifyingQuestion: null,
    suggestedQuestions: [
      {
        id: "current_flow",
        label: "この件の現在の流れを知りたい",
        inquiry: "この件の現在の流れを見る",
        focus: "situation",
      },
      {
        id: "push_or_wait",
        label: "今は進むべきか、待つべきかを見たい",
        inquiry: "この件について、今は進むべきか、待つべきか",
        focus: "timing",
      },
      {
        id: "how_to_face",
        label: "今どう向き合うべきか知りたい",
        inquiry: "この件に、今どう向き合うべきか",
        focus: "action",
      },
      {
        id: "timing",
        label: "始める時機としてよいか見たい",
        inquiry: "この件を始める時機としてよいか",
        focus: "timing",
      },
    ],
    recommendedInquiry: "この件に、今どう向き合うべきか",
  };
}

function isValidRefineResult(value: unknown): value is RefineResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<RefineResult>;
  return (
    typeof v.summary === "string" &&
    Array.isArray(v.suggestedQuestions) &&
    v.suggestedQuestions.length >= 3 &&
    v.suggestedQuestions.every(
      (q) => typeof q?.label === "string" && typeof q?.inquiry === "string",
    ) &&
    typeof v.recommendedInquiry === "string"
  );
}

export async function POST(request: Request) {
  let body: { rawInput?: unknown; clarifyingAnswer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const rawInput = typeof body.rawInput === "string" ? body.rawInput.trim() : "";
  const clarifyingAnswer =
    typeof body.clarifyingAnswer === "string" ? body.clarifyingAnswer.trim() : "";
  if (!rawInput) {
    return NextResponse.json({ error: "相談内容を入力してください。" }, { status: 400 });
  }
  if (rawInput.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      { error: `相談内容は${MAX_INPUT_LENGTH}字以内にしてください。` },
      { status: 400 },
    );
  }

  const userId = getIchingUserId(request) || crypto.randomUUID();

  let result: RefineResult | null = null;
  let source: "llm" | "fallback" = "fallback";
  let remaining: number | null = null;

  if (hasOpenAiKey()) {
    const usage = await checkAndRecordUsage(userId, "refine");
    remaining = usage.remaining;
    if (usage.allowed) {
      try {
        const user =
          `相談内容:\n${rawInput}` +
          (clarifyingAnswer ? `\n\n確認質問へのユーザーの回答:\n${clarifyingAnswer}` : "") +
          (clarifyingAnswer
            ? "\n\n回答を踏まえて占的候補を出し、needsClarification は false にしてください。"
            : "");
        const llmResult = await callIchingLlm<RefineResult>({
          model: MODEL,
          system: SYSTEM_PROMPT,
          user,
          schemaName: "iching_refine",
          schema: REFINE_SCHEMA,
          maxOutputTokens: 1200,
          timeoutMs: 25000,
        });
        if (isValidRefineResult(llmResult)) {
          result = llmResult;
          source = "llm";
        }
      } catch {
        // フォールバックに落とす
      }
    }
  }

  if (!result) {
    result = fallbackRefine(rawInput);
  }

  const response = NextResponse.json({ result, source, remaining });
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
