import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import {
  CARD_TAGLINE,
  buildCardContent,
  decodeCardCode,
} from "@/lib/ichingCard";
import {
  CARD_BAMBOO,
  CARD_INK,
  CARD_MUTED,
  CARD_PAPER,
  CARD_PAPER_DIM,
  OgHexagramFigure,
} from "@/lib/ichingCardOg";

/**
 * 卦カードの 9:16 縦画像(1080×1920)。Instagram ストーリーズ / TikTok 向けに
 * 保存・Web Share で使う。code に対して決定的なので長期キャッシュ可。
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("code") ?? "";
  const code = decodeCardCode(raw);
  if (!code) {
    return new Response("invalid code", { status: 400 });
  }
  const content = buildCardContent(code);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CARD_INK,
          color: CARD_PAPER,
          padding: "110px 96px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: CARD_MUTED,
            fontSize: 30,
            letterSpacing: 6,
          }}
        >
          <div style={{ display: "flex" }}>易のかたち</div>
          <div style={{ display: "flex" }}>eki-lab</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: CARD_PAPER_DIM,
              fontSize: 30,
              letterSpacing: 8,
            }}
          >
            問い
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            {`「${content.question}」`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
          }}
        >
          <OgHexagramFigure
            lines={content.lines}
            barWidth={300}
            barHeight={32}
            gap={26}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 104,
                fontWeight: 700,
                letterSpacing: 16,
              }}
            >
              {content.hexName}
            </div>
            <div
              style={{
                display: "flex",
                color: CARD_PAPER_DIM,
                fontSize: 34,
                letterSpacing: 10,
              }}
            >
              {content.hexReading}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              color: CARD_BAMBOO,
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: 6,
            }}
          >
            {content.keyword}
          </div>
          <div
            style={{
              display: "flex",
              color: CARD_PAPER_DIM,
              fontSize: 38,
              lineHeight: 1.7,
            }}
          >
            {content.message}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `2px solid rgba(233, 226, 208, 0.2)`,
            paddingTop: 34,
            color: CARD_MUTED,
            fontSize: 30,
          }}
        >
          <div style={{ display: "flex" }}>{CARD_TAGLINE}</div>
          <div style={{ display: "flex" }}>awaicommons.com/card</div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
