# nuxt-trpc-starter

Nuxt 4 starter with a typed backend layer already wired up:

- **Nuxt 4** (Nitro, H3, Nuxt UI 4)
- **Better Auth** — email/password, mounted at `server/api/auth/[...all].ts`
- **Drizzle ORM + Postgres** — schema in `server/database/schema.ts`, client in `server/utils/drizzle.ts`
- **tRPC v11** — server core in `server/trpc/`, mounted at `server/api/trpc/[trpc].ts` via `@trpc/server/adapters/fetch`. Client is vanilla `@trpc/client` (`app/utils/trpc.ts`) consumed through Nuxt's own `useAsyncData` — tRPC v11 has no official Vue/TanStack Query integration, so no query library is bundled here on purpose.
- **drizzle-zod** — derive `.input()`/`.output()` Zod schemas straight from Drizzle tables instead of hand-duplicating them
- **husky + lint-staged** — `eslint --fix` on staged files pre-commit

## Setup

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL / BETTER_AUTH_SECRET / BETTER_AUTH_URL
docker compose up -d   # local Postgres
pnpm db:push            # apply schema
pnpm dev
```

`BETTER_AUTH_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Scripts

```bash
pnpm dev / build / preview
pnpm lint / typecheck / test
pnpm db:generate / db:push / db:migrate / db:studio
```

## Layout

```
app/pages/login.vue        example email/password sign-in + sign-up
app/pages/dashboard.vue    example protected page (auth middleware + tRPC calls)
app/middleware/auth.ts     redirects to /login when no session
app/utils/auth-client.ts   Better Auth client (better-auth/vue)
app/utils/trpc.ts          tRPC vanilla client

server/utils/auth.ts       Better Auth instance (drizzleAdapter)
server/utils/drizzle.ts    Drizzle db client
server/database/schema.ts  Drizzle tables (Better Auth's user/session/account/verification to start)
server/trpc/trpc.ts        initTRPC, router, publicProcedure, protectedProcedure
server/trpc/context.ts     tRPC context — pulls the Better Auth session
server/trpc/routers/       add one file per domain, compose in routers/_app.ts
```

Add new domain logic as a router under `server/trpc/routers/`, wire it into `appRouter` in `server/trpc/routers/_app.ts`, and derive its input/output schemas from the corresponding Drizzle table with `drizzle-zod`.

## Renovate

Install the [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on the repo — config already present in `renovate.json`.
