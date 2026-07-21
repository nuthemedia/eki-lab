import type { Metadata } from "next";
import KotobaGallery from "@/components/kotoba/KotobaGallery";
import { KOTOBA_SEARCH_DESCRIPTION } from "@/data/kotoba/seo";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "易のことば",
  description: KOTOBA_SEARCH_DESCRIPTION,
  alternates: { canonical: "/kotoba" },
  applicationName: "易のことば",
  keywords: ["易のことば", "易経", "易", "I Ching", "陰陽", "古典"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "易のことば",
    description: KOTOBA_SEARCH_DESCRIPTION,
    url: "/kotoba",
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "易のことば",
    description: KOTOBA_SEARCH_DESCRIPTION,
    creator: "@AWAIcommons",
  },
};

export default function KotobaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "LearningResource"],
    name: "易のことば",
    description: KOTOBA_SEARCH_DESCRIPTION,
    url: new URL("/kotoba", siteUrl).toString(),
    inLanguage: "ja",
    applicationCategory: "EducationalApplication",
    isAccessibleForFree: true,
    educationalUse: "instruction",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KotobaGallery />
    </>
  );
}
