import type { Metadata } from "next";
import HakkeApp from "@/components/hakke/HakkeApp";

const title = "八卦をつくる | HAKKE";
const description =
  "陰と陽を選んで、下から三本。自分の手で八卦をつくって、形・漢字・自然のイメージをからだで覚える。";
const url = "https://eki-lab.vercel.app/hakke";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  applicationName: "HAKKE",
  keywords: ["八卦", "易経", "易", "陰陽", "I Ching", "学習アプリ"],
  category: "education",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: "HAKKE | eki-lab",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function HakkePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "LearningResource"],
    name: "HAKKE",
    alternateName: "八卦をつくる",
    description,
    url,
    inLanguage: "ja",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    educationalUse: "practice",
    learningResourceType: "interactive learning application",
    teaches: ["八卦の形", "八卦の読み", "八卦と自然・家族・方角の対応"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HakkeApp />
    </>
  );
}
