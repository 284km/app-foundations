---
translation_source_sha256: 382ed7c78ffaa55e9382f27958160bdd22bf53df4f8fec5380011c913cca9215
---

# 0001: Webの技術選択

状態: 初期基盤として採用。確認日: 2026-11-01。

一般的なオンラインWebアプリでは、TypeScript strict、React、Next.js App Router、PostgreSQLから始めます。一つのアプリ内で業務の境界を設け、独立した拡張・責任範囲・障害分離が必要になった箇所を分割します。

Next.jsのサーバー／クライアント描画とNode.js／Dockerでの運用、PostgreSQLの制約とトランザクションを評価しています。これらの性質は、他候補への総合的な優位性を証明するものではありません。

- [描画の境界](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [デプロイ方法](https://nextjs.org/docs/app/getting-started/deploying)
- [DB制約](https://www.postgresql.org/docs/current/ddl-constraints.html)

代償は描画・キャッシュ・実行場所の複雑さです。TypeScriptだけに頼らず、実行時検証とDB制約を併用します。

UIと構成の適性ではSvelteKit、サーバー主導のリアルタイム用途ではPhoenix LiveView、実測で計算量や資源効率が問題になる場合はRustやGoを比較します。描画・運用上の制約が合わない場合や、検証された代替案が改善した場合に再評価します。比較ベンチマークは未実施で、最速という主張はしません。
