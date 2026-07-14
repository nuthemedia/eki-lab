import { ImageResponse } from "next/og";

export const SOCIAL_IMAGE_ALT = "易有太極 — ひとつから、六十四の変化へ。";
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

function Taijitu({ size }: { size: number }) {
  const dot = Math.max(4, Math.round(size * 0.095));
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        overflow: "hidden",
        border: `${Math.max(1, Math.round(size * 0.012))}px solid #d6bd82`,
        borderRadius: 999,
        background: "linear-gradient(90deg, #d6bd82 0%, #d6bd82 50%, #111210 50%, #111210 100%)",
        boxShadow: "0 0 56px rgba(214,189,130,0.22), inset 0 0 42px rgba(214,189,130,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: size * 0.25,
          width: size * 0.5,
          height: size * 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: "#d6bd82",
        }}
      >
        <div style={{ width: dot, height: dot, display: "flex", borderRadius: 999, background: "#111210" }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 0.5,
          left: size * 0.25,
          width: size * 0.5,
          height: size * 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: "#111210",
        }}
      >
        <div style={{ width: dot, height: dot, display: "flex", borderRadius: 999, background: "#d6bd82" }} />
      </div>
    </div>
  );
}

export function renderTaikyokuSocialImage() {
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
        background: "radial-gradient(circle at 76% 50%, #282318 0%, #0b0c0c 35%, #070808 68%)",
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
          width: 410,
          height: 410,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(214,189,130,0.26)",
          borderRadius: 999,
          boxShadow: "0 0 70px rgba(214,189,130,0.12)",
        }}
      >
        <Taijitu size={330} />
      </div>
    </div>,
    SOCIAL_IMAGE_SIZE,
  );
}

export function renderTaijituIcon(size: number) {
  const markSize = Math.round(size * 0.76);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070808",
      }}
    >
      <Taijitu size={markSize} />
    </div>,
    { width: size, height: size },
  );
}
