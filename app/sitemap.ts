import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/seo";

const coinLanguages = {
  ja: `${siteUrl}/coin`,
  en: `${siteUrl}/coin/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const hexagramPages: MetadataRoute.Sitemap = Array.from(
    { length: 64 },
    (_, index) => ({ url: `${siteUrl}/hexagrams/${index + 1}` }),
  );

  return [
    { url: siteUrl },
    { url: `${siteUrl}/taikyoku` },
    { url: `${siteUrl}/hakke` },
    {
      url: `${siteUrl}/coin`,
      alternates: { languages: coinLanguages },
    },
    {
      url: `${siteUrl}/coin/en`,
      alternates: { languages: coinLanguages },
    },
    { url: `${siteUrl}/hexagrams` },
    ...hexagramPages,
  ];
}
