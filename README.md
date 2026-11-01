# App Foundations

[日本語](README.ja.md)

Conditional technology decisions and independently usable application starters for Web, mobile, and desktop. English is the primary language; Japanese documents are maintained alongside it.

This repository records why a choice fits a particular context, its costs, alternatives, and when to reconsider it. It does not claim a universal best stack.

| Starter | Baseline | Scope |
| --- | --- | --- |
| [Web](starters/web/README.md) | TypeScript, Next.js, PostgreSQL | Notes UI and REST API |
| [Mobile](starters/mobile/README.md) | TypeScript, React Native, Expo | Native Notes UI using the Web API |
| [Desktop](starters/desktop/README.md) | TypeScript, React, Vite, Tauri | Notes UI and a narrow Rust JSON export command |

All starters use the same [OpenAPI contract](contracts/openapi.json). They are local development examples using synthetic data. The demo API is intentionally disabled in production. Authentication, authorization, offline synchronization, signing, and production deployment are not implemented.

## Start an application

Use Node.js 24. Each starter owns its dependencies and lockfile; this repository is not a shared application workspace.

```sh
npm ci
npm run generate
node scripts/create-app.mjs web ../my-web-app
cd ../my-web-app
npm ci
```

Replace `web` with `mobile` or `desktop`. The destination must not exist and must be outside this repository. Follow the exported README for local setup. Use a release tag for a reproducible starting point; `.app-foundations.json` records the source revision. New applications do not inherit future template changes automatically.

## Read the decisions

- [Overview and support scope](docs/en/overview.md)
- [Web](docs/en/decisions/0001-web-stack.md), [mobile](docs/en/decisions/0002-mobile-stack.md), [desktop](docs/en/decisions/0003-desktop-stack.md)
- [REST and OpenAPI](docs/en/decisions/0004-api-contract.md)
- [Repository and starter boundaries](docs/en/decisions/0005-repository-structure.md)
- [Starting a project](docs/en/guides/starting-a-project.md)
- [Maintenance and migrations](docs/en/guides/maintenance.md)
- [Validation record](docs/en/evaluations/baseline.md)
- [Additional implementation recipes](recipes/README.md)

## Contribute and verify

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [AGENTS.md](AGENTS.md). Public content must be newly authored or drawn from identified public sources. Do not import private repositories, business data, local configuration, logs, credentials, or signing material.

```sh
npm run check
npm test
npm run verify:export
```

CI also checks API behavior against a disposable database, verifies generated contract types, scans the full Git history with Gitleaks, and builds desktop code on each supported desktop OS. Mobile JavaScript export is not a native iOS/Android build or device test; check the validation record for completed checks and remaining gaps.

## Maintenance

Weekly dependency PRs and a monthly review reminder support maintenance. Architecture changes require a new decision record, English/Japanese updates, validation, and migration guidance. Reminders do not automatically approve technology changes. Releases summarize the tested baseline.

Code and documentation are MIT licensed. Dependencies retain their own licenses.
