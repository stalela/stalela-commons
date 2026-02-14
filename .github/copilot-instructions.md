# Stalela Commons — Copilot Instructions

## Scope
- Shared `@stalela/commons` package: Supabase data layer consumed by `stalela-admin` and `website` repos via `npm install stalela/stalela-commons`.
- Ships as **raw TypeScript** (no build step) — consuming apps transpile via `transpilePackages`. Single dependency: `@supabase/supabase-js`.

## Factory pattern (core convention)
- Every module exports `create{Domain}Api(supabase: SupabaseClient)` returning an object literal of async methods. Caller injects the client.
- Two client constructors in `src/client.ts`: `createPublicClient()` (anon key) and `createAdminClient()` (service-role, disables session persistence).
- Always import via **subpath exports** (`/client`, `/blog`, `/leads`, etc.) — not the barrel `index.ts`.

## Type conventions (`src/types.ts`)
- **Hand-maintained** interfaces (no codegen). Triple-interface pattern: `Row` / `Insert` / `Update` per entity.
- IDs: `string` (UUID, server-generated — never in Insert types). Dates: `string` (ISO 8601), set via `new Date().toISOString()` in app code.
- Nullable: Row `T | null`, Insert `T? | null`, Update `T?`. Exception: `CompanyResearch` type lives in `src/research.ts`.

## Cross-cutting patterns
- **Error handling**: Uniform `if (error) throw error` — no custom error classes, no Zod. Return types cast via `as Type`.
- **Pagination**: leads/customers/companies `list()` → `{ items[], total }` with `count: "exact"`. Blog/SEO return plain arrays.
- **Search**: `.or()` + `.ilike()` — no full-text search. **Deletes**: Hard deletes only. **Mutations**: Single-row only.

## Domain-specific behaviors
- **Blog** (`blog_posts`): Lookups by **slug** (not UUID). `published_at` set once on first publish.
- **Leads** (`leads`): Immutable — no update method. `create()` returns only `{ id }`.
- **Customers** (`customers`): `promoteFromLead()` is the only cross-table op (reads `leads` → inserts `customers` with `lead_id` FK).
- **SEO** (`seo_overrides`): Upsert on `page_path` natural key. `getByPath()` uses `maybeSingle()` (returns null, doesn't throw).
- **Companies** (`companies`): Read-only from commons (no CUD). Uses 4 Supabase RPCs (`distinct_company_sources`, `distinct_company_provinces`, `distinct_company_cities`, `company_stats`). `nearby()` does Haversine in JS.
- **Research** (`company_research`): Append-only. `getLatest()` has TTL cache via RPC `get_latest_research`. Default AI model: `qwen3-max`.
- **Metrics**: Read-only aggregation across `leads` + `blog_posts`. Client-side grouping for `leadsBySource`.

## Change constraints
- Keep the API surface **backward-compatible** — breaking changes affect admin + marketing apps.
- `docs/` is future-design reference only; do not implement those workflows unless explicitly requested.
- Prefer targeted changes matching existing factory-function patterns over new abstractions.