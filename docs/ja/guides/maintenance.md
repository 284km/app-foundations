---
translation_source_sha256: 898297e566c741e9b1c25194e10bba5432c60e1d524c9df3d86615dcc7400fa1
---

# 継続更新と移行

週次でルートと各スターターのnpm、Cargo、Docker、GitHub Actionsの依存更新PRを作ります。互換性のある変更をまとめ、無関係なメジャー更新を混在させません。Expoの対応バージョンは`npx expo install --check`で確認します。

月次ワークフローは未完了の見直しIssueがなければ一つ作成します。公式リリース、サポート期間、セキュリティ修正、代替候補、翻訳、未検証項目を確認します。Issueは判断変更の自動承認ではありません。脆弱性や重大な変更には月次を待たず対応します。

技術選択が変わる場合、新しいADRを作り、旧記録から置換先へリンクします。過去の根拠を保ち、事実誤認は明示して訂正します。

同じPRで英語原文、日本語、必要な契約変更、テスト、検証記録、リリースノート、移行手順を更新します。日本語の`translation_source_sha256`は翻訳を見直した後に更新します。ハッシュ一致だけで意味の一致は証明できません。

新規ディレクトリへの出力、対象OSのビルド、API互換性、必要な失敗時動作を確認します。コンパイルから実機検証済みとは主張しません。CI権限は最小にし、forkのPRに本番秘密情報を渡したり、`pull_request_target`で投稿コードを実行したりしません。

管理元のリリースは`vMAJOR.MINOR.PATCH`です。majorは移行を要する変更、minorは互換機能追加、patchは互換修正です。タグ前にルートと各スターターのversion、lockfile、Cargo、Expo、Tauriのversionを揃え、必要なCIの成功後にリリースします。初期版は開発基盤として扱います。

生成したアプリの依存は各アプリで更新します。`.app-foundations.json`の生成元から必要な変更を判断して取り込みます。テンプレート更新でアプリやDBが自動移行されることはなく、変更済みアプリに新しいlockfileだけを上書きしません。

[Dependabotのグループ更新](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-multi-ecosystem-updates)
