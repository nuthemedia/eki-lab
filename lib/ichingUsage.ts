import { Redis } from "@upstash/redis";

/** 易のAI呼び出し・画像生成に共通する本番レート制御。 */

export const ICHING_DAILY_LIMIT_PER_KIND = 10;
export const ICHING_IP_HOURLY_LIMIT = 60;
export const ICHING_GLOBAL_DAILY_LIMIT = 500;
export const COIN_SHARE_TEN_MINUTE_LIMIT = 30;

type UsageKind = "refine" | "interpret";
type LimitReason = "user" | "ip" | "global" | "infrastructure";

export type UsageResult = {
  allowed: boolean;
  remaining: number;
  reason?: LimitReason;
  retryAfter?: number;
};

type LimitEntry = {
  key: string;
  limit: number;
  ttlSeconds: number;
  reason: Exclude<LimitReason, "infrastructure">;
};

type MemoryEntry = { count: number; expiresAt: number };

const memoryStore = new Map<string, MemoryEntry>();
let redis: Redis | null = null;

const ATOMIC_LIMIT_SCRIPT = `
for i, key in ipairs(KEYS) do
  local limit = tonumber(ARGV[(i - 1) * 2 + 1])
  local count = tonumber(redis.call("GET", key) or "0")
  if count >= limit then
    return {0, i, count}
  end
end
local first_count = 0
for i, key in ipairs(KEYS) do
  local ttl = tonumber(ARGV[(i - 1) * 2 + 2])
  local count = redis.call("INCR", key)
  if count == 1 then redis.call("EXPIRE", key, ttl) end
  if i == 1 then first_count = count end
end
return {1, 0, first_count}
`;

function hasRedisConfig(): boolean {
  return Boolean(redisUrl() && redisToken());
}

function redisUrl(): string | undefined {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
}

function redisToken(): string | undefined {
  return process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
}

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: redisUrl()!,
      token: redisToken()!,
    });
  }
  return redis;
}

function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

function currentDayKey(now: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function secondsUntilNextJstDay(now: Date): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );
  const elapsed =
    Number(parts.hour) * 3600 +
    Number(parts.minute) * 60 +
    Number(parts.second);
  return Math.max(1, 86400 - elapsed + 5);
}

function fixedWindow(now: Date, windowSeconds: number) {
  const seconds = Math.floor(now.getTime() / 1000);
  const bucket = Math.floor(seconds / windowSeconds);
  const retryAfter = windowSeconds - (seconds % windowSeconds);
  return { bucket, retryAfter: Math.max(1, retryAfter) };
}

function requestIp(request: Request): string {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return forwarded.split(",")[0].trim().slice(0, 128) || "unknown";
}

async function hashIdentifier(value: string): Promise<string> {
  const secret =
    redisToken() || "iching-local-rate-limit";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(signature))
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function checkMemoryLimits(entries: LimitEntry[], now: number): UsageResult {
  for (const entry of entries) {
    const stored = memoryStore.get(entry.key);
    const count = stored && stored.expiresAt > now ? stored.count : 0;
    if (count >= entry.limit) {
      const retryAfter = stored
        ? Math.max(1, Math.ceil((stored.expiresAt - now) / 1000))
        : entry.ttlSeconds;
      return { allowed: false, remaining: 0, reason: entry.reason, retryAfter };
    }
  }

  entries.forEach((entry) => {
    const stored = memoryStore.get(entry.key);
    const active = stored && stored.expiresAt > now ? stored : null;
    memoryStore.set(entry.key, {
      count: (active?.count ?? 0) + 1,
      expiresAt: active?.expiresAt ?? now + entry.ttlSeconds * 1000,
    });
  });

  const first = memoryStore.get(entries[0].key)!;
  return {
    allowed: true,
    remaining: Math.max(0, entries[0].limit - first.count),
  };
}

async function checkLimits(entries: LimitEntry[]): Promise<UsageResult> {
  if (!hasRedisConfig()) {
    if (isProduction()) {
      return { allowed: false, remaining: 0, reason: "infrastructure" };
    }
    return checkMemoryLimits(entries, Date.now());
  }

  try {
    const args = entries.flatMap((entry) => [
      String(entry.limit),
      String(entry.ttlSeconds),
    ]);
    const result = await getRedis().eval<string[], number[]>(
      ATOMIC_LIMIT_SCRIPT,
      entries.map((entry) => entry.key),
      args,
    );
    const [allowed, blockedIndex, firstCount] = result.map(Number);
    if (allowed === 1) {
      return {
        allowed: true,
        remaining: Math.max(0, entries[0].limit - firstCount),
      };
    }
    const blocked = entries[Math.max(0, blockedIndex - 1)];
    return {
      allowed: false,
      remaining: 0,
      reason: blocked.reason,
      retryAfter: blocked.ttlSeconds,
    };
  } catch {
    return { allowed: false, remaining: 0, reason: "infrastructure" };
  }
}

export function getIchingUserId(request: Request): string | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/iching_user_id=([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/** 端末・IP・サービス全体の上限を確認し、許可時だけ一括で記録する。 */
export async function checkAndRecordUsage(
  request: Request,
  userId: string,
  kind: UsageKind,
): Promise<UsageResult> {
  const now = new Date();
  const day = currentDayKey(now);
  const dayTtl = secondsUntilNextJstDay(now);
  const hour = fixedWindow(now, 3600);
  const [userHash, ipHash] = await Promise.all([
    hashIdentifier(userId),
    hashIdentifier(requestIp(request)),
  ]);

  return checkLimits([
    {
      key: `iching:ai:user:${day}:${kind}:${userHash}`,
      limit: ICHING_DAILY_LIMIT_PER_KIND,
      ttlSeconds: dayTtl,
      reason: "user",
    },
    {
      key: `iching:ai:ip:${hour.bucket}:${ipHash}`,
      limit: ICHING_IP_HOURLY_LIMIT,
      ttlSeconds: hour.retryAfter + 5,
      reason: "ip",
    },
    {
      key: `iching:ai:global:${day}`,
      limit: ICHING_GLOBAL_DAILY_LIMIT,
      ttlSeconds: dayTtl,
      reason: "global",
    },
  ]);
}

/** 未使用の画像APIを直接叩くアクセスにも短期制限をかける。 */
export async function checkCoinShareUsage(request: Request): Promise<UsageResult> {
  const now = new Date();
  const window = fixedWindow(now, 600);
  const ipHash = await hashIdentifier(requestIp(request));
  return checkLimits([
    {
      key: `iching:coin-share:ip:${window.bucket}:${ipHash}`,
      limit: COIN_SHARE_TEN_MINUTE_LIMIT,
      ttlSeconds: window.retryAfter + 5,
      reason: "ip",
    },
  ]);
}

export function resetIchingUsageForTests(): void {
  memoryStore.clear();
  redis = null;
}
