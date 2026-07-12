type StageMotifKind =
  | "tsukuru"
  | "tonaeru"
  | "yomu"
  | "katachi"
  | "shizen"
  | "hataraki"
  | "kazoku"
  | "hougaku"
  | "review";

const MOTIFS: Record<StageMotifKind, { mark: string; label: string }> = {
  tsukuru: { mark: "☰", label: "八卦の線をつくる" },
  tonaeru: { mark: "♪", label: "八卦の名をとなえる" },
  yomu: { mark: "文", label: "八卦の字をよむ" },
  katachi: { mark: "☷", label: "八卦のかたちを見る" },
  shizen: { mark: "◌", label: "八卦を自然として見る" },
  hataraki: { mark: "↗", label: "八卦のはたらきを見る" },
  kazoku: { mark: "家", label: "八卦を家族として見る" },
  hougaku: { mark: "方", label: "八卦を方角に置く" },
  review: { mark: "", label: "複数の卦のつながりを復習する" },
};

export default function StageMotif({ kind }: { kind: StageMotifKind }) {
  const motif = MOTIFS[kind];
  return (
    <div className={`hk-stage-motif is-${kind}`} role="img" aria-label={motif.label}>
      {kind === "review" ? (
        <span className="hk-review-glyph" aria-hidden><i /><i /><i /></span>
      ) : (
        <span aria-hidden>{motif.mark}</span>
      )}
    </div>
  );
}
