"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import {
  searchHexagrams,
  type HexagramSearchItem,
} from "@/domain/iching/hexagramDiscovery";

export default function HexagramHeader({ items }: { items: HexagramSearchItem[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const results = useMemo(() => searchHexagrams(items, query), [items, query]);

  useEffect(() => {
    if (!searchOpen && !menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSearchOpen(false);
      setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen((open) => !open);
  }

  function openMenu() {
    setSearchOpen(false);
    setMenuOpen((open) => !open);
  }

  return (
    <header className="hx-app-header">
      <Link href="/" className="hx-brand-link">
        AWAI Commons
      </Link>
      <div className="hx-header-actions">
        <button
          type="button"
          aria-label={searchOpen ? "検索を閉じる" : "六十四卦を検索"}
          aria-expanded={searchOpen}
          onClick={openSearch}
        >
          {searchOpen ? <X aria-hidden /> : <Search aria-hidden />}
        </button>
        <button
          type="button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          onClick={openMenu}
        >
          {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <>
            <button
              type="button"
              className="hx-overlay-backdrop"
              aria-label="検索を閉じる"
              onClick={() => setSearchOpen(false)}
            />
            <motion.section
              className="hx-search-tray hx-glass"
              aria-label="六十四卦を検索"
              initial={reducedMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
            >
              <label className="hx-quick-search">
                <Search aria-hidden />
                <span className="hx-visually-hidden">卦名、読み、キーワード、番号</span>
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="卦名・読み・キーワード・番号"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button type="button" aria-label="検索語を消す" onClick={() => setQuery("")}>
                    <X aria-hidden />
                  </button>
                )}
              </label>
              {query && (
                <div className="hx-search-results" aria-live="polite">
                  {results.length ? (
                    results.map((item) => (
                      <Link
                        key={item.number}
                        href={`/hexagrams/${item.number}`}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span>第{item.number}卦</span>
                        <strong>{item.name}</strong>
                        <small>{item.reading}</small>
                      </Link>
                    ))
                  ) : (
                    <p>該当する卦がありません。</p>
                  )}
                </div>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <button
              type="button"
              className="hx-overlay-backdrop"
              aria-label="メニューを閉じる"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="hx-menu-sheet hx-glass"
              aria-label="辞典メニュー"
              initial={reducedMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            >
              <Link href="/hexagrams" onClick={() => setMenuOpen(false)}>
                <span>01</span>六十四卦一覧
              </Link>
              <Link href="/hakke" onClick={() => setMenuOpen(false)}>
                <span>02</span>八卦を学ぶ
              </Link>
              <Link href="/coin" onClick={() => setMenuOpen(false)}>
                <span>03</span>コイン易
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
