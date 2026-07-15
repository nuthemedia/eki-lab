import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const coinLanguages = {
  ja: `${siteUrl}/coin`,
  en: `${siteUrl}/coin/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
