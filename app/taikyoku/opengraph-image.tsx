import { ImageResponse } from "next/og";

export const alt = "易有太極 — ひとつから、六十四の変化へ。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "64px 76px",
        color: "#f0e9da",
        background: "radial-gradient(circle at 73% 50%, #262219 0%, #0b0c0c 36%, #070808 68%)",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 82, letterSpacing: 14 }}>易有太極</div>
        <div style={{ display: "flex", color: "#d6bd82", fontSize: 30, letterSpacing: 5 }}>
          ひとつから、六十四の変化へ。
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
          {[1, 2, 4, 8, 64].map((number, index) => (
            <div key={number} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ display: "flex", color: index === 4 ? "#d6bd82" : "#817866", fontSize: 28 }}>
                {number}
              </span>
              {index < 4 ? <i style={{ width: 34, height: 1, background: "#5e5542" }} /> : null}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          width: 390,
          height: 390,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #d6bd82",
          borderRadius: 999,
          boxShadow: "0 0 56px rgba(214,189,130,0.18), inset 0 0 64px rgba(214,189,130,0.08)",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            display: "flex",
            borderRadius: 999,
            background: "#f0d99f",
            boxShadow: "0 0 24px #d6bd82",
          }}
        />
      </div>
    </div>,
    size,
  );
}
