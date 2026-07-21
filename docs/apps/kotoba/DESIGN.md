# Design

## Direction

深い藍黒の空間に、句ごとの現象だけが鉱物色の光として現れる「五つの気象」。伝統装飾、紙、書道、占いサイトの記号性を避け、現代的で静かなインタラクティブ・ミュージアムとする。

## Tokens

- Background: `#06111b`
- Text: `#f3f5f2`
- Muted: `#99a7af`
- Rule: `rgba(204, 218, 218, .24)`
- Series metal: `#bca77a`
- Reading width: max 680px
- Experience width: max 960px
- Touch target: minimum 44px

## Typography

原文と読み下しは明朝体。現代語訳、解説、操作UIはシステム角ゴシック。文字はすべてDOMで表示する。

## Motion

画面内の作品だけを描画し、非表示タブでは停止する。reduced motionでは自動運動と慣性を止め、操作結果だけを即時表示する。
