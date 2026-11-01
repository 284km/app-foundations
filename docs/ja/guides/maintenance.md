---
translation_source_sha256: 008e939ba50ac5d0f9452417d0c608f4ce8abcfeb328ec734b1d4c4617ee9fb4
---

# 継続更新と移行

週次でルートと各スターターのnpm、Cargo、Docker、GitHub Actionsの依存更新PRを作ります。互換性のある変更をまとめ、無関係なメジャー更新を混在させません。Expoの対応バージョンは`npx expo install --check`で確認します。

月次ワークフローは未完了の見直しIssueがなければ一つ作成します。公式リリース、サポート期間、セキュリティ修正、代替候補、翻訳、未検証項目を確認します。Issueは判断変更の自動承認ではありません。脆弱性や重大な変更には月次を待たず対応します。

技術選択が変わる場合、新しいADRを作り、旧記録から置換先へリンクします。過去の根拠を保ち、事実誤認は明示して訂正します。

## 依存関係の互換範囲

ルートの`.nvmrc`を共通のNode major（現在24）の基準とします。ルートと各スターターのengine、各`.nvmrc`、直接指定する`@types/node`とlockfile、管理元・出力先のCIを揃え、`npm run check`で検査します。DependabotはNode 24系の型更新を許可し、`@types/node >=25.0.0`を除外します。実行環境の基準を変更するときは、これらをまとめて更新します。

モバイルには独立したnpm更新設定を用意します。Expo 58.0.22ではReact／React DOM 19.3.0、React Native 0.88.1、TypeScript 6.0のパッチ系列を維持します。新しいReact／React NativeとTypeScript 6.1以降は自動提案から除外しますが、対応するTypeScriptのパッチとExpo SDKの更新提案は継続します。モバイルの上限はWeb・デスクトップには適用せず、両者では検証済みのTypeScript 7を維持します。

Expo／ツールの更新時は独立したcheckoutで対象SDKを入れ、`npx expo install --fix`と`npx expo install --check`を実行し、同じPRでモバイルの除外上限を新しい対応版へ変更します。型検査、独立出力、変更に必要なネイティブ・実機確認も行います。manifestだけを移行して古い上限が残る場合は管理元の検査が失敗します。SDK互換性の判定はExpo CLIで行います。

除外するバージョン範囲は、対応外の版に修正があるセキュリティ更新PRも抑える場合があります。脆弱性通知を有効に保ち、必要なSDK／実行環境の協調移行を速やかに評価します。botのPRがないことを安全性の根拠にしません。既存のOpenAPI／Expo開発ツールの指摘は[既知事項](../evaluations/dependency-advisories.md)に引き続き記録します。

この方針は[PR #1](https://github.com/284km/app-foundations/pull/1)、[#2](https://github.com/284km/app-foundations/pull/2)、[#4](https://github.com/284km/app-foundations/pull/4)、[#6](https://github.com/284km/app-foundations/pull/6)の不適合な提案に対応するものです。`main`の互換版を維持し、方針修正のCI成功後に置換された提案をクローズします。

同じPRで英語原文、日本語、必要な契約変更、テスト、検証記録、リリースノート、移行手順を更新します。日本語の`translation_source_sha256`は翻訳を見直した後に更新します。ハッシュ一致だけで意味の一致は証明できません。

新規ディレクトリへの出力、対象OSのビルド、API互換性、必要な失敗時動作を確認します。コンパイルから実機検証済みとは主張しません。CI権限は最小にし、forkのPRに本番秘密情報を渡したり、`pull_request_target`で投稿コードを実行したりしません。

管理元のリリースは`vMAJOR.MINOR.PATCH`です。majorは移行を要する変更、minorは互換機能追加、patchは互換修正です。タグ前にルートと各スターターのversion、lockfile、Cargo、Expo、Tauriのversionを揃え、必要なCIの成功後にリリースします。初期版は開発基盤として扱います。

生成したアプリの依存は各アプリで更新します。`.app-foundations.json`の生成元から必要な変更を判断して取り込みます。テンプレート更新でアプリやDBが自動移行されることはなく、変更済みアプリに新しいlockfileだけを上書きしません。

[Dependabotのグループ更新](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-multi-ecosystem-updates)
