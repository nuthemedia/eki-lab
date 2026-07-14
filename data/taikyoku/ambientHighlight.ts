export const HIGHLIGHT_INTERVAL_MS = 1_600;
export const REDUCED_HIGHLIGHT_INTERVAL_MS = 3_200;
export const HIGHLIGHT_DURATION_SECONDS = 0.9;
export const FIRST_HIGHLIGHT_DELAY_MS = 600;

export function pickAmbientHighlight(
  previousIndex: number | null,
  excludedIndex: number | null,
  randomValue = Math.random(),
) {
  const candidates = Array.from(
    { length: 64 },
    (_, index) => index,
  ).filter((index) => index !== previousIndex && index !== excludedIndex);
  return candidates[Math.min(candidates.length - 1, Math.floor(randomValue * candidates.length))];
}
