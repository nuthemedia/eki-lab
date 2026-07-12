import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://awaicommons.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "eki-lab",
    template: "%s | eki-lab",
  },
  description: "易(I Ching)を、手を動かして学ぶ。八卦をつくるところから。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics mode="production" />
      </body>
    </html>
  );
}
