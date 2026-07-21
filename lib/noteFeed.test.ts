import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getLatestNoteArticles,
  NOTE_BEGINNER_URL,
  parseNoteRss,
} from "./noteFeed";

const item = (title: string, link: string) => `
  <item>
    <title>${title}</title>
    <link>${link}</link>
  </item>`;

const feed = (...items: string[]) => `
  <?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>${items.join("")}</channel></rss>`;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseNoteRss", () => {
  it("固定記事を除外し、RSS順の最新2件を返す", () => {
    const result = parseNoteRss(
      feed(
        item("最新記事", "https://note.com/awaicommons/n/latest"),
        item("はじめての方へ", NOTE_BEGINNER_URL),
        item("次の記事", "https://note.com/awaicommons/n/second"),
        item("古い記事", "https://note.com/awaicommons/n/third"),
      ),
    );

    expect(result).toEqual([
      { title: "最新記事", url: "https://note.com/awaicommons/n/latest" },
      { title: "次の記事", url: "https://note.com/awaicommons/n/second" },
    ]);
  });

  it("重複、不正URL、別アカウントの記事を除外する", () => {
    const result = parseNoteRss(
      feed(
        item("対象", "https://note.com/awaicommons/n/valid?from=rss"),
        item("重複", "https://note.com/awaicommons/n/valid"),
        item("別アカウント", "https://note.com/someone/n/other"),
        item("HTTP", "http://note.com/awaicommons/n/insecure"),
        item("不正", "not-a-url"),
      ),
    );

    expect(result).toEqual([
      { title: "対象", url: "https://note.com/awaicommons/n/valid" },
    ]);
  });

  it("記事が1件でもそのまま返す", () => {
    expect(
      parseNoteRss(feed(item("一件だけ", "https://note.com/awaicommons/n/only"))),
    ).toHaveLength(1);
  });
});

describe("getLatestNoteArticles", () => {
  it("5分の再検証を指定してRSSを取得する", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(feed(item("最新記事", "https://note.com/awaicommons/n/latest")), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getLatestNoteArticles()).resolves.toEqual([
      { title: "最新記事", url: "https://note.com/awaicommons/n/latest" },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://note.com/awaicommons/rss", {
      next: { revalidate: 300 },
    });
  });

  it("RSS取得に失敗したら再生成を失敗させる", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(getLatestNoteArticles()).rejects.toThrow("offline");
  });

  it("RSSがHTTPエラーなら再生成を失敗させる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })),
    );

    await expect(getLatestNoteArticles()).rejects.toThrow(
      "Note RSS request failed: 503",
    );
  });

  it("不正XMLや有効な記事0件なら再生成を失敗させる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("<rss><channel>", { status: 200 })),
    );

    await expect(getLatestNoteArticles()).rejects.toThrow(
      "Note RSS did not contain any valid articles",
    );
  });
});
