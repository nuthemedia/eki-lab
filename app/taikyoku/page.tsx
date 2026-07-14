import type { Metadata } from "next";
import TaikyokuApp from "@/components/taikyoku/TaikyokuApp";

const title = "易有太極 — 1から64へ";
const description =
  "太極から両儀、四象、八卦、六十四卦へ。陰陽と爻が1→2→4→8→64へ展開する、易経の生成構造を触れて学ぶ3D体験。";
const url = "https://awaicommons.com/taikyoku";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  applicationName: "易有太極",
  keywords: ["易有太極", "太極", "陰陽", "四象", "八卦", "六十四卦", "易経"],
  category: "education",
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url,
    siteName: "AWAI Commons",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function TaikyokuPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "LearningResource"],
    name: "易有太極",
    description,
    url,
    inLanguage: "ja",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    educationalUse: "instruction",
    learningResourceType: "interactive 3D learning experience",
    teaches: ["太極から両儀・四象・八卦・六十四卦へ展開する易の生成構造"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TaikyokuApp />
    </>
  );
}
