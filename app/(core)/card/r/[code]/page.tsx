import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteName, siteUrl } from "@/lib/seo";
import {
  CARD_TAGLINE,
  buildCardContent,
  decodeCardCode,
} from "@/lib/ichingCard";
import { HexagramCard } from "@/features/card/HexagramCard";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code: raw } = await params;
  const code = decodeCardCode(decodeURIComponent(raw));
  if (!code) {
    return { title: CARD_TAGLINE };
  }
  const content = buildCardContent(code);
  const title = `「${content.question}」— ${content.hexName} | ${CARD_TAGLINE}`;
  const description = `${content.keyword} — ${content.message}`;
  const url = `${siteUrl}/card/r/${content.code}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/card/r/${content.code}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** 共有ランディング。code からカードを再現して、入口と本編へ誘導する */
export default async function CardSharePage({ params }: Props) {
  const { code: raw } = await params;
  const code = decodeCardCode(decodeURIComponent(raw));
  if (!code) notFound();
  const content = buildCardContent(code);

  return (
    <div className="ik-flow">
      <div className="ik-flow-head">
        <span className="ik-scene-title">{CARD_TAGLINE}</span>
      </div>

      <div className="ik-flow-body">
        <div className="ik-flow-col">
          <HexagramCard content={content} />
          <div className="ik-card-cta">
            <Link className="ik-btn ik-btn--primary" href="/card">
              自分も一枚引く
            </Link>
            <Link className="ik-link-quiet" href="/ask">
              悩みから、じっくり占う — 易のかたち 本編へ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
