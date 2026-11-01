---
translation_source_sha256: 341432ba1b4d58ea6e3063a2e14b649deca0f2e6fd269ccbfc95c6a5bbd185eb
---

# 0003: デスクトップの技術選択

状態: 初期基盤として採用。確認日: 2026-11-01。

Webに近い画面とローカル機能を組み合わせる場合、TypeScript、React、Vite、Tauriから始めます。ローカル画面から範囲を限定したRustコマンドを呼び、Next.jsのサーバー機能は組み込みません。

TauriはOSのWebViewとRustのコアプロセスを使います。ブラウザーエンジンの同梱を避けられる一方、OS別のWebViewの差を扱う必要があります。初期実装はアプリ自身のデータディレクトリへの固定パス出力だけを公開し、任意のファイル操作やシェルは許可しません。

- [Tauriのプロセス構成](https://v2.tauri.app/concept/process-model/)
- [権限](https://v2.tauri.app/security/capabilities/)
- [Electronの構成](https://www.electronjs.org/docs/latest/tutorial/process-model)

配布サイズからメモリや応答性の優位を推測せず、実際に計測します。Chromium環境の統一やNode連携を重視する場合はElectron、OS固有の操作が中心ならSwift／SwiftUI／AppKitやC#／WinUIも候補です。

WebView差異、API不足、入力やアクセシビリティの制約があれば再評価します。対応を主張するOSごとに検証します。署名、インストーラー配布、自動更新、notarization、実機検証は初期範囲外です。
