"use client";

import { GENERATION_STAGES } from "@/data/taikyoku/generation";

export default function StaticScene({ activeStage = 0 }: { activeStage?: number }) {
  const count = Math.min(8, GENERATION_STAGES[activeStage]?.number ?? 1);
  return (
    <div className="tk-static-scene" aria-hidden>
      {activeStage < 2 ? (
        <div className={`tk-static-orb is-stage-${activeStage}`}>
          <i />
        </div>
      ) : (
        <div className={`tk-static-forms is-count-${count}`}>
          {Array.from({ length: count }, (_, index) => (
            <span key={index} style={{ "--tk-i": index } as React.CSSProperties}>
              <i />
              <i className={index % 2 ? "is-yin" : undefined} />
              {activeStage >= 3 ? <i className={index % 3 ? undefined : "is-yin"} /> : null}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
