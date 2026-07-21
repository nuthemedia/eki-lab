import type { Metadata } from "next";
import { KotobaAudioProvider } from "@/components/kotoba/KotobaAudioProvider";
import { KOTOBA_SEARCH_DESCRIPTION } from "@/data/kotoba/seo";
import "./kotoba.css";

export const metadata: Metadata = {
  title: {
    default: "易のことば",
    template: "%s | 易のことば",
  },
  description: KOTOBA_SEARCH_DESCRIPTION,
  alternates: { canonical: "/kotoba" },
};

export default function KotobaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <KotobaAudioProvider>{children}</KotobaAudioProvider>;
}
