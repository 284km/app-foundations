# 0003: Desktop stack

Status: accepted for the initial baseline. Reviewed: 2026-11-01.

## Context and decision

For desktop products with Web-like interfaces and local integration, start with TypeScript, React, Vite, and Tauri. Keep the frontend local and expose narrowly scoped Rust commands. Next.js server components and API handlers are not embedded into Tauri.

## Reasons and evidence

Tauri uses system WebViews and a Rust core process. This avoids bundling a browser engine but introduces differences between platform WebViews. The baseline exposes only a fixed-path export into the application's own data directory; no arbitrary filesystem or shell plugin is enabled.

- [Tauri process model](https://v2.tauri.app/concept/process-model/)
- [Tauri capabilities](https://v2.tauri.app/security/capabilities/)
- [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)

## Costs, alternatives, and reconsideration

Do not infer lower memory usage or better responsiveness from installer size. Measure actual workloads. Electron is a candidate when bundling a controlled Chromium runtime or Node integration outweighs its distribution cost. Native Swift/SwiftUI/AppKit or C#/WinUI can fit deep platform-specific workflows better.

Reconsider for inconsistent WebView behavior, missing APIs, accessibility/input limitations, or a native interaction model. Validate each claimed desktop OS separately. Packaging, auto-update distribution, signing, notarization, and device testing are outside the initial baseline.
