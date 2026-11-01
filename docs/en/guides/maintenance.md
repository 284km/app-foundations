# Maintenance and migrations

## Cadence

- Weekly: dependency PRs for root/starter npm manifests, desktop Cargo dependencies, Docker, and GitHub Actions. Group compatible changes, not unrelated major upgrades. Review Expo-compatible versions with `npx expo install --check`.
- Monthly: a scheduled workflow opens one review issue if none is open. Check official release notes, support windows, security fixes, deferred candidates, translation freshness, and verification gaps. The issue is a reminder, not an automatic architecture change.
- On security advisories or breaking platform changes: assess promptly; do not wait for the monthly reminder.
- When a choice changes: add a new ADR and mark the old one superseded with a link. Preserve historical rationale; correct factual errors explicitly.

## Dependency compatibility boundaries

The root `.nvmrc` defines the shared Node major (currently 24). Root/starter engine constraints, starter `.nvmrc` files, direct `@types/node` pins and lockfiles, and repository/exported CI must agree. `npm run check` verifies these boundaries. Dependabot permits Node 24 type updates and ignores `@types/node >=25.0.0`; changing the runtime baseline requires updating these settings together.

Mobile has its own npm update entry. With Expo 58.0.22, keep React/React DOM 19.3.0, React Native 0.88.1, and the TypeScript 6.0 patch line. The bot ignores newer React/native versions and TypeScript 6.1 or later; compatible TypeScript patches and Expo SDK proposals remain eligible. These mobile caps do not apply to Web or desktop, where TypeScript 7 has been validated independently.

For an Expo/toolchain upgrade, work in an isolated checkout, install the chosen Expo SDK, run `npx expo install --fix` and `npx expo install --check`, then update the mobile ignore caps to the new supported versions in the same PR. Repeat type checks, clean exports, and native/device checks appropriate to the changed dependencies. The repository policy checker rejects stale caps after a manifest migration; the Expo CLI remains the authority for SDK compatibility.

Version ignore ranges can also prevent security-update PRs whose fix lies outside the supported set. Keep vulnerability alerts enabled and assess advisories promptly; perform a coordinated SDK/runtime migration when needed instead of treating a missing bot PR as evidence of safety. The existing OpenAPI/Expo tooling findings remain recorded in the [advisory review](../evaluations/dependency-advisories.md).

This policy resolves the incompatible proposals in [PR #1](https://github.com/284km/app-foundations/pull/1), [#2](https://github.com/284km/app-foundations/pull/2), [#4](https://github.com/284km/app-foundations/pull/4), and [#6](https://github.com/284km/app-foundations/pull/6). Keep the compatible versions already present in `main` and close superseded proposals after the policy fix passes CI.

## Change requirements

Update the English source, the matching Japanese document, the contract when applicable, tests, validation evidence, release notes, and migration guidance in the same PR. Japanese front matter contains `translation_source_sha256`; update it only after reviewing the translation against the new English text. A matching hash does not establish semantic equivalence.

Validate exports from clean directories, native builds on claimed OS targets, API compatibility, and failure behavior appropriate to the change. Do not claim device testing from compilation. CI permissions stay minimal; fork PRs must never receive production secrets or use `pull_request_target` to run contributed code.

## Releases and downstream applications

Use `vMAJOR.MINOR.PATCH` tags for the source baseline. Major changes require migration guidance; minor changes add compatible capabilities; patch changes fix compatible defects. Before tagging, align the root version, starter package versions, lockfile metadata, desktop Cargo version, Expo app version, and Tauri configuration version. Publish a release only after required CI succeeds. Mark initial releases as development baselines.

Generated apps update dependencies themselves. Use `.app-foundations.json` to find the original commit and apply relevant upstream changes intentionally. Template releases do not automatically migrate application code or data. Never copy a newer lockfile over a modified application's dependency graph.

[Dependabot grouping](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-multi-ecosystem-updates)
