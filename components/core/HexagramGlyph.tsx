type HexagramGlyphProps = {
  /** 6爻。下から上 */
  lines: ("yin" | "yang")[];
  size?: "sm" | "lg";
  /** 朱でハイライトする爻(0=初爻 … 5=上爻) */
  changingIndex?: number;
};

/**
 * 辞典用の軽量な卦画。1爻=1div(陰爻は背景グラデで中央を空ける)。
 * 一覧に64個並ぶため、motion やクライアント JS を使わない。
 */
export default function HexagramGlyph({ lines, size = "sm", changingIndex }: HexagramGlyphProps) {
  return (
    <div className={`ik-glyph${size === "lg" ? " ik-glyph--lg" : ""}`} aria-hidden="true">
      {lines.map((line, i) => (
        <div
          key={i}
          className={[
            "ik-glyph-line",
            line === "yin" ? "ik-glyph-line--yin" : "",
            i === changingIndex ? "ik-glyph-line--changing" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}
