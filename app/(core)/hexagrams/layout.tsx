import Link from "next/link";
import { HEXAGRAMS_BY_NUMBER } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";
import HexagramHeader from "@/components/hexagrams/HexagramHeader";
import "./hexagrams.css";

export default function HexagramsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchItems = Array.from({ length: 64 }, (_, index) => {
    const number = index + 1;
    const hexagram = HEXAGRAMS_BY_NUMBER[number];
    return {
      number,
      name: hexagram.name,
      reading: hexagram.reading,
      keywords: HEXAGRAM_DICTIONARY[number].keywords,
    };
  });

  return (
    <div className="hx-root">
      <div className="hx-shell">
        <HexagramHeader items={searchItems} />
        {children}
        <footer className="hx-footer">
          <Link href="/">© 2026 AWAI Commons</Link>
        </footer>
      </div>
    </div>
  );
}
