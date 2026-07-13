import type { Metadata } from "next";
import CoinApp from "@/components/coin/CoinApp";

const title = "コイン易占い | eki-lab";
const description = "三枚のコインを六回投げて易の卦を立てるWebアプリ。手元のコイン入力と自動起卦に対応し、本卦・変爻・之卦、卦辞、現代語訳、キーワードを読めます。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://awaicommons.com/coin" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ja_JP",
    url: "https://awaicommons.com/coin",
    siteName: "eki-lab",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function CoinPage() {
  return <CoinApp />;
}
