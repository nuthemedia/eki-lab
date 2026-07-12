import type { HakkeColumn } from "@/data/hakke/columns";

const CATEGORY_LABEL = {
  learning: "学び",
  history: "歴史",
  person: "人物",
} as const;

const SOURCE_KIND_LABEL = {
  classic: "古典",
  scholarship: "資料・研究",
  tradition: "伝承",
  hakke: "Hakkeの覚え方",
} as const;

const CATEGORY_ICON = {
  learning: "✦",
  history: "⌁",
  person: "○",
} as const;

export default function ColumnCard({ column, compact = false }: { column: HakkeColumn; compact?: boolean }) {
  return (
    <article className={`hk-column-card${compact ? " is-compact" : ""}`}>
      <p className={`hk-column-category is-${column.category}`}>
        <span className="hk-column-icon" aria-hidden>{CATEGORY_ICON[column.category]}</span>
        {CATEGORY_LABEL[column.category]}
      </p>
      {column.tags?.length ? (
        <div className="hk-column-tags">
          {column.tags.map((tag) => (
            <span
              key={tag}
              className={`hk-column-tag is-${tag}`}
              role="img"
              aria-label={tag === "computer" ? "コンピュータとのつながり" : "ユングとのつながり"}
            >
              {tag === "computer" ? (
                <span aria-hidden>01</span>
              ) : (
                <span className="hk-jung-rings" aria-hidden><i /><i /></span>
              )}
            </span>
          ))}
        </div>
      ) : null}
      <h2 className="hk-column-title">{column.title}</h2>
      <p className="hk-column-body">{column.body}</p>
      {column.source ? (
        <details className="hk-column-source">
          <summary>出典を見る</summary>
          <p>
            <span>{SOURCE_KIND_LABEL[column.sourceKind]}</span>
            {column.historicity === "legendary" ? "・伝説上の人物" : null}
            {column.historicity === "traditional" ? "・伝承上の結びつき" : null}
            <br />
            {column.source}
          </p>
        </details>
      ) : null}
    </article>
  );
}
