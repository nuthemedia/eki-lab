# eki-lab

易(I Ching)を、手を動かして学ぶためのアプリ集。各アプリは Next.js App Router の1ルートとして `app/{slug}` に置く。

## 構成の約束

- `app/{slug}/` — アプリのルート(layout / page / スコープド CSS)
- `components/{slug}/` — そのアプリのクライアントコンポーネント
- `data/{slug}/` — そのアプリの静的データ・ドメインロジック
- `lib/{slug}*.ts` — 横断ヘルパ(localStorage ストア等)
- `docs/apps/{slug}/` — アプリ仕様(AGENTS / PROJECT / DESIGN / FEATURES / DATA)
- import は `@/*`(tsconfig の paths、ルート基準)

## いま入っているもの

- `/hakke` — 八卦ビルダー(最初のアプリ)。仕様は `docs/apps/hakke/`。
- ルート `/` は易インデックス(アプリ一覧)。今は `/hakke` へのリンク1枚。アプリ追加時は `app/page.tsx` の `apps` 配列にカードを足す。
- `data/iching/hexagrams.ts` — 八卦・64卦データ(hakke が参照。将来の易占アプリの土台)。

## スタック

Next 16 / React 19 / TypeScript / Tailwind v4 / motion。音は手続き的 Web Audio(アセットなし)。
