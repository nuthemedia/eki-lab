import { ImageResponse } from "next/og";

export const alt = "コイン易占い — 問いを立て、コインを投げ、卦を読む。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

function Coin({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{
        width: 122,
        height: 122,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        border: `3px solid ${dark ? "#74592f" : "#b58a42"}`,
        background: dark
          ? "radial-gradient(circle at 34% 28%, #a57c3f 0%, #684b29 70%, #44331f 100%)"
          : "radial-gradient(circle at 34% 28%, #e4c987 0%, #b98b42 68%, #85612e 100%)",
        boxShadow: "0 14px 28px rgba(72,52,20,0.18), inset 0 0 0 8px rgba(255,244,205,0.18)",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          display: "flex",
          border: `4px solid ${dark ? "#c7a66b" : "#765423"}`,
          background: "#f7f3ea",
          boxShadow: "inset 0 3px 6px rgba(31,35,32,0.18)",
        }}
      />
    </div>
  );
}

function Hexagram() {
  return (
    <div style={{ width: 190, display: "flex", flexDirection: "column", gap: 15 }}>
      {[0, 1, 2, 3, 4, 5].map((line) => (
        <div
          key={line}
          style={{
            width: "100%",
            height: 13,
            display: "flex",
            borderRadius: 8,
            background: line === 1 || line === 4
              ? "linear-gradient(90deg, #0f4c45 0 43%, transparent 43% 57%, #0f4c45 57% 100%)"
              : "#0f4c45",
            boxShadow: "0 4px 9px rgba(15,76,69,0.15)",
          }}
        />
      ))}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 76px 52px",
        overflow: "hidden",
        color: "#1f2320",
        background: "radial-gradient(circle at 72% 26%, #ffffff 0%, #f7f3ea 42%, #eee7d9 100%)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 470,
          height: 470,
          right: -115,
          top: -135,
          display: "flex",
          borderRadius: 999,
          border: "1px solid rgba(181,138,66,0.28)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", color: "#7b6849", fontSize: 22, letterSpacing: 5 }}>
          AWAI COMMONS · EKI-LAB
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            border: "1px solid rgba(120,105,75,0.3)",
            borderRadius: 999,
            color: "#0f4c45",
            background: "rgba(255,255,255,0.6)",
            fontSize: 20,
          }}
        >
          三枚のコインで起卦する
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 665, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: 8 }}>
            コイン易占い
          </div>
          <div style={{ display: "flex", marginTop: 22, color: "#6d6a61", fontSize: 31, letterSpacing: 3 }}>
            問いを立て、コインを投げ、卦を読む。
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 46 }}>
            <Coin />
            <Coin />
            <Coin dark />
          </div>
        </div>

        <div
          style={{
            width: 300,
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(120,105,75,0.24)",
            borderRadius: 34,
            background: "rgba(255,255,255,0.56)",
            boxShadow: "0 24px 60px rgba(62,47,22,0.09)",
          }}
        >
          <Hexagram />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 22,
          borderTop: "1px solid rgba(120,105,75,0.28)",
          color: "#6d6a61",
          fontSize: 22,
        }}
      >
        <span>本卦・変爻・之卦を静かに読む</span>
        <span>awaicommons.com/coin</span>
      </div>
    </div>,
    size,
  );
}
