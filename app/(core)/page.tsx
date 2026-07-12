import type { Metadata } from "next";
import Link from "next/link";
import { siteName, siteUrl } from "@/lib/seo";
import { HexagramWheel, type WheelHexagram } from "@/components/core/home/HexagramWheel";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";

const title = "AWAI Commons｜易を学び、変化を見る";
const description =
  "AWAI Commonsは、易や古典を現代の体験としてひらく活動です。八卦をつくって覚えるHakkeを公開しています。";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: [
    "AWAI Commons",
    "あわいコモンズ",
    "易",
    "易経",
    "I Ching",
    "八卦",
    "Hakke",
    "古典",
  ],
  authors: [{ name: "AWAI Commons", url: siteUrl }],
  creator: "AWAI Commons",
  publisher: "AWAI Commons",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/brand/awai-commons-note-header.png",
        width: 1733,
        height: 908,
        alt: "AWAI Commons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@AWAIcommons",
    images: ["/brand/awai-commons-note-header.png"],
  },
};

function buildWheelHexagrams(): WheelHexagram[] {
  return Array.from({ length: 64 }, (_, i) => {
    const number = i + 1;
    return {
      number,
      name: HEXAGRAMS_BY_NUMBER[number].name,
      reading: HEXAGRAMS_BY_NUMBER[number].reading,
      essence: HEXAGRAM_DICTIONARY[number].essence,
      lines: linesOfHexagram(number)!,
    };
  });
}

export default function AwaiCommonsHomePage() {
  return (
    <main className="ik-top ik-home ik-home-light awai-home">
      <header className="awai-brand">
        <h1 className="awai-brand-title">AWAI Commons</h1>
        <p className="awai-brand-ja">あわいコモンズ</p>
      </header>

      <section className="awai-hero">
        <h2>古典を、触れるかたちに。</h2>
        <p className="awai-hero-tagline">易を学び、変化を見る。</p>
        <span className="awai-hero-en">Learn the I Ching. Read change.</span>
        <p className="awai-hero-copy">
          古代の知恵を、読むだけでなく、つくり、眺め、問い直すための体験へ。
        </p>
      </section>

      <HexagramWheel hexagrams={buildWheelHexagrams()} showDetailLink={false} />

      <section aria-labelledby="hakke-title">
        <Link href="/hakke" className="ik-home-card awai-hakke-card">
          <span className="ik-home-card-body">
            <span className="ik-home-card-label">HAKKE</span>
            <span id="hakke-title" className="ik-home-card-title">
              八卦をつくって覚える
            </span>
            <span className="ik-home-card-desc">
              陰と陽を下から三本。八つの形を、自分の手で覚える。
            </span>
            <span className="awai-hakke-cta">Hakkeをはじめる →</span>
          </span>
        </Link>
      </section>

      <section className="awai-about" aria-labelledby="about-title">
        <h2 id="about-title">易を学び、変化を見る。</h2>
        <div className="ik-home-about-copy">
          <p>易は、未来を決めるためだけのものではない。</p>
          <p>
            変化の兆しを見つめ、いまの自分の立ち位置を考えるための知恵でもある。
          </p>
          <p>AWAI Commonsは、易や古典を現代の体験としてひらいていきます。</p>
        </div>
      </section>

      <nav className="awai-note" aria-label="外部リンク">
        <a
          href="https://note.com/fit_violet9730/n/n8f86b3a3c6e4"
          className="awai-note-link"
          target="_blank"
          rel="noreferrer"
        >
          AWAI CommonsのNote →
        </a>
      </nav>

      <footer className="awai-footer">
        <strong>AWAI Commons</strong>
        <span>あわいコモンズ</span>
        <p>易を学び、変化を見る。</p>
        <a
          href="https://x.com/AWAIcommons"
          className="awai-x-link"
          target="_blank"
          rel="noreferrer"
          aria-label="AWAI CommonsのX"
        >
          <span aria-hidden="true">X</span>
        </a>
        <small>© 2026 AWAI Commons</small>
      </footer>
    </main>
  );
}
