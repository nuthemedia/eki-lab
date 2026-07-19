import { XMLParser } from "fast-xml-parser";

export type NoteArticle = {
  title: string;
  url: string;
};

export const NOTE_PROFILE_URL = "https://note.com/awaicommons";
export const NOTE_RSS_URL = `${NOTE_PROFILE_URL}/rss`;
export const NOTE_BEGINNER_URL = `${NOTE_PROFILE_URL}/n/n3fa16174d563`;

type NoteRssItem = {
  title?: unknown;
  link?: unknown;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

function itemsFromFeed(xml: string): NoteRssItem[] {
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: NoteRssItem | NoteRssItem[] } };
  };
  const items = parsed.rss?.channel?.item;

  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeArticle(item: NoteRssItem): NoteArticle | null {
  if (typeof item.title !== "string" || typeof item.link !== "string") {
    return null;
  }

  const title = item.title.trim();
  if (!title) return null;

  try {
    const url = new URL(item.link);
    if (url.protocol !== "https:" || url.hostname !== "note.com") return null;
    if (!url.pathname.startsWith("/awaicommons/n/")) return null;

    return {
      title,
      url: `${url.origin}${url.pathname}`,
    };
  } catch {
    return null;
  }
}

export function parseNoteRss(xml: string, limit = 2): NoteArticle[] {
  const seen = new Set<string>();
  const articles: NoteArticle[] = [];

  for (const item of itemsFromFeed(xml)) {
    const article = normalizeArticle(item);
    if (!article || article.url === NOTE_BEGINNER_URL || seen.has(article.url)) {
      continue;
    }

    seen.add(article.url);
    articles.push(article);
    if (articles.length === limit) break;
  }

  return articles;
}

export async function getLatestNoteArticles(): Promise<NoteArticle[]> {
  try {
    const response = await fetch(NOTE_RSS_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];

    return parseNoteRss(await response.text());
  } catch {
    return [];
  }
}
