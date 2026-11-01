# App Foundations

[English](README.md)

Web・モバイル・デスクトップの技術選択の根拠と、単独で利用できるスターターを管理します。基本言語は英語で、日本語ドキュメントも併せて管理します。推奨は用途と条件を伴う判断であり、唯一の最適解という主張ではありません。

| スターター | 構成 | 範囲 |
| --- | --- | --- |
| [Web](starters/web/README.md) | TypeScript、Next.js、PostgreSQL | ノート画面とREST API |
| [Mobile](starters/mobile/README.md) | React Native、Expo | 共通APIを使うネイティブ画面 |
| [Desktop](starters/desktop/README.md) | React、Vite、Tauri | 共通APIを使う画面とRustによるJSON出力 |

[共通のOpenAPI契約](contracts/openapi.json)を使用します。架空データによるローカル開発例です。デモAPIは本番環境では無効になります。認証・認可、オフライン同期、署名、本番デプロイは実装していません。

## アプリを作り始める

Node.js 24を使用します。各スターターは独立した依存関係とlockfileを持ちます。

```sh
npm ci
npm run generate
node scripts/create-app.mjs web ../my-web-app
cd ../my-web-app
npm ci
```

`web`は`mobile`や`desktop`に変更できます。出力先はこのリポジトリの外にある、未作成のディレクトリにします。続いて出力先のREADMEに従います。再現性のためリリースタグから開始し、生成元は`.app-foundations.json`で確認します。生成後のアプリへ将来の変更が自動反映されることはありません。

## ドキュメント

- [概要と対応範囲](docs/ja/overview.md)
- [Web](docs/ja/decisions/0001-web-stack.md)、[モバイル](docs/ja/decisions/0002-mobile-stack.md)、[デスクトップ](docs/ja/decisions/0003-desktop-stack.md)
- [RESTとOpenAPI](docs/ja/decisions/0004-api-contract.md)
- [リポジトリ構成](docs/ja/decisions/0005-repository-structure.md)
- [開始手順](docs/ja/guides/starting-a-project.md)
- [継続更新と移行](docs/ja/guides/maintenance.md)
- [検証記録](docs/ja/evaluations/baseline.md)
- [追加実装の方針](recipes/README.md)

公開内容は新規作成したもの、または出典を確認できる公開資料に限ります。非公開コード、業務データ、ローカル設定、ログ、秘密情報、署名資材は持ち込みません。運用ルールは[CONTRIBUTING.md](CONTRIBUTING.md)、[SECURITY.md](SECURITY.md)、[AGENTS.md](AGENTS.md)を参照してください。

週次の依存更新PRと月次の見直しIssueを用意します。技術選択の変更には判断記録、英日ドキュメント、検証、移行手順を伴わせます。自動処理は判断の承認を代行しません。モバイルのJavaScript出力はネイティブビルドや実機検証とは区別します。

コードとドキュメントはMITライセンスです。依存物にはそれぞれのライセンスが適用されます。
