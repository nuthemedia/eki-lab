import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkAndRecordUsage,
  checkCoinShareUsage,
  resetIchingUsageForTests,
} from "./ichingUsage";

function request(ip = "203.0.113.10") {
  return new Request("https://example.com/api", {
    headers: { "x-vercel-forwarded-for": ip },
  });
}

describe("ichingUsage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T03:00:00.000Z"));
    delete process.env.VERCEL_ENV;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    resetIchingUsageForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("limits each user and kind to ten calls per JST day", async () => {
    const results = await Promise.all(
      Array.from({ length: 11 }, () =>
        checkAndRecordUsage(request(), "user-1", "interpret"),
      ),
    );

    expect(results.filter((result) => result.allowed)).toHaveLength(10);
    expect(results[10]).toMatchObject({ allowed: false, reason: "user" });
  });

  it("shares the hourly IP limit across users and usage kinds", async () => {
    const results = [];
    for (let index = 0; index < 61; index += 1) {
      results.push(
        await checkAndRecordUsage(
          request(),
          `user-${index}`,
          index % 2 === 0 ? "refine" : "interpret",
        ),
      );
    }

    expect(results[59].allowed).toBe(true);
    expect(results[60]).toMatchObject({ allowed: false, reason: "ip" });
  });

  it("caps all AI usage at five hundred calls per JST day", async () => {
    let result;
    for (let index = 0; index < 501; index += 1) {
      result = await checkAndRecordUsage(
        request(`203.0.${Math.floor(index / 250)}.${index % 250}`),
        `global-user-${index}`,
        "interpret",
      );
    }

    expect(result).toMatchObject({ allowed: false, reason: "global" });
  });

  it("resets fixed limits in the next window", async () => {
    for (let index = 0; index < 30; index += 1) {
      expect((await checkCoinShareUsage(request())).allowed).toBe(true);
    }
    expect(await checkCoinShareUsage(request())).toMatchObject({
      allowed: false,
      reason: "ip",
    });

    vi.setSystemTime(new Date("2026-07-15T03:10:01.000Z"));
    expect((await checkCoinShareUsage(request())).allowed).toBe(true);
  });

  it("fails closed in production when Redis is unavailable", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(
      await checkAndRecordUsage(request(), "user-1", "interpret"),
    ).toMatchObject({ allowed: false, reason: "infrastructure" });
    expect(await checkCoinShareUsage(request())).toMatchObject({
      allowed: false,
      reason: "infrastructure",
    });
  });
});
