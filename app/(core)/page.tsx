import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BookOpenText,
  Box,
  MapPin,
  Orbit,
  Route,
  Scale,
} from "lucide-react";
import { siteName, siteUrl } from "@/lib/seo";
import {
  getLatestNoteArticles,
  NOTE_BEGINNER_URL,
  NOTE_PROFILE_URL,
} from "@/lib/noteFeed";
import { HexagramWheel, type WheelHexagram } from "@/components/core/home/HexagramWheel";
import { HEXAGRAMS_BY_NUMBER, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";

const title = "AWAI Commons｜易を学び、変化を見る";
const description =
  "AWAI Commonsは、易の知恵を暮らしに生かすための学びと体験を公開しています。易有太極、HAKKE、易のことば、コイン易占い、易経・六十四卦辞典を通して、変化を見る力を育てます。";

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
    "易のことば",
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

export const revalidate = 300;

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

export default async function AwaiCommonsHomePage() {
  const noteArticles = await getLatestNoteArticles();

  return (
    <main className="ik-top ik-home ik-home-light awai-home">
      <header className="awai-brand">
        <h1 className="awai-brand-title">AWAI Commons</h1>
        <p className="awai-brand-ja">あわいコモンズ</p>
      </header>

      <section className="awai-hero">
        <h2>易の知恵を、暮らしに生かす</h2>
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
        <h2 id="products-title">易を学ぶ 五つの入口</h2>
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
            <span className="awai-product-cta">体験する</span>
          </Link>

          <Link
            href="/kotoba"
            className="ik-home-card awai-product-card awai-kotoba-card"
          >
            <span className="awai-product-visual" aria-hidden="true">
              <BookOpenText />
            </span>
            <span className="ik-home-card-body">
              <span className="ik-home-card-label">KOTOBA</span>
              <span id="kotoba-title" className="ik-home-card-title">
                易のことば
              </span>
              <span className="ik-home-card-desc">
                易経の五つの句を、動くビジュアルで学ぶ。
              </span>
            </span>
            <span className="awai-product-cta">体験する</span>
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
        <div className="awai-about-content">
          <h2 id="about-title">いま易を学ぶ理由</h2>
          <div className="ik-home-about-copy">
            <p>
              変化が速く、答えを急ぎがちな今。易は未来を決めるものではなく、立ち止まって状況を眺め、次の一歩を自分で選ぶための手がかりになります。
            </p>
          </div>
        </div>
        <a
          href={NOTE_BEGINNER_URL}
          className="awai-about-link"
          target="_blank"
          rel="noreferrer"
        >
          <span>はじめての方へ</span>
          <ArrowRight aria-hidden="true" />
        </a>
      </section>

      <section className="awai-reading" aria-labelledby="reading-title">
        <h2 id="reading-title">読みもの</h2>
        {noteArticles.length > 0 && (
          <ul className="awai-reading-list">
            {noteArticles.map((article) => (
              <li key={article.url}>
                <a href={article.url} target="_blank" rel="noreferrer">
                  <span>{article.title}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
        <a
          href={NOTE_PROFILE_URL}
          className="awai-reading-all"
          target="_blank"
          rel="noreferrer"
        >
          すべての記事を読む
        </a>
      </section>

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
