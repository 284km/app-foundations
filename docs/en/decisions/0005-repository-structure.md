# 0005: Independent starters in one source repository

Status: accepted for the initial baseline. Reviewed: 2026-11-01.

## Context and decision

Keep decisions, bilingual documentation, API contracts, independent starters, and maintenance automation together. Each starter has its own manifest and lockfile and must work without parent configuration or sibling source paths. Do not create a root application workspace.

A small export script copies one starter, the contract, license, and provenance into a new directory. It excludes development output and local environment files. No registry package or remote installer is required.

## Reasons, costs, and alternatives

This keeps a single review surface while avoiding forced dependency alignment between Next.js, Expo, and Tauri. It duplicates a little client and UI code; intentional duplication is acceptable while shared package boundaries are unproven. CI compares shared contract/client copies and verifies exported applications.

GitHub repository templates copy repository contents; they are not a built-in subdirectory selection mechanism. A future release pipeline may produce separate template repositories, but it should not introduce multiple manually maintained sources.

- [GitHub templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
- [Expo monorepos and tradeoffs](https://docs.expo.dev/guides/monorepos/)

Generated applications have their own lifecycle and do not receive automatic upstream merges. Use provenance plus migration notes. Extract versioned shared libraries only when consumers actually need continued shared updates. A multi-platform product workspace is a possible additional starter, not the required structure for every application.

Reconsider when repeated cross-client domain changes or dependency maintenance shows an independent layout no longer fits.
