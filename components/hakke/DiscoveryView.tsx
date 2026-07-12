import type { HakkeColumn } from "@/data/hakke/columns";
import ColumnCard from "./ColumnCard";
import CompletionCelebration from "./CompletionCelebration";

export default function DiscoveryView({ column, onDone }: { column: HakkeColumn; onDone: () => void }) {
  return (
    <main className="hk-discovery">
      <CompletionCelebration />
      <p className="hk-discovery-kicker">ひとつ、発見</p>
      <ColumnCard column={column} />
      <button type="button" className="hk-cta hk-home-cta" onClick={onDone}>
        トップへ
      </button>
    </main>
  );
}
