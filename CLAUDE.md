# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flopfolio is a SaaS platform where entrepreneurs showcase their full business journey — successes and failures. Users create profiles with a unique slug, add flops (post-mortems of failed ventures) with lessons learned, and share a public portfolio page with generated share cards.

## Commands

- `pnpm dev` — start dev server (Next.js on localhost:3000)
- `npx convex dev` — run Convex locally (pushes functions, watches for changes; required alongside `pnpm dev`)
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm optimize-images` — run image optimization script

No test framework is configured.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Convex** for the database (schema in `convex/schema.ts`, functions in `convex/*.ts`)
- **Clerk** for auth (middleware in `middleware.ts` protects `/dashboard` routes); Convex validates Clerk JWTs via the "convex" JWT template (`convex/auth.config.ts`)
- **UploadThing** for file uploads (4MB max, configured in `lib/uploadthing.ts`)
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI primitives in `components/ui/`)
- **Zod** for validation schemas + **React Hook Form**
- **DiceBear** for auto-generated avatars

## Architecture

### Route Groups (App Router)

- `app/(auth)/` — Clerk sign-in/sign-up pages
- `app/(public)/` — Landing page, about, feedback (no auth required)
- `app/(protected)/` — Dashboard (auth required via Clerk middleware)
- `app/[slug]/` — Public user profile pages; `app/[slug]/[flopSlug]/` — public flop pages
- `app/api/card/` — share-card PNG generation (next/og)
- `app/api/uploadthing/` — UploadThing file upload API route

### Data Layer

Convex tables (`convex/schema.ts`): **users**, **flops**, **feedback**.
Convex functions: `convex/users.ts`, `convex/flops.ts`, `convex/feedback.ts`.

Server actions (`actions/action.ts`, `actions/flop-actions.ts`) are thin adapters over Convex via `fetchQuery`/`fetchMutation` from `convex/nextjs`. Every action returns `ActionResponse` (defined in `lib/error-utils.ts`) with `{ success, data?, error?, errorLocation? }`. Components only talk to server actions, never to Convex directly.

Auth inside Convex functions comes from `ctx.auth.getUserIdentity()` (identity.subject = Clerk user id). Server actions obtain the JWT via `convexAuthToken()` in `lib/convex-server.ts` (Clerk JWT template named `convex`).

### Validation

Zod schemas mirror the Convex schema:
- `lib/userValidation.ts` — `UserSchema` + `UserFormValues` type
- `lib/flopValidation.ts` — `FlopSchema` + `FlopFormValues` type
- `lib/feedbackValidation.ts` — feedback form schema

Shared client-safe constants/types live in `lib/types/` (`user.ts`, `flop.ts` — flop outcomes, card templates). Never import from `convex/_generated` in client components.

### Key Patterns

- Convex forbids field names starting with `_`, so nested socials/business entries are stored with `id`; the server-action layer maps `id` ↔ `_id` because components expect `_id`
- Convex docs carry `_creationTime` (number); the actions serialize `createdAt`/`updatedAt` to ISO strings for components. Migrated documents keep their original dates in optional `createdAt`/`updatedAt` fields
- Slug normalization (the old Mongoose pre-save hook) lives in `convex/users.ts` `normalizeSlug`
- Expected failures (slug taken, not found) are returned from mutations as `{ ok: false, error }`, not thrown
- `next.config.ts` strips console logs in production, enables tree-shaking for lucide-react and radix icons

## Environment Variables

```
# Next.js (.env.local / Vercel)
NEXT_PUBLIC_CONVEX_URL                 # Convex deployment URL
CONVEX_DEPLOYMENT                      # dev only, written by `npx convex dev`
CONVEX_DEPLOY_KEY                      # Vercel only, for `npx convex deploy`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY      # Clerk public key
CLERK_SECRET_KEY                       # Clerk secret key
NEXT_PUBLIC_APP_URL                    # canonical app URL (OG images, metadata)
UPLOADTHING_TOKEN / UPLOADTHING_API_KEY

# Convex deployment env (npx convex env set ...)
CLERK_JWT_ISSUER_DOMAIN                # https://clerk.flopfolio.co (prod Clerk issuer)
```

## Gotchas

- `pnpm-workspace.yaml` must keep its `packages` field: Vercel builds with pnpm 9, which errors on a workspace file without it. The `allowBuilds` key in the same file is the pnpm 10+ build-script approval list
- Slug uniqueness is enforced in `convex/users.ts` (`by_slug` index) and per-user flop slugs in `convex/flops.ts` (`by_user_slug` index)
- The `UserForm` component is the main complex form — handles profile, socials, and businesses in one form with React Hook Form field arrays
- Remote image domains are allowlisted in `next.config.ts`: `api.dicebear.com` and `utfs.io`
- `scripts/export-mongo-to-convex.mjs` is the one-shot MongoDB → Convex data migration (mongoose is a devDependency only for this)
- For agent/CI work without a Convex account: `CONVEX_AGENT_MODE=anonymous npx convex dev` runs a local anonymous deployment
