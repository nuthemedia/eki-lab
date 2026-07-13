import type { Metadata } from "next";
import CoinApp from "@/components/coin/CoinApp";

const title = "コイン易占い｜AWAI Commons";
const description = "三枚のコインを六回投げて易の卦を立てるWebアプリ。手元のコイン入力と自動起卦に対応し、本卦・変爻・之卦、卦辞、現代語訳、キーワードを読めます。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/coin" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ja_JP",
    url: "/coin",
    siteName: "AWAI Commons",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function CoinPage() {
  return <CoinApp />;
}
