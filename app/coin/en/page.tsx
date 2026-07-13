import type { Metadata } from "next";
import CoinApp from "@/components/coin/CoinApp";

const title = "I Ching Coin Reading | eki-lab";
const description = "Ask a question, toss three coins six times, and explore the Primary Hexagram, Changing Lines, and Relating Hexagram in clear contemporary English.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "https://awaicommons.com/coin/en",
    languages: { ja: "https://awaicommons.com/coin", en: "https://awaicommons.com/coin/en" },
  },
  openGraph: {
    title, description, type: "website", locale: "en_GB",
    alternateLocale: ["ja_JP"], url: "https://awaicommons.com/coin/en", siteName: "eki-lab",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default async function EnglishCoinPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string | string[] }>;
}) {
  const params = await searchParams;
  const question = Array.isArray(params.question) ? params.question[0] : params.question;
  return <CoinApp locale="en" initialQuestion={question?.slice(0, 200) ?? ""} />;
}
