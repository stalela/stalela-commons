# Stalela Commons

Shared data layer, types, and utilities used by [stalela-admin](https://github.com/stalela/stalela-admin) and [website](https://github.com/stalela/website).

## What's included

- **`src/`** — `@stalela/commons` package: Supabase API factories (`createBlogApi`, `createLeadsApi`, `createCustomersApi`, `createSeoApi`, `createMetricsApi`, `createCompaniesApi`, `createResearchApi`), client helpers, and shared TypeScript types.
- **`docs/`** — Architecture, domain model, API spec, roadmap, and other design reference documents.
- **`.github/`** — Copilot instructions and prompt templates shared across repos.

## Usage

Install from GitHub in either app repo:

```bash
npm install stalela/stalela-commons
```

Then import using subpath exports:

```ts
import { createBlogApi } from "@stalela/commons/blog";
import { createPublicClient } from "@stalela/commons/client";
import type { Company } from "@stalela/commons/types";
```

## Development

This package is consumed as raw TypeScript source (no build step required). The consuming Next.js apps use `transpilePackages` to compile it.
