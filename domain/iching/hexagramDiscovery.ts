import { HEXAGRAMS_BY_NUMBER } from "./hexagrams";

export type HexagramSearchItem = {
  number: number;
  name: string;
  reading: string;
  keywords: string[];
};

export function normalizeHexagramQuery(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ja").replace(/\s+/g, "");
}

export function searchHexagrams(
  items: readonly HexagramSearchItem[],
  query: string,
  limit = 8,
): HexagramSearchItem[] {
  const term = normalizeHexagramQuery(query);
  if (!term) return [];

  if (/^\d+$/.test(term)) {
    const number = Number.parseInt(term, 10);
    return items.filter((item) => item.number === number).slice(0, limit);
  }

  return items
    .filter((item) => {
      const fields = [item.name, item.reading, ...item.keywords];
      return fields.some((field) => normalizeHexagramQuery(field).includes(term));
    })
    .sort((a, b) => {
      const aExact = String(a.number) === term || normalizeHexagramQuery(a.name) === term;
      const bExact = String(b.number) === term || normalizeHexagramQuery(b.name) === term;
      return Number(bExact) - Number(aExact) || a.number - b.number;
    })
    .slice(0, limit);
}

export function hexagramFromTrigrams(upper: number, lower: number) {
  return Object.values(HEXAGRAMS_BY_NUMBER).find(
    (hexagram) => hexagram.upper === upper && hexagram.lower === lower,
  );
}
