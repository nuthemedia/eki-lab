/**
 * 卦カード(/card)のプリセット質問プール。
 *
 * id は共有URL(/card/r/{qid}-{hex}-{line})に入るため恒久固定。
 * 変更・再利用は禁止(欠番は可)。追加は末尾に新しい id で行うこと。
 * 文言は断定的な吉凶や恐怖訴求を避け、「いまをどう向き合うか」の問いにする。
 */

export type CardQuestionCategory =
  | "変化"
  | "いま・季節"
  | "仕事"
  | "人間関係"
  | "自分";

export type CardQuestion = {
  id: number;
  text: string;
  category: CardQuestionCategory;
};

export const CARD_QUESTIONS: CardQuestion[] = [
  // --- 変化 (1-24) ---
  { id: 1, text: "今の私に必要な変化", category: "変化" },
  { id: 2, text: "手放すと楽になるもの", category: "変化" },
  { id: 3, text: "次の章へ進むために置いていくもの", category: "変化" },
  { id: 4, text: "いま芽生え始めているもの", category: "変化" },
  { id: 5, text: "変えなくていいもの", category: "変化" },
  { id: 6, text: "そろそろ終わらせていいこと", category: "変化" },
  { id: 7, text: "新しく始めるなら、どんな姿勢で", category: "変化" },
  { id: 8, text: "この停滞の意味", category: "変化" },
  { id: 9, text: "いまの流れは追い風か、向かい風か", category: "変化" },
  { id: 10, text: "動くべきか、待つべきか", category: "変化" },
  { id: 11, text: "環境を変えることについて", category: "変化" },
  { id: 12, text: "いまの私が卒業すべき習慣", category: "変化" },
  { id: 13, text: "変わりたいのに変われない理由", category: "変化" },
  { id: 14, text: "この転機で大切にすべきこと", category: "変化" },
  { id: 15, text: "リセットしたい気持ちとの付き合い方", category: "変化" },
  { id: 16, text: "少しずつ変わってきているもの", category: "変化" },
  { id: 17, text: "今年後半の変化のテーマ", category: "変化" },
  { id: 18, text: "先延ばしにしている決断へのヒント", category: "変化" },
  { id: 19, text: "崩れかけているものへの向き合い方", category: "変化" },
  { id: 20, text: "再挑戦することについて", category: "変化" },
  { id: 21, text: "いまの私に必要な「やめる勇気」", category: "変化" },
  { id: 22, text: "流れに任せるべきこと", category: "変化" },
  { id: 23, text: "自分から動いて変えるべきこと", category: "変化" },
  { id: 24, text: "変化の波への乗り方", category: "変化" },

  // --- いま・季節 (25-48) ---
  { id: 25, text: "この夏のテーマ", category: "いま・季節" },
  { id: 26, text: "今週の私に必要な心がまえ", category: "いま・季節" },
  { id: 27, text: "今日という日の過ごし方", category: "いま・季節" },
  { id: 28, text: "いまの私に足りていないもの", category: "いま・季節" },
  { id: 29, text: "いまの私に満ちているもの", category: "いま・季節" },
  { id: 30, text: "この時期に育てておくべきもの", category: "いま・季節" },
  { id: 31, text: "いまの足踏みは何のサインか", category: "いま・季節" },
  { id: 32, text: "今月の流れとの付き合い方", category: "いま・季節" },
  { id: 33, text: "いま一番大切にすべき時間", category: "いま・季節" },
  { id: 34, text: "季節の変わり目の整え方", category: "いま・季節" },
  { id: 35, text: "いまの私へのねぎらいの言葉", category: "いま・季節" },
  { id: 36, text: "直感を信じていい場面か", category: "いま・季節" },
  { id: 37, text: "いま感じている焦りの正体", category: "いま・季節" },
  { id: 38, text: "この休みの過ごし方のヒント", category: "いま・季節" },
  { id: 39, text: "いまの私の充電の仕方", category: "いま・季節" },
  { id: 40, text: "目の前のことに集中するために", category: "いま・季節" },
  { id: 41, text: "いまの暮らしで整えるべき場所", category: "いま・季節" },
  { id: 42, text: "最近ざわつく心の鎮め方", category: "いま・季節" },
  { id: 43, text: "いまの私のリズムの取り戻し方", category: "いま・季節" },
  { id: 44, text: "今夜、考えるのをやめていいこと", category: "いま・季節" },
  { id: 45, text: "この先の季節に蒔いておく種", category: "いま・季節" },
  { id: 46, text: "いまの縁の巡りについて", category: "いま・季節" },
  { id: 47, text: "いまの私の「ちょうどいい」ペース", category: "いま・季節" },
  { id: 48, text: "明日を軽くするために今日できること", category: "いま・季節" },

  // --- 仕事 (49-72) ---
  { id: 49, text: "仕事運ではなく、仕事との向き合い方", category: "仕事" },
  { id: 50, text: "いまの仕事で伸ばすべき芽", category: "仕事" },
  { id: 51, text: "職場での私の立ち位置", category: "仕事" },
  { id: 52, text: "この仕事を続けることについて", category: "仕事" },
  { id: 53, text: "転職を考える私へのヒント", category: "仕事" },
  { id: 54, text: "いまの働き方で見直すべきこと", category: "仕事" },
  { id: 55, text: "頑張りどころか、休みどころか", category: "仕事" },
  { id: 56, text: "報われない気がするときの心の置き方", category: "仕事" },
  { id: 57, text: "新しい挑戦とタイミング", category: "仕事" },
  { id: 58, text: "お金との付き合い方のヒント", category: "仕事" },
  { id: 59, text: "学び直しについて", category: "仕事" },
  { id: 60, text: "チームでの私の役割", category: "仕事" },
  { id: 61, text: "人を率いることとの向き合い方", category: "仕事" },
  { id: 62, text: "断るべきことの見分け方", category: "仕事" },
  { id: 63, text: "いまの忙しさの意味", category: "仕事" },
  { id: 64, text: "仕事とプライベートの境目", category: "仕事" },
  { id: 65, text: "独立という選択肢について", category: "仕事" },
  { id: 66, text: "いまの職場で守るべきもの", category: "仕事" },
  { id: 67, text: "キャリアの寄り道について", category: "仕事" },
  { id: 68, text: "仕事の停滞感との付き合い方", category: "仕事" },
  { id: 69, text: "苦手なことへの向き合い方", category: "仕事" },
  { id: 70, text: "私の強みが活きる場面", category: "仕事" },
  { id: 71, text: "完璧主義との付き合い方", category: "仕事" },
  { id: 72, text: "次のステップへの準備", category: "仕事" },

  // --- 人間関係 (73-96) ---
  { id: 73, text: "人間関係で手放すべき思い込み", category: "人間関係" },
  { id: 74, text: "いま距離を置くべき関係", category: "人間関係" },
  { id: 75, text: "いま大切に育てるべき縁", category: "人間関係" },
  { id: 76, text: "あの人との関係のこれから", category: "人間関係" },
  { id: 77, text: "わかり合えない相手との向き合い方", category: "人間関係" },
  { id: 78, text: "私が人に求めすぎているもの", category: "人間関係" },
  { id: 79, text: "素直になれない理由", category: "人間関係" },
  { id: 80, text: "謝るべきか、待つべきか", category: "人間関係" },
  { id: 81, text: "新しい出会いへの心の開き方", category: "人間関係" },
  { id: 82, text: "家族との距離感", category: "人間関係" },
  { id: 83, text: "友情の育て方", category: "人間関係" },
  { id: 84, text: "恋愛で私が繰り返しているパターン", category: "人間関係" },
  { id: 85, text: "好意を伝えることについて", category: "人間関係" },
  { id: 86, text: "ひとりの時間と人といる時間のバランス", category: "人間関係" },
  { id: 87, text: "頼ることが苦手な私へ", category: "人間関係" },
  { id: 88, text: "期待と信頼の違い", category: "人間関係" },
  { id: 89, text: "沈黙が気まずい相手との過ごし方", category: "人間関係" },
  { id: 90, text: "SNSでの人付き合いとの距離", category: "人間関係" },
  { id: 91, text: "昔の縁をたどることについて", category: "人間関係" },
  { id: 92, text: "聞き役ばかりの私が言っていいこと", category: "人間関係" },
  { id: 93, text: "嫉妬心との付き合い方", category: "人間関係" },
  { id: 94, text: "別れを引きずる心への手あて", category: "人間関係" },
  { id: 95, text: "私のまわりの風通しについて", category: "人間関係" },
  { id: 96, text: "誰かを許すことについて", category: "人間関係" },

  // --- 自分 (97-120) ---
  { id: 97, text: "いまの私がいちばん恐れているもの", category: "自分" },
  { id: 98, text: "自分を責める癖との付き合い方", category: "自分" },
  { id: 99, text: "私の中で育ちつつある強さ", category: "自分" },
  { id: 100, text: "本当はやりたいのに蓋をしていること", category: "自分" },
  { id: 101, text: "自分らしさについて", category: "自分" },
  { id: 102, text: "心と体のバランスの整え方", category: "自分" },
  { id: 103, text: "私の直感の信じ方", category: "自分" },
  { id: 104, text: "コンプレックスとの向き合い方", category: "自分" },
  { id: 105, text: "いまの私に必要な休息のかたち", category: "自分" },
  { id: 106, text: "自分へのご褒美の選び方", category: "自分" },
  { id: 107, text: "私が背負いすぎているもの", category: "自分" },
  { id: 108, text: "「ちゃんとしなきゃ」を緩めるヒント", category: "自分" },
  { id: 109, text: "私の好奇心の向かう先", category: "自分" },
  { id: 110, text: "過去の自分への伝言", category: "自分" },
  { id: 111, text: "未来の自分から見た今日", category: "自分" },
  { id: 112, text: "私の感情の波との付き合い方", category: "自分" },
  { id: 113, text: "ひとりの夜の過ごし方", category: "自分" },
  { id: 114, text: "自信のつくり方", category: "自分" },
  { id: 115, text: "私の「好き」の育て方", category: "自分" },
  { id: 116, text: "焦らない私になるために", category: "自分" },
  { id: 117, text: "比べてしまう心の鎮め方", category: "自分" },
  { id: 118, text: "いまの私の土台になっているもの", category: "自分" },
  { id: 119, text: "なりたい自分との距離", category: "自分" },
  { id: 120, text: "今日の私を一言でいうなら", category: "自分" },
];

export const CARD_QUESTIONS_BY_ID: Record<number, CardQuestion> =
  Object.fromEntries(CARD_QUESTIONS.map((q) => [q.id, q]));

/**
 * プールから重複なしでランダムに count 件選ぶ。乱数を使うため、
 * SSR ハイドレーション不整合を避けるにはイベントハンドラ /
 * useEffect 内で呼ぶこと(描画中に呼ばない)。
 */
export function pickCardQuestions(count = 5): CardQuestion[] {
  const pool = [...CARD_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
