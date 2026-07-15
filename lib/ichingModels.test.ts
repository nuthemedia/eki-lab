import { afterEach, describe, expect, it, vi } from "vitest";
import { getCoinInterpretModel, getIchingInterpretModel } from "./ichingModels";

describe("iching model configuration", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses separate defaults for core and Coin readings", () => {
    vi.stubEnv("OPENAI_ICHING_INTERPRET_MODEL", "");
    vi.stubEnv("OPENAI_COIN_INTERPRET_MODEL", "");
    expect(getIchingInterpretModel()).toBe("gpt-5-mini");
    expect(getCoinInterpretModel()).toBe("gpt-5.6-luna");
  });

  it("honors each dedicated environment variable", () => {
    vi.stubEnv("OPENAI_ICHING_INTERPRET_MODEL", "core-model");
    vi.stubEnv("OPENAI_COIN_INTERPRET_MODEL", "coin-model");
    expect(getIchingInterpretModel()).toBe("core-model");
    expect(getCoinInterpretModel()).toBe("coin-model");
  });
});
