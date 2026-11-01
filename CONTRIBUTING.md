# Contributing

English is the primary language for code, identifiers, comments, issues, pull requests, and source documentation. Maintain Japanese counterparts for documents under `docs/en/`. Discuss tradeoffs with public evidence and reproducible conditions.

## Public-only source policy

Author new generic examples. Use synthetic records, reserved example identifiers, and loopback endpoints. Do not read or import private repositories, internal documents, business names or workflows, real user records, screenshots, local configuration, credentials, logs, signing files, or unpublished URLs to prepare a contribution. A secret scanner is a second line of defense, not permission to import private material and redact it later.

Review every added file and the commit history before pushing. Only deliberately reviewed text source belongs in this baseline. Keep build artifacts and native generated projects out of source control. A future binary asset requires a documented policy change and provenance review.

## Verification

Use Node.js 24, then `npm ci`, `npm run generate`, `npm run check`, `npm test`, and `npm run verify:export`. For a changed API run the Web integration tests against a disposable local database. For desktop changes run Cargo formatting and native builds on supported targets. For mobile run Expo dependency checks, export, and native/device checks appropriate to the change.

Do not claim unperformed checks. Update both language versions of the validation record. Record environment and tool versions, never absolute local paths or machine identifiers. English/Japanese hashes detect stale translation sources, not mistranslation.

Changes to decisions need context, alternatives, costs, public sources, and reconsideration criteria. See [maintenance](docs/en/guides/maintenance.md). Keep dependency updates and architecture changes separately reviewable. No automatic merges or production publishing are configured.
