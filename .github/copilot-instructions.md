# Stalela Commons — Copilot Instructions

## Scope
- This repo contains the shared `@stalela/commons` package (Supabase data layer) and reference documentation.
- The package is consumed by `stalela-admin` and `website` repos via `npm install stalela/stalela-commons`.

## Package conventions
- All database/API logic lives in `src/` as factory functions (`createBlogApi`, `createLeadsApi`, `createCustomersApi`, `createSeoApi`, `createMetricsApi`, `createCompaniesApi`, `createResearchApi`).
- Use subpath exports (`/client`, `/blog`, `/leads`, `/customers`, `/seo`, `/metrics`, `/companies`, `/research`, `/types`).
- Types in `src/types.ts` are hand-maintained interfaces (not generated from Supabase schema).
- The package ships as raw TypeScript — no build step. Consuming apps transpile it.

## Change constraints
- Keep the API surface backward-compatible; breaking changes affect both admin and marketing apps.
- `docs/` is future-design reference only; do not implement those workflows/APIs unless explicitly requested.
- Prefer targeted changes that match existing patterns over new abstractions.