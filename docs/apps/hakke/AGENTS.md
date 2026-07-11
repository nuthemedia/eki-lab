# Hakke App Docs

Route: `/hakke`

Read order for any hakke work:

0. **`HANDOFF.md` — 現在の実装(8ステージ+復習)の正。まずこれを読む。** PROJECT/FEATURES/DESIGN/DATA は旧MVP記述で古い。
1. `PROJECT.md` — purpose, audience, MVP scope
2. `DESIGN.md` — UI direction, screens, motion
3. `FEATURES.md` — flow, states, acceptance criteria
4. `DATA.md` — data sources and type contracts

## Implementation paths

- `app/hakke/` — route (layout, page, scoped CSS)
- `components/hakke/` — client components (builder UI)
- `components/hakke/stage/` — Canvas 2D nature stage
- `data/hakke/` — trigram learning data (extends `domain/hexagrams.ts`)

## Hard invariants

- The first experience is always building a trigram bottom-up with 陽/陰 buttons. The nature stage is a supporting reward, never the entry point.
- Lines array order: index 0 = 下爻 (bottom). Rendering must place array index 0 at the visual bottom.
- No quiz/test/score/correctness vocabulary or ✗/○ marks anywhere in the UI. Use つくる / そろえる / ひらく / つぎへ / もう一度つくる.
- Do not modify `domain/iching/*` — import only.
- Not registered in production route verification yet (local-only). Before deploying, add paths to `scripts/verify-production-routes.mjs` and a card to `lib/brandHomeContent.ts`.
