import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "eki-lab | 易を手を動かして学ぶ",
  description: "易(I Ching)を、手を動かして学ぶためのアプリ集。",
  alternates: {
    canonical: "/",
  },
};

const apps = [
  {
    slug: "hakke",
    title: "八卦をつくる",
    desc: "陰と陽を選んで、下から三本。自分の手で八卦をつくる。",
  },
];

export default function RootPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">eki-lab</h1>
        <p className="mt-3 text-base opacity-70">易を、手を動かして学ぶ。</p>
      </header>

      <ul className="flex flex-col gap-4">
        {apps.map((app) => (
          <li key={app.slug}>
            <Link
              href={`/${app.slug}`}
              className="group block rounded-2xl border border-black/10 bg-white/50 px-6 py-5 transition-colors hover:border-black/25 hover:bg-white/80"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{app.title}</h2>
                  <p className="mt-1 text-sm opacity-70">{app.desc}</p>
                </div>
                <span className="text-2xl opacity-30 transition-transform group-hover:translate-x-1 group-hover:opacity-60">
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
