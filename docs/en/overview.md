# Overview

Reviewed: 2026-11-01. Status: initial development baseline.

Optimize for user experience, correctness, maintainability, and manageable operations in general-purpose online applications. Developer familiarity is not an evaluation criterion. Implementation complexity, ecosystem constraints, and operational effort still count.

The default stack is TypeScript/Next.js/PostgreSQL for Web, React Native/Expo for mobile, and React/Tauri for desktop. These are conditional recommendations, not measured winners over every alternative.

## Boundaries

- Each starter is independent and reproducible from its own lockfile.
- The Web starter owns the reference API. Clients communicate using HTTP and JSON described by OpenAPI.
- Database access is server-only. Neither database configuration nor server secrets belong in clients.
- Share contracts and suitable domain logic; adapt navigation, input, accessibility, and OS integration per platform.
- The Notes demo lists the latest 100 notes. Pagination, per-user ownership, conflict resolution, and durable offline queues are future application work.
- Public HTTP examples are loopback development addresses. Production APIs require HTTPS and real authentication/authorization; the demo API rejects production requests.

See [validation](evaluations/baseline.md) for checks actually performed. An implemented starter is not evidence of native device testing, production readiness, or comparative performance.

## Reading order

Read the five [decision records](decisions/0001-web-stack.md), [starting guide](guides/starting-a-project.md), and [maintenance guide](guides/maintenance.md). English is canonical. Japanese uses matching document IDs and tracks the English content hash; semantic equivalence requires review.
