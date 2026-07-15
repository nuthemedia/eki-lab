export function getIchingInterpretModel(): string {
  return process.env.OPENAI_ICHING_INTERPRET_MODEL || "gpt-5-mini";
}

export function getCoinInterpretModel(): string {
  return process.env.OPENAI_COIN_INTERPRET_MODEL || "gpt-5.6-luna";
}
