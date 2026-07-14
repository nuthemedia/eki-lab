# Design

## Direction

黒・墨・淡金による静かなインタラクティブ・ミュージアム。伝統装飾や占いサイトの記号性ではなく、古代思想を抽象的な数学モデルとして見せる。

## Camera

1. 太極へDolly in
2. 球を割らず内部へPass through
3. 上昇しながらPull backして四象を俯瞰
4. 八卦の環を約15度Arc
5. 上下卦の間を通り、64の場をWide reveal

スクロール進行は可逆。文字はDOM、立体は固定Canvasに置く。

## Tokens

- Background: `#070808`
- Text: `#f0e9da`
- Gold: `#d6bd82`
- Muted: `#a89f8c`
- Mobile frame: max 480px
- Touch target: minimum 44px

## Motion

Canvasはon-demand描画。reduced motionでは各段階の固定カメラと完成状態を表示する。
