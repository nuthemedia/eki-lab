"use client";

type Props = {
  total: number;
  current: number;
};

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="hk-dots" aria-label={`8つのうち ${current + 1}番目`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`hk-dot${i < current ? " is-done" : ""}${i === current ? " is-now" : ""}`}
        />
      ))}
    </div>
  );
}
