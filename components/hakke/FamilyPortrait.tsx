import Image from "next/image";
import { HAKKE_TRIGRAMS } from "@/data/hakke/trigrams";

const FAMILY_IMAGES: Record<number, string> = {
  0: "/images/hakke/family/father.webp",
  1: "/images/hakke/family/youngest-daughter.webp",
  2: "/images/hakke/family/middle-daughter.webp",
  3: "/images/hakke/family/eldest-son.webp",
  4: "/images/hakke/family/eldest-daughter.webp",
  5: "/images/hakke/family/middle-son.webp",
  6: "/images/hakke/family/youngest-son.webp",
  7: "/images/hakke/family/mother.webp",
};

export default function FamilyPortrait({ trigramId, compact = false }: { trigramId: number; compact?: boolean }) {
  const trigram = HAKKE_TRIGRAMS[trigramId];

  return (
    <figure className={`hk-family-portrait${compact ? " is-compact" : ""}`}>
      <Image
        src={FAMILY_IMAGES[trigramId]}
        alt={`${trigram.name}の家族象・${trigram.family}`}
        width={1254}
        height={1254}
        sizes={compact ? "72px" : "(max-width: 480px) 120px, 150px"}
      />
      {!compact ? <figcaption>{trigram.family}</figcaption> : null}
    </figure>
  );
}
