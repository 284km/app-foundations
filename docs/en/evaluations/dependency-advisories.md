# Dependency advisory review

Reviewed: 2026-11-01. These are known limitations of the initial development toolchain, not a clean security bill of health.

`npm audit` reported 3 moderate entries at the source root and 21 moderate entries in the Expo dependency tree, including dependent-package entries. Web and desktop npm trees reported zero advisories. No high or critical npm entries were reported in these four trees at review time. Counts will change with registry data and lockfile updates; they are not independent vulnerability counts.

The underlying public advisories are:

- [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): minimatch pattern amplification can exhaust resources with attacker-controlled patterns; the patched major is 11.
- [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): glob cancellation can leave traversal running after timeout; a patched release is 14.0.2.

The affected paths observed here are OpenAPI generation and Expo tooling. This Notes implementation does not accept user-supplied glob patterns or run glob traversal for API requests. This narrows the observed exposure; it does not prove every transitive tool path is unreachable. Audit is not a substitute for threat analysis.

`npm audit` reported no automatic compatible fix for the installed dependency graph. Keep the supported Expo/React Native/React combination and avoid forcing unverified transitive major overrides merely to suppress audit output. Follow upstream toolchain fixes, re-run audit for every dependency update, and reassess if file scanning or patterns become attacker-controlled. Do not use this baseline to process untrusted repositories or publish a generation service without a separate assessment.

Rust dependency advisory auditing has not been performed; Cargo compilation is not a security audit.
