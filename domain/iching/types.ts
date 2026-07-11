export type LineType = "yin" | "yang" | "old-yin" | "old-yang";

export type HexagramResult = {
  /** 六爻。下から上 */
  primaryLines: LineType[];
  /** 変爻の位置。0=初爻 … 5=上爻 */
  changingLineIndexes: number[];
  /** 之卦の六爻。下から上 */
  relatingLines: ("yin" | "yang")[];
  primaryName?: string;
  relatingName?: string;
};

/** 演出ステップ。kind で描画を切り替え、duration(ms・通常速度)で自動進行する */
export type SequenceStep =
  | { kind: "remove-one"; duration: number }
  | { kind: "split"; duration: number; lineIndex: number }
  | { kind: "count"; duration: number; lineIndex: number }
  | { kind: "line-built"; duration: number; lineIndex: number; line: LineType }
  | { kind: "roll-die"; duration: number; dieIndex: 0 | 1 | 2; face: number }
  | {
      kind: "trigram";
      duration: number;
      position: "lower" | "upper";
      trigramIndex: number;
    }
  | { kind: "changing-line"; duration: number; lineIndex: number }
  | { kind: "primary-complete"; duration: number }
  | { kind: "transform"; duration: number }
  | { kind: "result"; duration: number };

export type StepKind = SequenceStep["kind"];

/** 問い整理 API(/api/iching/refine)の結果 */
export type SuggestedQuestion = {
  id: string;
  label: string;
  inquiry: string;
  focus: "situation" | "action" | "relationship" | "timing" | "other";
};

export type RefineResult = {
  summary: string;
  category:
    | "love"
    | "work"
    | "relationship"
    | "business"
    | "creative"
    | "life"
    | "other";
  ambiguityLevel: "low" | "medium" | "high";
  needsClarification: boolean;
  clarifyingQuestion: string | null;
  suggestedQuestions: SuggestedQuestion[];
  recommendedInquiry: string;
};

/** 卦解釈 API(/api/iching/interpret)の結果。セクション構造固定 */
export type Interpretation = {
  /** 問いに正面から答える最終回答(旧保存データには無い場合がある) */
  answer: string;
  essence: string;
  primaryReading: string;
  changingReading: string | null;
  relatingReading: string | null;
  advice: string;
  caution: string;
};

/** 周易の原文と現代語訳のペア */
export type IChingText = {
  original: string;
  modern: string;
};

/** 一つの卦の卦辞と爻辞(下から上) */
export type HexagramText = {
  judgment: IChingText;
  lines: IChingText[];
};
