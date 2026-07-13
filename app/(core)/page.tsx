import type { Metadata } from "next";
import Link from "next/link";
import { siteName, siteUrl } from "@/lib/seo";
import { HexagramWheel, type WheelHexagram } from "@/components/core/home/HexagramWheel";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";

const title = "AWAI Commons｜易を学び、変化を見る";
const description =
  "AWAI Commonsは、八卦をつくって学ぶHAKKEをはじめ、易を手を動かして体験するアプリを公開しています。";

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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@AWAIcommons",
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
      </section>

      <HexagramWheel hexagrams={buildWheelHexagrams()} showDetailLink={false} />

      <section className="ik-home-cards" aria-label="プロダクト">
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

        <Link href="/coin" className="ik-home-card awai-coin-card">
          <span className="ik-home-card-body">
            <span className="ik-home-card-label">COIN I CHING</span>
            <span id="coin-title" className="ik-home-card-title">
              コイン易占い
            </span>
            <span className="ik-home-card-desc">
              問いを立て、三枚のコインを六回投げて、卦を読む。
            </span>
            <span className="awai-coin-cta">占いをはじめる →</span>
          </span>
        </Link>
      </section>

      <section className="awai-about" aria-labelledby="about-title">
        <h2 id="about-title">易を学び、変化を見る。</h2>
        <div className="ik-home-about-copy">
          <p>易は未来を当てるだけのものではありません。</p>
          <p>
            変化の兆しを見つめ、いまの自分の立ち位置を考えるための知恵でもあります。
          </p>
          <p>
            AWAI Commonsはともに易を学び、暮らしに役立てていくことを目指します。
          </p>
        </div>
      </section>

      <nav className="awai-note" aria-label="外部リンク">
        <a
          href="https://note.com/awaicommons"
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
