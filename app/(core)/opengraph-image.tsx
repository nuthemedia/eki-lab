import { ImageResponse } from "next/og";

export const alt = "AWAI Commons — 易を、手を動かして学ぶ。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TRIGRAMS = [
  ["yang", "yang", "yang"],
  ["yang", "yang", "yin"],
  ["yang", "yin", "yang"],
  ["yang", "yin", "yin"],
  ["yin", "yang", "yang"],
  ["yin", "yang", "yin"],
  ["yin", "yin", "yang"],
  ["yin", "yin", "yin"],
] as const;

function Line({ value }: { value: "yin" | "yang" }) {
  return value === "yang" ? (
    <span
      style={{ width: 66, height: 8, borderRadius: 4, background: "#2b2e38" }}
    />
  ) : (
    <span style={{ width: 66, display: "flex", justifyContent: "space-between" }}>
      <i style={{ width: 28, height: 8, borderRadius: 4, background: "#2b2e38" }} />
      <i style={{ width: 28, height: 8, borderRadius: 4, background: "#2b2e38" }} />
    </span>
  );
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 72px 58px",
        color: "#2b2e38",
        background: "#f5f5f0",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: 2 }}>
            AWAI Commons
          </span>
          <span style={{ color: "#626775", fontSize: 27, letterSpacing: 3 }}>
            あわいコモンズ
          </span>
        </div>
        <div style={{ display: "flex", color: "#5560d8", fontSize: 38, fontWeight: 600 }}>
          易を、手を動かして学ぶ。
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {TRIGRAMS.map((lines, index) => (
          <div
            key={index}
            style={{
              width: 116,
              height: 142,
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              borderRadius: 24,
              border: "1px solid #d8d8ce",
              background: "rgba(255,255,255,0.9)",
            }}
          >
            {lines.map((line, lineIndex) => (
              <Line key={lineIndex} value={line} />
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          paddingTop: 22,
          borderTop: "1px solid #d8d8ce",
          color: "#626775",
          fontSize: 23,
          letterSpacing: 1,
        }}
      >
        八卦をつくって学ぶHAKKEと、易を体験するアプリ
      </div>
    </div>,
    size,
  );
}
