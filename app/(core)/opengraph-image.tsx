import { ImageResponse } from "next/og";
import { OgBrand, OgFooter, OgFrame, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

// 地天泰の六爻(下から: 陽×3、陰×3)を上から描く
const ROWS = [false, false, false, true, true, true];

export default function Image() {
  return new ImageResponse(
    (
      <OgFrame background="#17161a" color="#e9e2d0">
        <OgBrand color="#b9b2a1" />

        <div style={{ display: "flex", alignItems: "center", gap: 72 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {ROWS.map((yang, i) =>
              yang ? (
                <div
                  key={i}
                  style={{
                    width: 200,
                    height: 22,
                    borderRadius: 6,
                    background: "#c9a86d",
                  }}
                />
              ) : (
                <div key={i} style={{ display: "flex", gap: 32 }}>
                  <div
                    style={{
                      width: 84,
                      height: 22,
                      borderRadius: 6,
                      background: "#c9a86d",
                    }}
                  />
                  <div
                    style={{
                      width: 84,
                      height: 22,
                      borderRadius: 6,
                      background: "#c9a86d",
                    }}
                  />
                </div>
              ),
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: 14 }}>
              易のかたち
            </div>
            <div style={{ display: "flex", fontSize: 36, color: "#b9b2a1" }}>
              筮竹と算木で、問いが卦へと立ち上がる。
            </div>
          </div>
        </div>

        <OgFooter
          borderColor="rgba(233, 226, 208, 0.2)"
          color="#7d786d"
          left="易占いの儀式を、静かな視覚体験に"
          right="eki-lab.vercel.app"
        />
      </OgFrame>
    ),
    size,
  );
}
