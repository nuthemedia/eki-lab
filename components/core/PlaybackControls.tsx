"use client";

import type { PlaybackSpeed } from "./useSequencePlayer";

type Props = {
  playing: boolean;
  speed: PlaybackSpeed;
  isLast: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onSkip: () => void;
  /** 省略時は「もう一度」を表示しない(フロー埋め込み時) */
  onReplay?: () => void;
  onToggleSpeed: () => void;
};

export function PlaybackControls({
  playing,
  speed,
  isLast,
  onTogglePlay,
  onNext,
  onSkip,
  onReplay,
  onToggleSpeed,
}: Props) {
  return (
    <div className="ik-controls">
      <button className="ik-control-btn" onClick={onTogglePlay} disabled={isLast}>
        {playing ? "一時停止" : "再生"}
      </button>
      <button className="ik-control-btn" onClick={onNext} disabled={isLast}>
        進める
      </button>
      <button className="ik-control-btn" onClick={onSkip} disabled={isLast}>
        スキップ
      </button>
      {onReplay && (
        <button className="ik-control-btn" onClick={onReplay}>
          もう一度
        </button>
      )}
      <button className="ik-control-btn" onClick={onToggleSpeed} disabled={isLast}>
        {speed === 1 ? "通常" : "速い"}
      </button>
    </div>
  );
}
