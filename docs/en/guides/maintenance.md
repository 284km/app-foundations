# Maintenance and migrations

## Cadence

- Weekly: dependency PRs for root/starter npm manifests, desktop Cargo dependencies, Docker, and GitHub Actions. Group compatible changes, not unrelated major upgrades. Review Expo-compatible versions with `npx expo install --check`.
- Monthly: a scheduled workflow opens one review issue if none is open. Check official release notes, support windows, security fixes, deferred candidates, translation freshness, and verification gaps. The issue is a reminder, not an automatic architecture change.
- On security advisories or breaking platform changes: assess promptly; do not wait for the monthly reminder.
- When a choice changes: add a new ADR and mark the old one superseded with a link. Preserve historical rationale; correct factual errors explicitly.

## Change requirements

Update the English source, the matching Japanese document, the contract when applicable, tests, validation evidence, release notes, and migration guidance in the same PR. Japanese front matter contains `translation_source_sha256`; update it only after reviewing the translation against the new English text. A matching hash does not establish semantic equivalence.

Validate exports from clean directories, native builds on claimed OS targets, API compatibility, and failure behavior appropriate to the change. Do not claim device testing from compilation. CI permissions stay minimal; fork PRs must never receive production secrets or use `pull_request_target` to run contributed code.

## Releases and downstream applications

Use `vMAJOR.MINOR.PATCH` tags for the source baseline. Major changes require migration guidance; minor changes add compatible capabilities; patch changes fix compatible defects. Before tagging, align the root version, starter package versions, lockfile metadata, desktop Cargo version, Expo app version, and Tauri configuration version. Publish a release only after required CI succeeds. Mark initial releases as development baselines.

Generated apps update dependencies themselves. Use `.app-foundations.json` to find the original commit and apply relevant upstream changes intentionally. Template releases do not automatically migrate application code or data. Never copy a newer lockfile over a modified application's dependency graph.

[Dependabot grouping](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-multi-ecosystem-updates)
