# Starting a project

1. Read the relevant decision record and validation gaps. Choose a release tag and check it out before export.
2. Run `npm ci`, then `npm run generate` at the source root.
3. Run `node scripts/create-app.mjs web ../my-app` (or `mobile`/`desktop`). The destination must not exist.
4. In the destination, run `npm ci` and follow its README. Check in the copied lockfile and `.app-foundations.json`.
5. Rename the application, package identifiers, window/app titles, metadata, and deployment configuration. The `org.example` identifiers must be replaced before distribution.
6. Create the new application's own Git repository and select its visibility deliberately. Exporting does not create or publish a repository.

The Web starter provides the local reference API. Start it first to use mobile or desktop clients. iOS simulator uses `http://127.0.0.1:3000`; Android emulator uses the host alias `http://10.0.2.2:3000`. Physical-device networking, TLS, platform cleartext restrictions, and authentication require explicit application setup. Do not expose the unauthenticated local demo publicly.

Before real data or deployment, implement authentication and per-resource authorization; choose token/session handling per client; add compatible migrations, pagination, rate limits, backup/restore, observability without sensitive payloads, and relevant failure tests. Add offline behavior only when required and define conflict handling first. This is application work, not a claim about the baseline's readiness.
