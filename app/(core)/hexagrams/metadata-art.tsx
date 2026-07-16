import { ImageResponse } from "next/og";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import {
  HEXAGRAM_INDEX_DESCRIPTION,
  HEXAGRAM_INDEX_TITLE,
} from "@/domain/iching/hexagramSeo";

export const HEXAGRAM_SOCIAL_SIZE = { width: 1200, height: 630 };
export const HEXAGRAM_SOCIAL_CONTENT_TYPE = "image/png";

function HexagramFigure({
  lines,
  width = 178,
  height = 13,
  gap = 13,
}: {
  lines: ("yin" | "yang")[];
  width?: number;
  height?: number;
  gap?: number;
}) {
  return (
    <div
      style={{
        width,
        display: "flex",
        flexDirection: "column-reverse",
        gap,
      }}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            width: "100%",
            height,
            display: "flex",
            justifyContent: line === "yin" ? "space-between" : "flex-start",
            borderRadius: 999,
            ...(line === "yang" ? { background: "#313542" } : {}),
          }}
        >
          {line === "yin" ? (
            <>
              <span
                style={{
                  width: "42%",
                  height: "100%",
                  display: "flex",
                  borderRadius: 999,
                  background: "#313542",
                }}
              />
              <span
                style={{
                  width: "42%",
                  height: "100%",
                  display: "flex",
                  borderRadius: 999,
                  background: "#313542",
                }}
              />
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "58px 68px 50px",
        overflow: "hidden",
        color: "#2b2e38",
        background:
          "radial-gradient(circle at 82% 22%, rgba(204,211,255,0.72) 0%, rgba(245,245,240,0) 34%), #f5f5f0",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 440,
          height: 440,
          right: -150,
          top: -178,
          display: "flex",
          border: "1px solid rgba(85,96,216,0.18)",
          borderRadius: 999,
        }}
      />
      {children}
    </div>
  );
}

function Brand() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#626775",
        fontSize: 21,
        letterSpacing: 4,
      }}
    >
      <span>AWAI COMMONS</span>
      <span>易経・六十四卦辞典</span>
    </div>
  );
}

export function renderHexagramIndexSocialImage() {
  const featured = [1, 2, 11, 12, 29, 30, 63, 64];
  return new ImageResponse(
    <Frame>
      <Brand />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 690, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: 5 }}>
            {HEXAGRAM_INDEX_TITLE}
          </div>
          <div style={{ display: "flex", color: "#626775", fontSize: 27, lineHeight: 1.55 }}>
            {HEXAGRAM_INDEX_DESCRIPTION}
          </div>
        </div>
        <div
          style={{
            width: 340,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "flex-end",
          }}
        >
          {featured.map((number) => (
            <div
              key={number}
              style={{
                width: 78,
                height: 104,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(98,103,117,0.2)",
                borderRadius: 18,
                background: "rgba(255,255,255,0.76)",
              }}
            >
              <HexagramFigure
                lines={linesOfHexagram(number)!}
                width={45}
                height={4}
                gap={5}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 20,
          borderTop: "1px solid rgba(98,103,117,0.24)",
          color: "#626775",
          fontSize: 21,
        }}
      >
        <span>卦辞・爻辞と現代語</span>
        <span>awaicommons.com/hexagrams</span>
      </div>
    </Frame>,
    HEXAGRAM_SOCIAL_SIZE,
  );
}

export function renderHexagramDetailSocialImage(number: number) {
  const hexagram = HEXAGRAMS_BY_NUMBER[number];
  const entry = HEXAGRAM_DICTIONARY[number];
  return new ImageResponse(
    <Frame>
      <Brand />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 700, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#5560d8", fontSize: 26, letterSpacing: 5 }}>
            第{number}卦
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: 9,
            }}
          >
            {hexagram.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              color: "#626775",
              fontSize: 29,
              letterSpacing: 5,
            }}
          >
            {hexagram.reading}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              color: "#444957",
              fontSize: 27,
              lineHeight: 1.55,
            }}
          >
            {entry.essence}
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(98,103,117,0.2)",
            borderRadius: 38,
            background: "rgba(255,255,255,0.78)",
            boxShadow: "0 22px 54px rgba(43,46,56,0.08)",
          }}
        >
          <HexagramFigure lines={linesOfHexagram(number)!} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 20,
          borderTop: "1px solid rgba(98,103,117,0.24)",
          color: "#626775",
          fontSize: 21,
        }}
      >
        <span>{entry.keywords.join("・")}</span>
        <span>awaicommons.com/hexagrams/{number}</span>
      </div>
    </Frame>,
    HEXAGRAM_SOCIAL_SIZE,
  );
}
