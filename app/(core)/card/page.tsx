import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/seo";
import { IchingCardApp } from "@/features/card/IchingCardApp";

const title = "いまの自分に、卦を一枚 | 易のかたち";
const description =
  "問いをひとつ選ぶと、あなたの卦カードが一枚立ち上がる。Instagram・X・TikTokで共有できる、軽やかな易占い。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/card",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/card`,
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

export default function IchingCardPage() {
  return <IchingCardApp />;
}
