# Security and public content

This is a development baseline, not a deployed service. The Notes API requires explicit local opt-in and rejects all production requests until real authentication and authorization are designed. The local PostgreSQL container uses trust authentication and binds its published port to loopback; do not reuse that configuration on a shared or production network.

Never submit credentials, personal records, internal URLs, private code, crash dumps, signing material, or unredacted logs in an issue, pull request, commit, or report. Expo `EXPO_PUBLIC_` and Vite `VITE_` variables are public build configuration.

To report a vulnerability, use the repository's GitHub private vulnerability reporting channel when enabled. If unavailable, open an issue requesting a private reporting channel without exploit details or sensitive data. Do not guess a private email address.

If a secret is exposed, revoke/rotate it first, stop further publication, then assess history and artifact cleanup. Deleting a file or rewriting history does not revoke a credential or guarantee removal of public copies.

The public-content checker, Gitleaks, and manual review are complementary controls. Passing scans is not a guarantee that all confidential information has been identified.
