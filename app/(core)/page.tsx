import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Box,
  MapPin,
  Orbit,
  Route,
  Scale,
} from "lucide-react";
import { siteName, siteUrl } from "@/lib/seo";
import { HexagramWheel, type WheelHexagram } from "@/components/core/home/HexagramWheel";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";

const title = "AWAI Commons｜易を学び、変化を見る";
const description =
  "AWAI Commonsは、八卦をつくって学ぶHAKKEや易経・六十四卦辞典など、易を手を動かして体験するアプリを公開しています。";

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
    "六十四卦",
    "易経・六十四卦辞典",
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

      <section className="awai-perspectives" aria-labelledby="perspectives-title">
        <h2 id="perspectives-title">易から見えてくるもの</h2>
        <div className="awai-perspectives-panel">
          <div className="awai-perspectives-grid">
            <div className="awai-perspective">
              <Scale aria-hidden="true" />
              <span>偏りを見る</span>
            </div>
            <div className="awai-perspective">
              <MapPin aria-hidden="true" />
              <span>現在地を知る</span>
            </div>
            <div className="awai-perspective">
              <Route aria-hidden="true" />
              <span>変化の向きを読む</span>
            </div>
          </div>
          <p>仕事・人間関係・決断・休むことに。</p>
        </div>
      </section>

      <section className="awai-products" aria-labelledby="products-title">
        <h2 id="products-title">易を学ぶ 四つの入口</h2>
        <div className="awai-learning-flow" aria-label="易を学ぶ流れ">
          <span>学ぶ</span>
          <ArrowRight aria-hidden="true" />
          <span>つくる</span>
          <ArrowRight aria-hidden="true" />
          <span>占う</span>
          <ArrowRight aria-hidden="true" />
          <span>読む</span>
        </div>

        <div className="ik-home-cards" aria-label="プロダクト">
          <Link
            href="/taikyoku"
            className="ik-home-card awai-product-card awai-taikyoku-card"
          >
            <span className="awai-product-visual" aria-hidden="true">
              <Orbit />
            </span>
            <span className="ik-home-card-body">
              <span className="ik-home-card-label">TAIKYOKU</span>
              <span id="taikyoku-title" className="ik-home-card-title">
                易有太極
              </span>
              <span className="ik-home-card-desc">
                1から64へ、易の生成をたどる。
              </span>
            </span>
            <span className="awai-product-cta">
              詳しく見る
            </span>
          </Link>

          <Link
            href="/hakke"
            className="ik-home-card awai-product-card awai-hakke-card"
          >
            <span className="awai-product-visual" aria-hidden="true">
              <Box />
            </span>
            <span className="ik-home-card-body">
              <span id="hakke-title" className="ik-home-card-title">
                HAKKE
              </span>
              <span className="ik-home-card-desc">
                陰と陽から、八卦をつくって学ぶ。
              </span>
            </span>
            <span className="awai-product-cta">
              使ってみる
            </span>
          </Link>

          <Link
            href="/coin"
            className="ik-home-card awai-product-card awai-coin-card"
          >
            <span className="awai-product-visual" aria-hidden="true">
              <Image
                src="/images/coin/ancient-coin-heads.png"
                alt=""
                width={48}
                height={48}
              />
            </span>
            <span className="ik-home-card-body">
              <span className="ik-home-card-label">COIN I CHING</span>
              <span id="coin-title" className="ik-home-card-title">
                コイン易占い
              </span>
              <span className="ik-home-card-desc">
                三枚のコインで、問いに向き合う。
              </span>
            </span>
            <span className="awai-product-cta">
              占ってみる
            </span>
          </Link>

          <Link
            href="/hexagrams"
            className="ik-home-card awai-product-card awai-hexagrams-card"
          >
            <span className="awai-product-visual" aria-hidden="true">
              <BookOpen />
            </span>
            <span className="ik-home-card-body">
              <span className="ik-home-card-label">HEXAGRAM DICTIONARY</span>
              <span id="hexagrams-title" className="ik-home-card-title">
                易経・六十四卦辞典
              </span>
              <span className="ik-home-card-desc">
                六十四卦の言葉とつながりを読む。
              </span>
            </span>
            <span className="awai-product-cta">
              調べる
            </span>
          </Link>
        </div>
      </section>

      <section className="awai-about" aria-labelledby="about-title">
        <h2 id="about-title">なぜ今、易を学ぶのか。</h2>
        <div className="ik-home-about-copy">
          <p>
            変化の速い時代だからこそ、物事の流れを読み、自分の軸で選び取る力が求められます。
          </p>
          <p>易は、古くて新しい「生きる知恵」。</p>
          <p>あなたの毎日に、静かな指針をもたらします。</p>
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
