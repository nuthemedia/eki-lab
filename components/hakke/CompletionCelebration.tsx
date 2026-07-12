export default function CompletionCelebration() {
  return (
    <div className="hk-celebration" role="img" aria-label="八つの学びがそろった">
      <span className="hk-celebration-orbit" aria-hidden>
        {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
      </span>
      <svg className="hk-celebration-check" viewBox="0 0 32 32" aria-hidden>
        <path d="M8 16.5l5.2 5.2L24 10.8" />
      </svg>
    </div>
  );
}
