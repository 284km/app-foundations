---
translation_source_sha256: 39db29f1b0d9c4fb70ac32a3e96b0546a948e952f52aaceb4c486e3b5c975664
---

# 0004: RESTとOpenAPI契約

状態: 初期基盤として採用。確認日: 2026-11-01。

複数の画面技術・言語から利用できる境界として、本番はHTTPS、REST形式のリソースAPI、JSON、OpenAPI 3.1を採用します。ローカルのloopback例はHTTPです。

OpenAPI 3.1はツール互換性を考慮した選択で、最新仕様という主張ではありません。契約を先に記述し、生成したTypeScript宣言をコミットして差分を検査します。サーバーの実行時検証は別実装なので契約テストも必要です。

- [OpenAPI仕様](https://spec.openapis.org/oas/latest.html)
- [OpenAPI TypeScript](https://openapi-ts.dev/introduction)

パスは`/api/v1`、IDはUUID、日時はUTCのRFC 3339、タイトルはtrim後1〜200文字です。HTTPステータスと`application/problem+json`でエラーを返し、内部例外や入力内容を公開しません。一覧は最新100件までで、ページングは未実装です。

更新にはJSONを要求し、4 KiBまでに制限して未知の項目を拒否します。DB情報はサーバーだけに置き、クライアント変数には公開設定だけを入れます。デモAPIは明示的な有効化を要求し、本番では無効です。CORSの完全一致リストは認証ではありません。

契約と実装の乖離を生成差分とAPIテストで確認します。初期版で生成するのはTypeScript宣言のみです。GraphQLはクライアント主導の取得、gRPCは適したサービス間通信、SSE／WebSocketはイベント配信、tRPCはTypeScriptに限定する場合の比較候補です。Webサーバー内では業務関数を直接呼べます。

旧クライアントの利用を考慮し、破壊的変更と移行期間・対応バージョンを記録します。実際の要件に基づいて通信方式を再評価します。
