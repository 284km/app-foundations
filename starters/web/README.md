# Web starter

TypeScript strict mode, Next.js App Router, PostgreSQL, and a REST Notes API. Requires Node.js 24 and Docker Compose for the local database.

```sh
npm ci
cp .env.example .env
docker compose up -d --wait
npm run db:migrate
npm run dev
```

Open `http://127.0.0.1:3000`. The database port is loopback-only `54329`. The local database deliberately uses trust authentication and must not be exposed to a shared network. The API requires `DEMO_API_ENABLED=true` and is always disabled when `NODE_ENV=production`. Real deployment requires replacing the demo guard with authentication and per-resource authorization; do not simply remove the guard.

```sh
npm run typecheck
npm run build
# Against the running development server and disposable local database:
npm run test:api
```

`db/001-notes.sql` initializes a new demo database. It is not a complete migration system. Use versioned, tracked migrations before changing an application's schema. `docker compose down` stops the local database without deleting its volume.

The API contract is `contracts/openapi.json`; generated declarations are `src/generated/api.ts`. The API returns at most the latest 100 notes. Exact CORS origins for the desktop starter are in `.env.example`. CORS does not authenticate native clients.

## Source and maintenance

Generated from [App Foundations](https://github.com/284km/app-foundations). English is the primary language. The root repository maintains Japanese decision records and guides. Keep the lockfile and `.app-foundations.json` when starting an application. Upstream changes are not applied automatically; follow the maintenance guide and compare against the recorded source revision.

Use synthetic data only. Authentication, per-resource authorization, production deployment, and offline synchronization are not implemented. Public client environment variables must never contain credentials. Replace example identifiers before distributing an application.
