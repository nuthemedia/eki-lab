# Audio

## Requirements

- 新シリーズ専用の無声・低密度・有機的なアンビエント
- 120秒以上で自然にループできるもの
- アプリへの同梱と公開利用が確認できるライセンス
- 最終配置: `public/audio/kotoba/ambient.mp3`

## Playback

初期設定はON。ブラウザーの自動再生制限に従い、ページ内で最初のポインターまたはキーボード操作が行われた時点で再生を開始する。明示的なOFFは `localStorage` に保存し、`/kotoba` 内の遷移中は共通レイアウトで再生位置と設定を維持する。作品ごとにフィルター周波数と反応音を変える。

## Selected track

- 曲名: Ambient Meditation
- 作者: NourishedByMusic
- 長さ: 5:10
- 配布元: Pixabay
- 配布ページ: https://pixabay.com/music/ambient-ambient-meditation-118429/
- ライセンス: Pixabay Content License
- 公開日: 2022-08-31
- 選定・ライセンス確認日: 2026-07-15
- 正規配布ファイル: https://cdn.pixabay.com/audio/2022/08/27/audio_f27482c6cf.mp3
- `media-use` 方針: 指定曲を別プロバイダーの候補に置き換えず、Pixabayの作品ページが再生する同一MP3を固定した。

## Freeze record

- 保存先: `public/audio/kotoba/ambient.mp3`
- 取得日: 2026-07-15
- 実尺: 310.386938秒
- 形式: MP3、256kbps、44.1kHz、Joint Stereo
- SHA-256: `de26821b3a2ee622729153a2ab512faf1793bd0fcf978e2ab780b00452bc8d87`

作品ページをブラウザーで開き、主音源の再生要素が参照するPixabay CDN URLから同一MP3を取得した。出典不明の音源や別曲では代替しない。
