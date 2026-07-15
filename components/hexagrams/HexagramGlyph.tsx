type HexagramGlyphProps = {
  lines: ("yin" | "yang")[];
  size?: "sm" | "md" | "lg";
};

export default function HexagramGlyph({
  lines,
  size = "sm",
}: HexagramGlyphProps) {
  return (
    <span className={`hx-glyph hx-glyph--${size}`} aria-hidden="true">
      {lines.map((line, index) => (
        <span
          key={index}
          className={`hx-glyph-line${line === "yin" ? " is-yin" : ""}`}
        />
      ))}
    </span>
  );
}
