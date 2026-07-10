"use client";

import type { LineValue } from "./TrigramFigure";

type Props = {
  disabled: boolean;
  onPick: (value: LineValue) => void;
};

export default function YinYangButtons({ disabled, onPick }: Props) {
  return (
    <div className="hk-buttons">
      <button
        type="button"
        className="hk-yy-btn"
        disabled={disabled}
        onClick={() => onPick("yang")}
      >
        <span className="hk-yy-glyph" aria-hidden>
          <i />
        </span>
        <span className="hk-yy-label">陽</span>
      </button>
      <button
        type="button"
        className="hk-yy-btn"
        disabled={disabled}
        onClick={() => onPick("yin")}
      >
        <span className="hk-yy-glyph is-yin" aria-hidden>
          <i />
          <i />
        </span>
        <span className="hk-yy-label">陰</span>
      </button>
    </div>
  );
}
