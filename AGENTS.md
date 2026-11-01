# Repository instructions

- Use English for code, comments, commit messages, issues, pull requests, and primary documentation. Keep Japanese counterparts for the English documents under docs/.
- This repository is public. Work only with newly authored generic examples and identified public sources. Do not inspect, copy, summarize, or publish material from private repositories, internal services, local account configuration, personal data, credentials, logs, or signing material.
- Do not import surrounding workspace files. The repository root is the full allowed source context for contributions.
- Scan and review the exact tracked files and Git history before every public push. Never print credentials or log request bodies. Record only public URLs and non-identifying validation results.
- Follow independent starter boundaries: no parent configuration, sibling source imports, workspace protocol dependencies, or symlinked runtime dependencies.
- contracts/openapi.json is canonical. Run npm run generate after contract changes. Keep the common api-client.ts copies aligned until a versioned package is justified.
- Preserve historical decision records; supersede them with new records when choices change. Distinguish source-backed facts, measurements, and judgments.
- Update English/Japanese documentation and translation hashes together. Never label an unperformed check as passed.
- Run checks appropriate to changes, including standalone exports. Do not publish a release if required CI fails.
