import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/seo";
import { IchingFlow } from "@/features/reading/IchingFlow";

const title = "問いを立てて占う | 易のかたち";
const description =
  "悩みを書くと、易が答えられる「問い」に整い、筮竹や骰子で卦が立ち、今どう向き合うかが見えてくる。静かな儀式としての易のインターフェース。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/ask",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/ask`,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function IchingAskPage() {
  return <IchingFlow />;
}
