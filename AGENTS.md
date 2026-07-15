# eki-lab

易(I Ching)を、現代のインターフェースで扱う単一サイト。母体機能と追加の学習体験を、1つの Next.js アプリとして配信するモジュラーモノリス。

## 構成の約束

- `app/(core)/` — eki-lab 母体のルート。Route Group は URL に含まれない
- `app/{slug}/` — `/hakke` など追加体験のルート
- `components/core/` — 母体で共有する UI と立卦表示
- `features/` — reading / dictionary / card など母体の機能単位
- `components/{slug}/`・`data/{slug}/` — 追加体験固有の UI・データ
- `domain/iching/` — 八卦・64卦・卦辞・爻辞・関係計算の共有ドメイン。UI に依存させない
- `lib/` — localStorage、LLM、OG など技術・横断ヘルパ
- `docs/core/` — 母体仕様、`docs/apps/{slug}/` — 追加体験仕様
- import は `@/*`(tsconfig の paths、ルート基準)

## いま入っているもの

- `/` — AWAI Commonsの紹介ページ。公開プロダクトとしてTaikyoku・Hakke・コイン易の3つだけを案内する。
- `/taikyoku` — 太極から六十四卦への生成構造を触れて学ぶ3D体験。仕様は `docs/apps/taikyoku/`。
- `/hakke` — 八卦をつくって覚える学習体験。仕様は `docs/apps/hakke/`。
- `/coin`・`/coin/en` — コイン易占いの日本語版・英語版。
- `/ask`・`/formal`・`/dice`・`/hexagrams`・`/card` — 機能は維持するが、公開導線と検索対象から外した直接アクセス用の母体機能。
- `domain/iching/hexagrams.ts` — 八卦・64卦の共有データ。各体験から読み取り専用で参照する。

## 分割方針

デプロイ単位が1つの間はワークスペース化しない。独立デプロイ、異なる所有チーム、異なるリリース周期、または複数ランタイムから共有パッケージを利用する必要が生じた場合のみ `apps/` と `packages/` の並列モノリポへ移行する。アプリをアプリの中へ入れ子にしない。

## スタック

Next 16 / React 19 / TypeScript / Tailwind v4 / motion。音は手続き的 Web Audio(アセットなし)。

## 本番公開

- Production公開は、cleanな作業ツリーで`HEAD`が最新の`origin/main`と一致するときだけ行う。
- `vercel --prod`を直接実行せず、必ず`npm run deploy:production`を使う。
- 古いブランチや別worktreeをVercelの`eki-lab`プロジェクトへリンクしない。
