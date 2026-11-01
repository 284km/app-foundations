# Desktop starter

TypeScript, React, Vite, Tauri, and a narrow Rust command. Requires Node.js 24, a current stable Rust toolchain, and the platform's [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). Start the Web starter API and database first.

```sh
npm ci
cp .env.example .env
npm run desktop:dev
```

The local client uses `http://127.0.0.1:3000`; the frontend dev port is `1420`. The Web starter's origin allowlist includes its development origins and Tauri application origins. Changing the API host also requires updating Tauri's CSP and the server's origin policy. These policies do not replace authentication.

```sh
npm run typecheck
npm run build
# With a supported Rust compiler:
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --locked --manifest-path src-tauri/Cargo.toml
npm run desktop:build
```

`build` builds only the frontend. `desktop:build` compiles a native executable without producing installers. A generic placeholder icon is generated from text at build time. Distribution branding, signing, notarization, and auto-updates are not configured. CI builds native executables on macOS, Windows, and Linux; inspect successful job results before claiming a target is verified.

"Export JSON locally" invokes Rust to write `notes-export.json` to the app's own data directory; it overwrites that demo export. The WebView cannot choose an arbitrary path. No shell or general filesystem plugin is enabled. The export button requires Tauri and will report an error in a plain browser.

Change `src-tauri/tauri.conf.json` product/identifier fields before distribution. Windows/Linux OS-specific behavior and assistive technology require testing beyond compilation.

## Source and maintenance

Generated from [App Foundations](https://github.com/284km/app-foundations). English is the primary language. The root repository maintains Japanese decision records and guides. Keep the lockfile and `.app-foundations.json` when starting an application. Upstream changes are not applied automatically; follow the maintenance guide and compare against the recorded source revision.

Use synthetic data only. Authentication, per-resource authorization, production deployment, and offline synchronization are not implemented. Public client environment variables must never contain credentials. Replace example identifiers before distributing an application.
