import { ImageResponse } from "next/og";

export const alt = "HAKKE — 八卦を、手でおぼえる。";
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
    <span style={{ width: 62, height: 7, borderRadius: 4, background: "#33374a" }} />
  ) : (
    <span style={{ width: 62, display: "flex", justifyContent: "space-between" }}>
      <i style={{ width: 26, height: 7, borderRadius: 4, background: "#33374a" }} />
      <i style={{ width: 26, height: 7, borderRadius: 4, background: "#33374a" }} />
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
        padding: "64px 72px 54px",
        color: "#2b2e38",
        background: "#f5f5f0",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 94, fontWeight: 800, letterSpacing: 18 }}>
            HAKKE
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#626775", letterSpacing: 4 }}>
            八卦を、手でおぼえる。
          </div>
        </div>
        <div
          style={{
            width: 126,
            height: 126,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 32,
            border: "2px solid #d8d8ce",
            background: "rgba(255,255,255,0.72)",
            color: "#5560d8",
            fontSize: 46,
            fontWeight: 700,
          }}
        >
          陰陽
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {TRIGRAMS.map((lines, index) => (
          <div
            key={index}
            style={{
              width: 116,
              height: 126,
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              borderRadius: 22,
              border: "1px solid #d8d8ce",
              background: "rgba(255,255,255,0.86)",
            }}
          >
            {lines.map((line, lineIndex) => <Line key={lineIndex} value={line} />)}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 22,
          borderTop: "1px solid #d8d8ce",
          color: "#626775",
          fontSize: 24,
        }}
      >
        <span>形・読み・自然を、触れながら学ぶ</span>
        <span>awaicommons.com/hakke</span>
      </div>
    </div>,
    size,
  );
}
