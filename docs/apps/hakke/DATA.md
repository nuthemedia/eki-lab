# Data

## Data Sources

- `data/iching/hexagrams.ts` の `TRIGRAMS`・`hexagramFromLines()`・`HEXAGRAMS_BY_NUMBER`(八卦の漢字名・記号☰〜☷・自然属性・爻3本、および6爻→64卦の変換)。**読み取りのみ、変更禁止**
- `data/hakke/trigrams.ts` — 上記を拡張した学習用データ(このアプリの唯一のデータソース)

## Types And Shape

```ts
type HakkeTrigram = Trigram & {
  id: number;        // TRIGRAMS の index (0-7)
  reading: string;   // けん / だ / り / しん / そん / かん / ごん / こん
  image: string;     // 自然イメージ一文
  story: string;     // 陰陽構造の一言(結果カード用)
  palette: { base: string; glow: string; deep: string }; // 自然現象ステージの配色
};

const LEARNING_ORDER: number[]; // 学習順の TRIGRAMS index: [0,7,2,5,3,6,1,4]
```

- `lines` は下から上(index 0 = 下爻)。描画側は配列先頭を画面の一番下に置く

学習進捗(`lib/hakkeProgress.ts`、localStorage key: `hakke-progress-v1`):

```ts
type HakkeProgress = {
  guidedRounds: number;   // お手本つきで8卦完走した回数
  recallRounds: number;   // 想起で8卦完走した回数
  chooseRounds: number;   // えらぶで8卦完走した回数
  perTrigram: Record<number, {
    recallBuilt: number;   // 想起・まいにちひとつで完成させた回数
    hinted: number;        // そっとお手本が出た回数
    chosen: number;        // えらぶで選べた回数
    chooseMissed: number;  // えらぶで一度でも外した回数
    lastSeenAt: string | null; // 最後にこの卦へ触れた日時(ISO)。まいにちひとつの出題選びに使う
  }>;
  lastCompletedAt: string | null; // ISO
  dailyPickId: number | null;     // 「きょうのひとつ」の対象卦
  dailyPickDate: string | null;   // dailyPickId を選んだ日(YYYY-MM-DD、UTC基準)
};
```

`useSyncExternalStore` 向けの購読可能ストア(`lib/ichingHistory.ts` と同パターン)。SSR ではサーバースナップショット(空)を返す。

まいにちひとつの出題選び(`pickDailyTrigramId` / `getDailyTrigramId`、[lib/hakkeProgress.ts](../../../lib/hakkeProgress.ts)): 未着手ボーナス + 経過日数 + hinted×2 + chooseMissed×2 の argmax による素朴なスコアリング(SM-2等の正式なアルゴリズムではない)。`dailyPickDate` が当日と一致する間は同じ卦を返す。日付比較は `toISOString().slice(0,10)` の UTC 基準で、ローカル日付の境界とは厳密に一致しない場合がある。

かさねる(`components/hakke/KasaneruFlow.tsx`)は下卦・上卦の `lines` を連結した6本の配列を `hexagramFromLines()` に渡すだけで、進捗永続化は行わない。

サウンド設定(`lib/hakkeSound.ts`、localStorage key: `hakke-sound-v1`、値は `"1"`/`"0"`): オン/オフのみを保持。`subscribeSound` / `getSoundOn` / `getServerSoundOn`(常に false)/ `setSoundOn` を公開する `useSyncExternalStore` 向けストア。既定オフ。音は手続き的 Web Audio で合成(アセットなし): ピンクノイズ Buffer と手続き的リバーブ IR を初回に1度だけ生成してキャッシュし、マスターに lowpass + reverb + 低め gain を通して chill にする。`nature(id)`×8 はノイズ+フィルタ+LFO のレイヤー合成、UI 音(tap/dissolve/chime/confirm)は丸い波形。オフの間は AudioContext を生成しない。

## Scripts

なし(静的データのみ)。

## Environment Variables

なし。
