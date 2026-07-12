import type { LineType } from "@/domain/iching/types";

type Props = {
  line: LineType | "yin" | "yang";
  /** 変爻としてハイライトする */
  changing?: boolean;
};

function isYang(line: Props["line"]) {
  return line === "yang" || line === "old-yang";
}

/**
 * 算木1本ぶんの爻。陽=一本棒、陰=中央に空きのある二本。
 * 老陽は○、老陰は×の小さな刻印で識別する。
 */
export function HexagramLine({ line, changing = false }: Props) {
  const mark = line === "old-yang" ? "○" : line === "old-yin" ? "×" : null;
  return (
    <div className="ik-yao-wrap">
      <div className={`ik-yao${changing ? " ik-yao--changing" : ""}`}>
        <span className="ik-yao-seg" />
        {!isYang(line) && <span className="ik-yao-seg" />}
      </div>
      {mark && (
        <span className="ik-yao-mark" aria-hidden>
          {mark}
        </span>
      )}
    </div>
  );
}
