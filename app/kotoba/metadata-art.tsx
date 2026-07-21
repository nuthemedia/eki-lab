import { ImageResponse } from "next/og";

export const KOTOBA_SOCIAL_IMAGE_ALT =
  "易のことば — 変化の哲学を、見る。触れる。";
export const KOTOBA_SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

const accents = ["#a8d8ff", "#e7af70", "#70d8c7", "#e98267", "#b693ff"];
const nodes = [
  { left: 90, top: 328, size: 18 },
  { left: 286, top: 268, size: 12 },
  { left: 505, top: 338, size: 22 },
  { left: 738, top: 244, size: 14 },
  { left: 1012, top: 316, size: 20 },
] as const;

export function renderKotobaSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "58px 70px 50px",
        color: "#f3f5f2",
        background:
          "radial-gradient(circle at 16% 72%, rgba(168,216,255,.13), transparent 32%), radial-gradient(circle at 84% 24%, rgba(182,147,255,.14), transparent 34%), #06111b",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 18,
          display: "flex",
          border: "1px solid rgba(204,218,218,.22)",
          borderRadius: 26,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 55,
          top: 366,
          width: 1090,
          height: 1,
          display: "flex",
          background:
            "linear-gradient(90deg, transparent, rgba(168,216,255,.5), rgba(112,216,199,.55), rgba(233,130,103,.45), rgba(182,147,255,.55), transparent)",
          transform: "rotate(-3deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 310,
          width: 1090,
          height: 90,
          display: "flex",
          borderTop: "2px solid rgba(168,216,255,.3)",
          borderBottom: "2px solid rgba(231,175,112,.24)",
          borderRadius: "50%",
          transform: "rotate(3deg)",
        }}
      />

      {nodes.map((node, index) => (
        <div
          key={node.left}
          style={{
            position: "absolute",
            left: node.left,
            top: node.top,
            width: node.size,
            height: node.size,
            display: "flex",
            borderRadius: 999,
            border: `2px solid ${accents[index]}`,
            background: "#06111b",
            boxShadow: `0 0 22px ${accents[index]}`,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#aebbc1",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 20,
          letterSpacing: 5,
        }}
      >
        <span>AWAI Commons</span>
        <div style={{ display: "flex", gap: 9 }}>
          {accents.map((accent) => (
            <span
              key={accent}
              style={{
                width: 7,
                height: 7,
                display: "flex",
                borderRadius: 999,
                background: accent,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 94,
            fontWeight: 500,
            letterSpacing: 16,
            lineHeight: 1.1,
          }}
        >
          易のことば
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            color: "#c9d2d3",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 29,
            letterSpacing: 6,
          }}
        >
          変化の哲学を、見る。触れる。
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          paddingTop: 19,
          borderTop: "1px solid rgba(204,218,218,.2)",
        }}
      >
        {accents.map((accent, index) => (
          <span
            key={accent}
            style={{
              width: index === 2 ? 260 : 184,
              height: 3,
              display: "flex",
              borderRadius: 999,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
        ))}
      </div>
    </div>,
    KOTOBA_SOCIAL_IMAGE_SIZE,
  );
}
