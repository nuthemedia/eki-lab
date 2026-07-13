/**
 * 易のかたち用 OpenAI Responses API ヘルパー。
 * JSON Schema による構造化出力・タイムアウト・リトライを共通化する。
 * キー未設定・失敗時は呼び出し側がテンプレートにフォールバックする。
 */

const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

export function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

type LlmCallOptions = {
  model: string;
  system: string;
  user: string;
  schemaName: string;
  schema: Record<string, unknown>;
  maxOutputTokens: number;
  timeoutMs?: number;
};

export async function callIchingLlm<T>(options: LlmCallOptions): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const timeoutMs = options.timeoutMs ?? 30000;
  const body: Record<string, unknown> = {
    model: options.model,
    input: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
    max_output_tokens: options.maxOutputTokens,
    text: {
      format: {
        type: "json_schema",
        name: options.schemaName,
        strict: true,
        schema: options.schema,
      },
    },
  };
  // gpt-5 系は推論トークンが出力上限を圧迫するため最小にする
  if (options.model.startsWith("gpt-5")) {
    body.reasoning = { effort: "minimal" };
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(OPENAI_ENDPOINT, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${detail.slice(0, 300)}`);
      }
      const data = (await response.json()) as {
        output_text?: string;
        output?: { content?: { text?: string }[] }[];
      };
      const text =
        data.output_text ||
        data.output
          ?.flatMap((item) => item.content || [])
          .map((content) => content.text || "")
          .join("")
          .trim();
      if (!text) {
        throw new Error("OpenAI request returned empty text");
      }
      return JSON.parse(text) as T;
    } catch (error) {
      lastError =
        error instanceof Error && error.name === "AbortError"
          ? new Error(`OpenAI request timed out after ${timeoutMs / 1000}s`)
          : error;
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}
