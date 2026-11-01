# 0001: Web stack

Status: accepted for the initial baseline. Reviewed: 2026-11-01.

## Context and decision

For general-purpose online Web applications, start with TypeScript strict mode, React, Next.js App Router, and PostgreSQL. Keep domain boundaries explicit within one deployable application. Separate services when independent scaling, ownership, or fault isolation is demonstrated.

## Reasons and evidence

Next.js supports server and client components and Node.js/Docker deployment. This provides rendering choices without requiring a separate backend service for the initial API. PostgreSQL provides relational constraints and transactional data management. These capabilities support the decision; they do not prove comparative superiority.

- [Next.js rendering boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying)
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## Costs, alternatives, and reconsideration

Next.js introduces rendering, cache, and server/client boundary complexity. TypeScript types do not validate external inputs at runtime. Keep runtime validation and database constraints.

SvelteKit is a candidate when its UI model and simpler application structure better fit the product. Phoenix LiveView is a candidate for server-driven real-time workflows. Rust or Go services are candidates when measured resource or runtime requirements justify them. Reconsider for sustained CPU-heavy work, unsuitable rendering requirements, platform constraints, or materially better validated alternatives.

No comparative benchmark was performed. Do not describe this as the fastest stack.
