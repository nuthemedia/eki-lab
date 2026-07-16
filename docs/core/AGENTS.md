# 易のかたち (iching) AGENTS.md

When working on 易のかたち, read these files before implementation:

1. `docs/core/PROJECT.md`
2. `docs/core/DESIGN.md`
3. `docs/core/FEATURES.md`
4. `docs/core/DATA.md`

Likely implementation paths:

- `app/(core)/`
- `components/core/`
- `domain/iching/`

Keep changes focused on this app. Do not reorganize other app docs or migrate legacy specs unless explicitly requested.

Before changing behavior not covered by the docs, update the relevant iching doc first or ask for clarification.

Likely implementation paths (in addition to the above):

- `app/api/iching/` (refine / interpret routes)
- `lib/ichingLlm.ts`, `lib/ichingUsage.ts`, `lib/ichingHistory.ts`
- `app/(core)/hexagrams/` (64卦AI辞典: 一覧 + `[number]` 詳細)
- `domain/iching/relations.ts` (互卦・錯卦・綜卦・之卦の計算), `domain/iching/hexagramDictionary.ts` (書き下ろし解説データ)
- `app/(core)/card/` (卦カード: 入口 + `r/[code]` 共有ランディング), `app/api/card-image/` (9:16 画像)
- `features/card/`, `domain/iching/cardQuestions.ts`, `domain/iching/cardCopy.ts`, `lib/ichingCard.ts`, `lib/ichingCardOg.tsx`

Notes:

- `/` is the AWAI Commons brand page. It links to the public products 易有太極, HAKKE, コイン易占い, and 易経・六十四卦辞典. Do not restore public links to `/ask`, `/formal`, `/dice`, or `/card`.
- `/hexagrams` and `/hexagrams/[number]` are public, indexed routes. The other core routes remain directly accessible but are intentionally absent from the public sitemap and use `noindex, follow`.
- The main flow at `/ask` is: worry input → LLM question refinement → inquiry confirmation → casting → LLM interpretation → save. LLM calls are limited to those two API routes.
- LLM is OpenAI via the Responses API. Env: `OPENAI_API_KEY` (required for LLM output), optional `OPENAI_ICHING_REFINE_MODEL` (default gpt-5-nano), `OPENAI_ICHING_INTERPRET_MODEL` (default gpt-5-mini), and `OPENAI_COIN_INTERPRET_MODEL` (default gpt-5.6-luna). Production usage limits require `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, or the Vercel Marketplace equivalents `KV_REST_API_URL` / `KV_REST_API_TOKEN`. **Without a key, on quota exhaustion, or when production Redis is unavailable, everything falls back to templates and the flow must still complete** — preserve this property when changing the routes.
- Casting logic is real (`domain/iching/cast.ts`): yarrow probabilities for formal mode, uniform dice for dice mode. Call it only inside event handlers (hydration safety).
- Interpretation tone rules (no fatalistic statements, no fear, land on "how to face it now") live in the system prompts inside the API routes and in fixed UI copy. Do not weaken them.
- Fixed hexagram texts (`domain/iching/hexagramTexts.ts`) are the source of truth; the LLM must not invent 卦辞/爻辞 meanings.
- History is localStorage only (`iching-readings-v1`). No accounts, no server storage.
- Both casting modes replay a step array (`SequenceStep[]`) generated from a `HexagramResult`. Presentation and result data are deliberately separated.

Notes for the dictionary (64卦AI辞典):

- The dictionary is fully static: no runtime LLM, no new API routes. All commentary lives in `domain/iching/hexagramDictionary.ts` (書き下ろし; same tone rules as the interpret prompt — no fatalism, no fear, land on "how to face it now").
- Relations (互卦/錯卦/綜卦/之卦) are computed by pure functions in `domain/iching/relations.ts` over the 6-line pattern strings; run `npm run test:iching` after touching them.
- The index page must stay CSS-only (no motion/react); use `HexagramGlyph`, not `HexagramFigure`, for dictionary glyphs.

Notes for the card (卦カード):

- `/card` is the light entry funnel: preset questions only (no free text), no runtime LLM, no server storage. Card copy lives in `domain/cardCopy.ts` and question pool in `domain/cardQuestions.ts` — question ids are embedded in share URLs and must never change or be reused.
- Share code is `"{qid}-{hex}-{line}"`; `decodeCardCode` in `lib/ichingCard.ts` validates it. Invalid codes → 404 on the landing page, 400 on the image API.
- The 9:16 image and both OG images render via `ImageResponse` with no explicit font loading (next/og glyph fallback handles Japanese) — keep it that way unless tofu appears.

Verification:

- `curl -I http://127.0.0.1:3000/` (top page; also `/ask`, `/formal`, `/dice`)
- `curl -I http://127.0.0.1:3000/hexagrams` and `/hexagrams/1`, `/hexagrams/64` (200); `/hexagrams/0`, `/65`, `/abc` (404)
- `npm run test:iching` (relations math)
- `curl -X POST .../api/iching/refine -d '{"rawInput":"..."}'` returns the RefineResult JSON shape (source: "fallback" without a key)
- `curl -I http://127.0.0.1:3000/card` (200); `/card/r/12-31-4` (200); `/card/r/999-99-9` (404)
- `curl -I "http://127.0.0.1:3000/api/card-image?code=12-31-4"` (200 image/png) and `/card/r/12-31-4/opengraph-image` (200)
- Walk `/card` at 375px: five candidates → shuffle → pick → short casting animation → card → share panel (save image, X link, copy link) → CTA to `/ask`
- Open `/` at 320px, 390px, and 430px: the wheel is followed by `易から見えてくるもの`, the compact 3-perspective panel, then a centered `易を学ぶ 四つの入口` heading above the one-line flow `学ぶ → つくる → 占う → 読む` and 4 horizontal product rows. The flow-to-card gap must be 8px. Confirm there are no links to `/ask`, `/formal`, `/dice`, or `/card`. Open `/ask` directly and walk the flow: worry input → candidates → confirm → mode select → casting animation → interpretation sections → save → history re-read. Quick modes at `/formal` and `/dice` still play standalone with playback controls.
- Verify `/sitemap.xml` contains `/`, `/taikyoku`, `/hakke`, `/coin`, `/coin/en`, `/hexagrams`, and `/hexagrams/1` through `/hexagrams/64`. Verify only the non-public core HTML pages emit `noindex, follow` while remaining directly accessible.

Use `npm run dev` first if the local server is not already running.
