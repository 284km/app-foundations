# Initial baseline validation

Reviewed: 2026-11-01. This records completed checks and explicit gaps, not comparative benchmarks.

Local environment: macOS on Apple Silicon, Node.js 24.14.1, and Rust 1.99.1 for native checks. No machine name, home path, account configuration, logs, credentials, or business data is part of this record.

| Check | Initial result |
| --- | --- |
| Next.js production compilation | Passed; demo API remains disabled in production by design |
| Desktop React/Vite frontend build | Passed |
| Mobile iOS/Android JavaScript export | Passed; not a native build |
| Expo dependency compatibility | Passed after aligning the supported React and TypeScript versions |
| Mobile TypeScript check | Passed |
| Desktop Rust Cargo check | Passed on macOS arm64 |
| Native desktop release build | Passed on macOS arm64 |
| REST CRUD, errors, CORS and schema tests with PostgreSQL | Passed; production demo blocking also checked |
| Standalone exports, contract drift and bilingual checks | Passed for all three starters; 10 document pairs checked |
| Public source and Git history scans | Pending final validation |

The CI definition covers repository checks, exported starters, API tests, production demo blocking, and native desktop builds on Linux/macOS/Windows. A configured job is not a passed job; inspect actual successful runs. Exported apps receive a basic typecheck/build workflow and need application-specific integration/native jobs as they evolve.

Not performed: native iOS/Android compilation, simulator/device UI tests, accessibility testing with assistive technology, desktop GUI interaction, Windows/Linux local native builds, signing/installers/update distribution, production load testing, backup/restore, and Rust dependency advisory auditing. No performance winner is claimed.

Read the [dependency advisory review](dependency-advisories.md). Moderate development-tool findings remain; a passing build is not a security guarantee. The demo is not a production backend.

Repeat checks from clean exported directories. Record additional verified environments only when the checks have actually completed.
