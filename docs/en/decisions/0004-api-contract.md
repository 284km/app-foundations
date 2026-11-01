# 0004: REST and OpenAPI contract

Status: accepted for the initial baseline. Reviewed: 2026-11-01.

## Context and decision

Web, mobile, desktop, and possible future native clients need a language-neutral service boundary. Use HTTPS in production, REST-style resource endpoints, JSON payloads, and OpenAPI 3.1 as the canonical contract. Local loopback examples use HTTP.

The OpenAPI version is deliberately conservative for tooling compatibility, not a claim that 3.1 is the newest specification. The OpenAPI document is authored first; generated TypeScript declarations are committed and checked for drift. Server runtime validation remains separately implemented and must be exercised by contract tests.

- [OpenAPI specification](https://spec.openapis.org/oas/latest.html)
- [OpenAPI TypeScript](https://openapi-ts.dev/introduction)

## Conventions

- Paths start with `/api/v1`; support additive compatible changes within v1.
- UUID resource IDs; UTC RFC 3339 timestamps; input titles contain 1–200 characters after trimming.
- Use HTTP status codes and `application/problem+json` errors. Never return internal exceptions or request data in errors.
- Notes list returns at most the latest 100 records. Pagination is not implemented.
- Mutations require JSON; requests are limited to 4 KiB. Unknown input fields are rejected.
- Database data stays server-side. Client-visible variables contain only public configuration.
- Local demo endpoints require explicit opt-in and are disabled in production. CORS is an exact origin list and is not authentication.

## Costs, alternatives, and reconsideration

OpenAPI declarations and runtime implementations can drift. CI must check generated files and real API behavior. SDK generation capabilities vary by target language; only TypeScript declarations are generated initially.

Consider GraphQL for validated client-driven query needs, gRPC for suitable service-to-service workloads, and SSE/WebSocket for event delivery. tRPC can suit a deliberately TypeScript-only boundary. None is the initial default. Web server rendering may invoke internal domain functions directly without an HTTP round trip.

Client releases outlive server deployments: document breaking changes, migration windows, and supported versions. Reconsider the transport when measured product requirements justify it.
