# HAKKE 引き継ぎ(Codex 向け・現状の正)

> このドキュメントが **HAKKE の最新の実装状況** を表す唯一の資料です。
> 同ディレクトリの `PROJECT.md` / `FEATURES.md` / `DESIGN.md` / `DATA.md` は **旧MVP(3モード:つくる/おもいだす/えらぶ + 6ステップ)** を記述しており、現在の 8ステージ構成とは乖離しています。
> `AGENTS.md` の「Hard invariants」だけは今も有効なので必ず読むこと。

Route: `/hakke`(単一クライアント状態機械)。スタック: Next 16 / React 19 / TS / Tailwind v4 / motion。

---

## 1. 現状サマリ(機能完成)

八卦を「手で作って覚える」学習アプリ。トップは **8ステージの地図** + 補助導線。以下すべて実装・動作確認済み。

| # | slug | 画面名 | 学ぶ対応 | 記録キー(assoc) |
|---|------|--------|----------|------------------|
| 1 | `tsukuru` | つくる | 陰陽を下から積んで形を作る(旧ビルダー) | (perTrigram 側) |
| 2 | `tonaeru` | となえる | 名前の読みを先天順の**声**で | (なし=クリアのみ) |
| 3 | `yomu` | よむ | 形↔字↔読み | `form-name` / `form-reading` |
| 4 | `katachi` | かたちを言う | 八卦取象歌(口訣)理解→ペア→クイズ→テスト | `form-mnemonic` / `form-meaning` |
| 5 | `shizen` | 自然を見る | 形↔自然(+自然の唱え音声) | `form-nature` |
| 6 | `hataraki` | はたらきを知る | 形↔動詞 | `form-verb` |
| 7 | `kazoku` | 家族でつなぐ | 家族象・男女・長中少(異爻ハイライト) | `family-form` |
| 8 | `hougaku` | 方角にひろげる | 後天方位に配置 | `direction-form` |
| — | (review) | ふくしゅう | 苦手を relation 横断で再出題 | (既存 assoc を利用) |

- ステージは **線形解放**(前がクリア済みで次が開く)。全稼働クリアでトップCTAは消える。
- トップCTA:未着手=**はじめる** / 途中=**つづける：{ステージ名}** / つくる中断=**続きから N/8** / 全クリア=**非表示**。

---

## 2. アーキテクチャ:association エンジン

「ステージごとに画面を作る」のではなく、**卦の"面(facet)"どうしの対応(association)** を出題する少数の汎用部品をデータで駆動する。ステージはその上のプレイリスト。

### facet / relation
- `data/hakke/trigrams.ts`:`Relation = form | kanji | reading | mnemonic | meaning | nature | verb | family | direction`。
- `facetOf(trigram, relation)` → `{kind:"form", lines}` か `{kind:"text", text}`。
- `pairKey(a,b)` → 記録キー。**concept をアルファベット順に連結**(方向は区別しない)。例:`pairKey("form","direction") === "direction-form"`。
- `relationFromKey(key)` → `[prompt, answer]`(復習用の逆引き。form を含むキーは**答えを form に統一**)。

### 汎用エクササイズ部品(`components/hakke/exercise/`)
- **`PickExercise`**:`{items, promptRelation, answerRelation, choices:2|4|8, onComplete, onExit}`。N択・薄れる誤答・`ResultCard` リビール・`recordAssoc` を内包。**全ステージの中心**。
- **`SequenceTap`**:`{targetOrder, render?, hint, onComplete}`。正しい順にタップ(となえる/自然リズム/長中少)。
- **`FillBlank`**:口訣の末字穴埋め(かたちを言う のクイズ)。
- **`PlaceBoard`**:後天方位盤(3×3、中央不使用)。`{toPlace, fixed?, hint, onComplete}`。卦を選ぶ→方角セルを押す。`POSTNATAL_LAYOUT` / `ID_BY_DIR` を export。

### 導入カード
- **`TeachWalk`**(`components/hakke/TeachWalk.tsx`):`{eyebrow, slides:ReactNode[], lastLabel, nextLabel?, onDone, onExit}`。各ステージの「理解」パートで使う汎用ステッパー。

### ステージ登録 / ルーティング
- **`data/hakke/stages.ts`**:`STAGES`(slug/num/title/subtitle/**ready**)、`stageViews(progress)` → `{views, current}`(current=真の次、無ければ null)。
- **`components/hakke/HakkeApp.tsx`**:状態機械。`type Phase = intro | build | nature | reveal | complete | zukan | daily | kasaneru | stage | review`。`activeStage: StageSlug|null`。`phase==="stage"` の中で slug ごとに `XxxStage` を出し分け、`phase==="review"` で `ReviewFlow`。トップ(intro)= hero + `HakkeEyecatch` + CTA + 8ステージ地図(`.hk-ladder`)+ 八卦の進捗(`.hk-tprog`)+ 足元(きょうのひとつ / ふくしゅう / ずかん / かさねる)。

---

## 3. ファイルマップ

```
app/hakke/               layout.tsx(SoundToggle 常設)/ page.tsx / hakke.css(全スタイル, hk- 接頭辞)
components/hakke/
  HakkeApp.tsx           ← 状態機械・トップ。ここが起点
  TrigramFigure.tsx      形の描画(size guide/stage/mini、showEmpty/ghost/animate/highlight)
  TeachWalk.tsx          導入カードのステッパー
  HakkeEyecatch.tsx      トップの静かなアイキャッチ
  ChantStage.tsx         となえる(chant.mp3 + 4+4 点灯 + ならべる)
  NatureRhythmCard.tsx   自然を見る の導入(nature-chant.mp3 + 8等分点灯)
  YomuStage/KatachiStage/ShizenStage/HatarakiStage/KazokuStage/HougakuStage.tsx
  ReviewFlow.tsx         ふくしゅう
  ResultCard/ProgressDots/SoundToggle.tsx
  ZukanView/DailyOne/KasaneruFlow/ChooseFlow/CompletionView/YinYangButtons.tsx  (既存の周辺)
  exercise/              PickExercise / SequenceTap / FillBlank / PlaceBoard
  stage/                 NatureStage.tsx + effects.ts(8自然象の Canvas 演出)+ effectTypes.ts
data/hakke/              trigrams.ts(データ＋facet＋定数）/ stages.ts
lib/                     hakkeProgress.ts(進捗) / hakkeSound.ts(手続き音) / hakkeVoice.ts(音声クリップ再生)
public/audio/hakke/      chant.mp3(となえる通し) / nature-chant.mp3(自然の唱え)
domain/iching/hexagrams.ts  八卦・64卦の共有データ。**import のみ・改変禁止**
```

---

## 4. データモデル(`data/hakke/trigrams.ts`)

`HAKKE_TRIGRAMS[id]`(id 0-7 = 先天順 乾兌離震巽坎艮坤)。各卦のフィールド:
`name/symbol/nature/lines`(domain 由来）+ `reading, image, story, palette, mnemonic, mnemonicReading, mnemonicModern, natureReading, verb, verbDescription, family, genderGroup, familyOrder, prenatalIndex(=id), direction{label,key}`。

- 定数:`LEARNING_ORDER=[0,7,2,5,3,6,1,4]`(構造対) / `PRENATAL_TRIGRAMS`(0-7) / `SONG_ORDER=[0,7,3,6,2,5,1,4]`(取象歌行順) / `CONTRAST_PAIRS`(かたちを言う のペア)。
- ヘルパ:`facetOf` / `pairKey` / `relationFromKey` / `deriveFamily(lines)`(少数派の爻から家族象を導出。dev アサートで data と突合)。
- 後天方位:離=南/坎=北/震=東/兌=西/巽=東南/坤=西南/乾=西北/艮=東北(`direction.key`=N/NE/E/SE/S/SW/W/NW)。

---

## 5. 進捗スキーマ(`lib/hakkeProgress.ts`)

localStorage キー **`hakke-progress-v2`**(旧 `hakke-progress-v1` から自動移行。guided 完走者は `tsukuru` クリア扱いを付与)。`HakkeProgress`:
```
guidedRounds/recallRounds/chooseRounds, perTrigram{recallBuilt,hinted,chosen,chooseMissed,lastSeenAt},
lastCompletedAt, dailyPickId, dailyPickDate, sessionMode, sessionStep,
assoc: Record<relationKey, Record<trigramId, {seen,correct,wrong,lastSeenAt}>>,
stagesCleared: string[]
```
- 主要 API:`recordAssoc(relationKey,id,correct)` / `getReviewQueue(limit)`(弱い順) / `getWeakByRelation(key)` / `recordStageClear(slug)` / `recordSession`/`clearSession`(つくる中断の再開)。
- `useSyncExternalStore`(`subscribeProgress`/`getProgressSnapshot`)で購読。SSR スナップショットは空。
- **assoc キーはアルファベット順**(`family-form`, `direction-form`, `form-nature`…)。新ステージ追加時に混乱しやすいので注意。

---

## 6. 新ステージの作り方(レシピ)

1. `components/hakke/XxxStage.tsx` を作る:`{onComplete, onExit}` を受け、`phase` で **導入(`TeachWalk`)→ 練習(`PickExercise`/`SequenceTap`/新部品)→ テスト(`PickExercise`)** を進める。`YomuStage`/`ShizenStage` が手本。
2. `data/hakke/stages.ts` の該当 slug を `ready:true`。
3. `HakkeApp.tsx` の `phase==="stage"` 分岐に `if (activeStage==="<slug>") return <XxxStage onComplete={()=>{recordStageClear("<slug>"); backToIntro();}} onExit={backToIntro} />;`。
4. `app/hakke/hakke.css` に最小スタイル(既存 `.hk-teach-*`/`.hk-pick-stage`/`.hk-cta` を流用)。
5. 記録は `recordAssoc(pairKey(prompt,answer), id, correct)`(PickExercise が自動で呼ぶ)。

---

## 7. 不変条件・流儀(厳守)

- **爻は下から**:`lines` index0 = 下爻。`.hk-fig` は `column-reverse` で index0 を視覚最下段に。
- **先天(となえる)と後天(方角)を同一画面に出さない**。方角の導入では先天順の並びを表示しないこと。
- **テスト/スコア/✗・○ 語彙を使わない**。UI 語彙:つくる / そろえる / ひらく / つぎへ / もう一度。誤答は「静かに薄れる/揺れる」で表現。
- **`domain/iching/*` は import のみ**(改変禁止)。
- サウンドは **既定オフ**(`hakke-sound-v1`)。唱え系(となえる/自然のリズム)は **再生操作で自動ON**(`setSoundOn(true)`)。
- 音声は **クリップ優先→ブラウザ読み上げ**フォールバック(`lib/hakkeVoice.ts` の `clipExists`/`speakReading`)。
- モバイル最優先、タップ域44px、`prefers-reduced-motion` 対応、配色は生成り+白+青紫(`--hk-accent #5560d8`)。

---

## 8. 既知の落とし穴(Codex 必読)

- **同型コンポーネントを phase 違いで同じ位置に並べたら必ず `key` を付ける**。付けないと React がインスタンスを再利用し内部 state を持ち越す(KazokuStage の男/女 `SequenceTap` で実際にバグった。`ReviewFlow` の連続 `PickExercise`・`PlaceBoard` の各ラウンドも同様)。
- **シェルの cwd が親プロジェクト(UFO-lab-main)へ戻ることがある**。`npm run lint/build/dev` は毎回 `cd /Users/juoz/Desktop/Projects/eki-lab && …`、`node -e "console.log(require('./package.json').name)"` で eki-lab か確認する。
- プレビュー :3200 が別セッションのサーバーに占有される場合あり。既存ブラウザタブへ `location.href='/hakke'` で到達可(同一リポジトリなので HMR が反映)。
- **静的な `TeachWalk` スライドにインタラクティブ要素**(再生・タップ等)を足すときは、小さな client コンポーネントに切り出して slide として渡す(例 `NatureRhythmCard`)。
- lint の残警告3件は `features/card/SharePanel.tsx`(iching 側、hakke とは無関係)。hakke コードは 0 warning を保つ。

---

## 9. 実行 / 検証

- 起動:`cd .../eki-lab && npm run dev`(:3200)。lint/build:`npm run lint` / `npm run build`。
- 各ステージ検証:devtools で localStorage を seed して解放状態を作る。例:
  ```js
  localStorage.setItem('hakke-progress-v2', JSON.stringify({guidedRounds:0,recallRounds:0,chooseRounds:0,perTrigram:{},lastCompletedAt:null,dailyPickId:null,dailyPickDate:null,sessionMode:null,sessionStep:null,assoc:{},stagesCleared:['tsukuru','tonaeru','yomu','katachi']}));
  location.href='/hakke';
  ```
  出題→正誤で `assoc[key][id]` が増え、クリアで `stagesCleared` に slug 追加、トップCTAが次ステージ名に更新されることを確認。
- 音は実機(ヘッドレスでは鳴らない)。クリップは `/audio/hakke/*.mp3` が 200 で配信されること。

---

## 10. 未完了 / 任意タスク

- **本番デプロイ未反映**:Vercel プロジェクト `eki-lab`(直接 `npx vercel --prod` で過去に配信)。ただし現在リポジトリを iching 統合で再構成中(`app/(core)/`・`components/core/`・`features/`・`domain/`)なので、その安定後に。
- **個別8音声** `ken.mp3…kon.mp3`(となえるのセルタップ用):通し `chant.mp3` で「きく」は成立済みのため保留。将来 ElevenLabs 等で別録り or 精密スライス。
- **出題カードの縦間延び**:`.hk-stage` が縦に伸びがち。prompt 用にコンパクトな高さへ調整の余地。
- **旧 docs の現状化**:`docs/apps/hakke/{PROJECT,FEATURES,DESIGN,DATA}.md` を 8ステージ構成に更新(本 HANDOFF が暫定の最新)。
- **production route verification 未登録**(`AGENTS.md` 記載)。デプロイ前に `/hakke` をルート検証と本体導線へ登録。

---

## 11. 参照

- `docs/apps/hakke/AGENTS.md` — 実装パスと **Hard invariants**(有効)。
- `docs/apps/hakke/{PROJECT,FEATURES,DESIGN,DATA}.md` — **旧MVP記述**(参考程度)。
- リポジトリ全体の方針は ルート `AGENTS.md`(eki-lab をモジュラーモノリスとして再構成中)。
