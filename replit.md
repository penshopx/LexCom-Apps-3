# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## LexCom Features

### Frontend (artifacts/lexcom)
- Landing page with all sections
- `/agentic-chatbots` — AI chat with 19 legal agents (SSE streaming): 12 Pakar Hukum + 4 Lex Specialis + 3 Tenaga Ahli
- `/lexbot` — LexBot multi-agent AI orchestrator (streaming, auto tool_choice fallback)
- `/cases` — Legal case management (CRUD)
- `/documents` — AI document generator (SSE streaming)
- `/peraturan` — 50+ regulations database (UU, PP, Perpres, Permen) incl. KUHP Baru UU 1/2023
- `/putusan` — 30+ court decisions (MA, MK, PN, PA) with pokok perkara & amar
- `/panduan` — 30+ legal guides & articles
- `/kursus` — Online legal courses
- `/pengacara` — Verified lawyer directory
- `/forum` — Community forum
- `/layanan` — Services page (10 service cards)
- `/kalkulator` — 6 legal calculators: biaya perkara, pesangon PHK (PP 35/2021), daluwarsa, masa penahanan, waris, biaya notaris
- `/glosarium` — 120+ legal terms with definitions, examples & legal basis
- `/promo` — Sales/promo landing page with pricing
- `/riset-ai` — AI Research Hub: multi-agent summarizer (4 agents: researcher, criminal, corporate, drafter) + semantic search
- `/telaah-dokumen` — Document Review with 5 parallel agents (drafter, corporate, employment, researcher, notaris), risk badge detection
- `/peta-preseden` — Precedent Mapping: 3 agents map related court decisions with visual network graph
- `/penulis-cerdas` — Smart Writer: 3-agent pipeline (Researcher→Drafter→Editor) for articles, legal memos, academic papers, skripsi, MOU drafts; supports 8 doc types; 3-step wizard
- `/chatbot-builder` — No-code custom legal chatbot builder with 8 specialty options, personality config, knowledge base selection, live chat preview, and embed code generator
- `/ebook-builder` — AI ebook/module builder: select template (6 types), manage chapters, AI generates each chapter, preview assembled ebook, export full content
- `/harga` — Pricing page with 4 tiers (Gratis/Starter Rp79k/Pro Rp199k/Advokat Rp499k), annual toggle (25% off), feature comparison, FAQ, WhatsApp purchase CTA
- `/masuk` — Auth gateway page with value proposition, free features list, target user cards, and Replit OAuth login button
- `/profil` — User profile dashboard with plan info, usage bar, quick links, stats, account info; redirects to /masuk if unauthenticated
- Replit Auth integration (login/logout) — Replit OIDC OAuth, sessions in DB, auth middleware, `useAuth()` hook
- User plan system: `plans` + `subscriptions` + `usage_logs` DB tables; `/api/user/profile` endpoint returns planId + usageToday
- Navbar enhanced: user dropdown with avatar, plan badge (🆓⚡🔥👑), Profil/Upgrade/Keluar links; "Harga" link; mobile user menu with plan info
- Hero CTA: shows "Daftar Gratis Sekarang" → /masuk for guests, "Buka LexBot AI" → /lexbot for logged-in; "Lihat Paket" → /harga
- Dark/Light mode toggle — ThemeContext in `src/contexts/ThemeContext.tsx`, persisted to localStorage, sun/moon toggle in Navbar
- PWA support — `vite-plugin-pwa` with manifest, service worker (workbox), law-themed PNG icons (192/512), installable on Android

### Monetization Model
- Free tier: forever free, 5 AI queries/day, database access, calculators, glossary
- Starter (Rp79k/bln, Rp59k annual): 50 queries/day, all 19 AI agents, document generator, case/doc management
- Pro (Rp199k/bln, Rp149k annual): 200 queries/day, Studio AI (Penulis/Chatbot/Ebook), Riset AI, Telaah Dokumen, Peta Preseden
- Advokat/Enterprise (Rp499k/bln, Rp399k annual): unlimited, chatbot embed, API access, white-label, multi-user, 24/7 support
- Payment: WhatsApp-based for now (structured message per plan), replace with Midtrans/Xendit later

- `/intelijen-regulasi` — Dashboard Intelijen Regulasi AI: pemantauan 14 isu regulasi bisnis aktif di 6 sektor (OSS/Perizinan, Teknologi AI, Data & Privasi, Platform Digital, Insentif Pajak, Pusat Data); skor risiko kepatuhan per isu (0-100); analisis AI mendalam + rekomendasi tindakan; checklist kepatuhan interaktif dengan progress tracker; panel "Tanya Pakar Regulasi AI"; filter level risiko (KRITIS/TINGGI/SEDANG/RENDAH); tab kategori; pencarian teks penuh; sorting by skor risiko.

### Key Data Files
- `src/data/glosarium.ts` — 120+ legal terms across 10 categories
- `src/data/peraturan.ts` — 50+ regulations with ringkasan & isi
- `src/data/putusan.ts` — 30+ court decisions
- `src/data/panduan.ts` — 30+ legal guides
- `src/data/kursus.ts` — Legal courses
- `src/data/pengacara.ts` — Lawyer profiles

### Backend (artifacts/api-server routes)
- `GET/POST /api/openai/conversations` — Conversation management
- `GET/DELETE /api/openai/conversations/:id` — Single conversation
- `GET/POST /api/openai/conversations/:id/messages` — Messages with SSE streaming
- `GET/POST/PUT/DELETE /api/cases` — Case management
- `GET/POST/DELETE /api/documents` — Document management
- `POST /api/documents/generate` — AI document generation with SSE
- `GET /api/auth/user`, `GET /api/login`, `GET /api/logout` — Auth

### Database Tables
- sessions — Replit Auth sessions
- users — User accounts
- conversations — AI chat conversations (with agentType)
- messages — Chat messages
- cases — Legal cases
- documents — Generated legal documents

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
