---
translation_source_sha256: fea01945bde3b22820b2a1c1cefc394e697b9c111e73f700cd9ebaa7f37aa995
---

# 0002: モバイルの技術選択

状態: 初期基盤として採用。確認日: 2026-11-01。

iOSとAndroidを対象にする一般的な製品では、TypeScript、React Native、Expoから始めます。契約や適切な業務処理を共有し、画面はWebのHTMLと分けて端末に合わせます。

React Nativeはネイティブ部品を利用し、Expoのdevelopment buildでは独自のネイティブコードやライブラリを使えます。

- [React Nativeの部品](https://reactnative.dev/docs/intro-react-native-components)
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [ネイティブコード](https://docs.expo.dev/workflow/customizing/)

共通化してもOS別の検証、互換性のあるExpo／React Native／Reactの維持、ネイティブ依存の更新は必要です。JavaScript出力の成功はネイティブビルドや実機動作の保証ではありません。

OS連携や固有操作が中心ならSwift＋SwiftUI／UIKit、Kotlin＋Jetpack Composeを選びます。独自描画の統一を重視する場合はFlutterも候補です。カメラ・音声・Bluetooth・バックグラウンド処理、新OS API、実測上の問題により再評価します。

代替技術のスターター実装や比較測定は未実施です。Expoの対応範囲を無視してReact NativeやReactだけを更新しません。
