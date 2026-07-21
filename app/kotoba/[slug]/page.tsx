import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KotobaExperience from "@/components/kotoba/KotobaExperience";
import {
  getAdjacentPassages,
  getKotobaPassage,
  KOTOBA_PASSAGES,
} from "@/data/kotoba/passages";
import {
  getKotobaPassageDescription,
  getKotobaPassageMetadata,
} from "@/data/kotoba/seo";

export function generateStaticParams() {
  return KOTOBA_PASSAGES.map((passage) => ({ slug: passage.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const passage = getKotobaPassage(slug);
  if (!passage) return {};
  return getKotobaPassageMetadata(passage);
}

export default async function KotobaPassagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const passage = getKotobaPassage(slug);
  if (!passage) notFound();
  const { previous, next } = getAdjacentPassages(passage.slug);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: passage.original,
    description: getKotobaPassageDescription(passage),
    inLanguage: "ja",
    isPartOf: { "@type": "WebApplication", name: "易のことば" },
    teaches: passage.commentary,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KotobaExperience passage={passage} previous={previous} next={next} />
    </>
  );
}
