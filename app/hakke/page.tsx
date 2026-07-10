import type { Metadata } from "next";
import HakkeApp from "@/components/hakke/HakkeApp";

const title = "八卦をつくる | HAKKE";
const description =
  "陰と陽を選んで、下から三本。自分の手で八卦をつくって、形・漢字・自然のイメージをからだで覚える。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/hakke",
  },
};

export default function HakkePage() {
  return <HakkeApp />;
}
