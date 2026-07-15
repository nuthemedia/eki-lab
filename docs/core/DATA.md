# 易のかたち Data

卦データ・立卦ロジックは `domain/iching/`、LLM/クォータ/履歴は `lib/`、API ルートは `app/api/iching/`。

## 立卦 (`domain/iching/cast.ts`)

- `castYarrow()`: 本筮の確率で6爻を生成。老陰 1/16・少陽 5/16・少陰 7/16・老陽 3/16。変爻 0〜6 本
- `castDice()`: 下卦 1/8・上卦 1/8・変爻 1/6。変爻は常に1本
- どちらも `HexagramResult` を返す。乱数を使うため描画中に呼ばずイベントハンドラ内で呼ぶ

## LLM API

**POST `/api/iching/refine`** — 問い整理(モデル: `OPENAI_ICHING_REFINE_MODEL` || gpt-5-nano)
- 入力 `{ rawInput(≤500字), clarifyingAnswer? }` → `{ result: RefineResult, source: "llm"|"fallback", remaining }`
- `RefineResult` は仕様書どおり(summary / category / ambiguityLevel / needsClarification / clarifyingQuestion / suggestedQuestions[] / recommendedInquiry)。Responses API の json_schema で構造化

**POST `/api/iching/interpret`** — 卦解釈(モデル: `OPENAI_ICHING_INTERPRET_MODEL` || gpt-5-mini)
- 入力 `{ rawInput, finalInquiry, primaryNumber, changingLineIndexes, relatingNumber }`。卦辞・爻辞は**サーバー側で** `HEXAGRAM_TEXTS` から引いてプロンプトに入れる(改ざん防止・トークン節約)
- 出力 `{ interpretation: Interpretation, source, remaining }`。`Interpretation` はセクション固定(answer=問いへの最終回答 / essence / primaryReading / changingReading / relatingReading / advice / caution)。answer は問いが求める選択への方向を示す3〜5文(断定はしない)。旧保存データには answer が無いことがあり、表示側は無ければ非表示にする

**POST `/api/iching/coin-interpret` / `/api/iching/coin-interpret/en`** — Coin日本語・英語解釈(モデル: `OPENAI_COIN_INTERPRET_MODEL` || gpt-5.6-luna)
- Coin固有の短い構造化回答を返す。カテゴリ、本卦、変爻、之卦をプロンプトへ渡し、固定データのフォールバックを常に用意する

共通: `lib/ichingLlm.ts`(fetch + json_schema + タイムアウト + リトライ)。クォータは `lib/ichingUsage.ts` と Upstash Redisで原子的に記録する。端末・種別ごとに日次10回、IPごとに毎時60回、全体で日次500回。IPは保存前にハッシュ化する。ローカル・テストはインメモリ、本番でRedis未設定・障害時はAIを呼ばない。**キー未設定・失敗・クォータ超過はすべてテンプレートにフォールバック**する。

`POST /api/iching/coin-share` はLLMを使わない画像APIだが、IPごとに10分30回へ制限する。超過は429、本番Redis障害時は503を返す。

## 保存・履歴 (`lib/ichingHistory.ts`)

- localStorage キー `iching-readings-v1`、最大50件。`SavedReading` = { id, savedAt, rawInput, finalInquiry, mode, primaryNumber, primaryName, changingLineIndexes, relatingNumber, relatingName, interpretation, interpretationSource }
- `useSyncExternalStore` で購読できる小さなストア(subscribeReadings / getReadingsSnapshot / getServerReadingsSnapshot)

## 型 (`domain/iching/types.ts`)

```ts
export type LineType = 'yin' | 'yang' | 'old-yin' | 'old-yang'

export type HexagramResult = {
  primaryLines: LineType[]        // 下から上(6要素)
  changingLineIndexes: number[]   // 0=初爻 … 5=上爻
  relatingLines: ('yin' | 'yang')[] // 之卦の六爻(下から上)
  primaryName?: string
  relatingName?: string
}

// 演出ステップ。kind で描画コンポーネントを切り替え、duration(ms)で自動進行する。
export type SequenceStep =
  | { kind: 'remove-one'; duration: number }
  | { kind: 'split'; duration: number; lineIndex: number }
  | { kind: 'count'; duration: number; lineIndex: number }
  | { kind: 'line-built'; duration: number; lineIndex: number; line: LineType }
  | { kind: 'roll-die'; duration: number; dieIndex: 0 | 1 | 2; face: number }
  | { kind: 'trigram'; duration: number; position: 'lower' | 'upper'; trigramIndex: number }
  | { kind: 'changing-line'; duration: number; lineIndex: number }
  | { kind: 'primary-complete'; duration: number }
  | { kind: 'transform'; duration: number }
  | { kind: 'result'; duration: number }
```

## 八卦・64卦 (`domain/hexagrams.ts`)

- 八卦(乾☰ 兌☱ 離☲ 震☳ 巽☴ 坎☵ 艮☶ 坤☷): `{ name, symbol, nature, lines }`。`lines` は下から上の3爻(`'yang' | 'yin'`)。
- 64卦: `{ number(序卦番号), name(漢字卦名), reading(かな) }` を、下卦・上卦の八卦の組で定義し、6爻パターン文字列(下から上、陽=`1` 陰=`0`。例 `"111111"` = 乾為天)をキーにした辞書 `HEXAGRAMS` に展開する。
- `hexagramFromLines(lines)`: 六爻(LineType[] または yin/yang[])から卦を引くヘルパー。老陽は陽、老陰は陰として解決する。

卦名は序卦伝の順の日本語通称(乾為天、坤為地、水雷屯、山水蒙 …)。64卦AI辞典(下記)がこのデータを一覧・詳細表示の基盤として使う。

## 卦の関係計算 (`domain/iching/relations.ts`)

6爻パターン文字列(下から上、陽=`1` 陰=`0`)上の純関数。`HEXAGRAMS` 辞書で逆引きし、データの重複を持たない。

- `patternOf(number)`: 序卦番号 → パターン文字列
- `nuclearPattern(p)`: 互卦。2〜4爻を下卦、3〜5爻を上卦に(index 1-3 + 2-4)
- `invertedPattern(p)`: 錯卦。全爻反転
- `reversedPattern(p)`: 綜卦。上下逆さ(文字列反転)。自己一致は 1,2,27,28,29,30,61,62 の8卦
- `changedPattern(p, lineIndex)`: 1爻だけ反転(その爻が動いたときの之卦)
- `relationsOf(number)`: `{ nuclear, inverted, reversed, isSelfNuclear, isSelfReversed, changed[6] }` を返す

テストは `domain/iching/relations.test.ts`(`npm run test:iching`)。錯・綜の対合性(全64卦)、乾の各爻変の古典既知値、綜卦自己一致8卦、互卦の像16卦などを検証。

## 辞典コンテンツ (`domain/iching/hexagramDictionary.ts`)

`HEXAGRAM_DICTIONARY: Record<number, HexagramDictionaryEntry>`(key は序卦番号 1-64)。**全部事前生成(書き下ろし)の静的データ**で、辞典はランタイム LLM を呼ばない。

```ts
type HexagramDictionaryEntry = {
  keywords: string[]      // 3〜4語。カード・検索用
  essence: string         // 一言の象意(〜30字)。カード副題・meta description
  trigramSymbolism: string // 上卦×下卦の象 1〜2文
  classical: string       // 古典的意味 2〜3文
  modern: string          // 現代的意味 2〜3文
  guidance: { scene: "仕事" | "人間関係" | "決断"; text: string }[] // 問いへの応用 3本
}
```

執筆ルール: 断定・宿命論・恐怖表現の禁止(解釈 API のトーンルールと同じ)、「今どう向き合うか」に着地。意味の源泉は `HEXAGRAM_TEXTS` と矛盾させない。既存訳書の引き写しをしない(このアプリのための書き下ろし)。1エントリ 300〜450字目安。

## 卦カード (`domain/iching/cardQuestions.ts` / `domain/iching/cardCopy.ts` / `lib/ichingCard.ts`)

`/card` 用。ランタイム LLM なし・サーバー保存なし。

- `CARD_QUESTIONS`: `{ id, text, category }` 約120問(変化 / いま・季節 / 仕事 / 人間関係 / 自分)。**id は共有URLに入るため恒久固定**(変更・再利用禁止、欠番可、追加は末尾に新 id)。`pickCardQuestions(5)` はイベントハンドラ / useEffect 内でのみ呼ぶ(乱数)
- `CARD_COPY`: `Record<number, { keyword, message }>` 64卦分の書き下ろし。keyword=カードの主役になる短い言葉、message=一言メッセージ。トーンルールは解釈 API・辞典と同じ(断定・宿命論・恐怖表現の禁止、「今どう向き合うか」に着地)。`HEXAGRAM_TEXTS` と矛盾させない
- `lib/ichingCard.ts`: 共有コード `"{qid}-{hex}-{line}"` の `encodeCardCode` / `decodeCardCode`(範囲+質問ID存在を検証、不正は null)、`buildCardContent`(画面カード・OG・9:16画像の3か所で共用する表示データ。変爻ヒントは `HEXAGRAM_TEXTS[hex].lines[line].modern` を再利用)、`buildShareUrl` / `buildXShareUrl` / `buildCardImageUrl`
- `lib/ichingCardOg.tsx`: ImageResponse(satori)用の卦画 flexbox 描画(`OgHexagramFigure`)とテーマ色定数。iching.css の色と揃えること
- **GET `/api/card-image?code=…`**: 1080×1920 の `ImageResponse`。code に対して決定的なので `Cache-Control: public, max-age=31536000, immutable`。不正コードは 400。日本語フォントは既存 OG と同じく next/og の自動グリフフォールバックに任せる(明示ロードなし)

## 旧モック結果について

- モックは廃止済み。`domain/iching/cast.ts` の本物の乱数立卦に置き換えた(上記「立卦」参照)。ステップ生成(`formalModeSteps.ts` / `diceModeSteps.ts`)と描画は `HexagramResult` を受け取るだけなので変更不要だった。

## 卦辞・爻辞 (`domain/iching/hexagramTexts.ts`)

- `HEXAGRAM_TEXTS: Record<number, HexagramText>`(key は序卦番号 1-64)。各卦に `judgment`(卦辞)と `lines[6]`(爻辞、下から上)を持ち、それぞれ `{ original, modern }`。
- 原文は中文維基文庫『周易』所収の白文(パブリックドメイン)に基づき、字体を通行本に正規化(無→无、后→後 等)。用九・用六は未収録。
- 現代語訳はこのアプリのための書き下ろし(既存訳の引き写しをしない)。
- 結果画面で本卦の卦辞、変爻の爻辞(爻名は `lineName()` で「初九」等)、之卦の卦辞を表示する。

## ステップ生成

- `buildFormalSteps(reading)`: remove-one → (split → count → line-built)×6 → primary-complete → changing-line → transform → result。変爻がない場合は changing-line / transform を省く。
- `buildDiceSteps(reading)`: roll-die(0) → trigram(lower) → roll-die(1) → trigram(upper) → roll-die(2) → changing-line → primary-complete → transform → result。
  - 出目は本物の対応: 骰子1・2(八面体)の `face` は八卦 index(0-7)、骰子3(六面体)の `face` は変爻位置(0-5)。
  - 三骰子方式は必ず変爻が1つ出るため、サイコロモードは `pickDiceReading()`(変爻なしシナリオを除外)を使う。
- duration は通常速度の ms。`useSequencePlayer` が速度倍率で除算する。
