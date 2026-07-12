import { ImageResponse } from "next/og";
import { OgBrand, OgFooter, OgFrame, ogContentType, ogSize } from "@/lib/og";
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

export const size = ogSize;
export const contentType = ogContentType;

/** 共有ランディング用の動的 OG。code からカードを再現する */
export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = decodeCardCode(decodeURIComponent(raw));

  return new ImageResponse(
    (
      <OgFrame background={CARD_INK} color={CARD_PAPER}>
        <OgBrand color={CARD_PAPER_DIM} label="易のかたち" labelColor={CARD_MUTED} />

        {code ? (
          (() => {
            const content = buildCardContent(code);
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 68 }}>
                <OgHexagramFigure
                  lines={content.lines}
                  barWidth={190}
                  barHeight={20}
                  gap={17}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    maxWidth: 820,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: 30,
                      color: CARD_PAPER_DIM,
                      lineHeight: 1.4,
                    }}
                  >
                    {`「${content.question}」`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 24,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontSize: 84,
                        fontWeight: 700,
                        letterSpacing: 10,
                      }}
                    >
                      {content.hexName}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: 28,
                        color: CARD_PAPER_DIM,
                        letterSpacing: 6,
                      }}
                    >
                      {content.hexReading}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 42,
                      fontWeight: 700,
                      color: CARD_BAMBOO,
                      letterSpacing: 4,
                    }}
                  >
                    {content.keyword}
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: 8 }}>
            {CARD_TAGLINE}
          </div>
        )}

        <OgFooter
          borderColor="rgba(233, 226, 208, 0.2)"
          color={CARD_MUTED}
          left={CARD_TAGLINE}
          right="awaicommons.com/card"
        />
      </OgFrame>
    ),
    size,
  );
}
