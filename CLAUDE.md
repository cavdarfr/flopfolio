# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flopfolio is a SaaS platform where entrepreneurs showcase their full business journey — successes and failures. Users create profiles with a unique slug, add businesses/ventures with statuses and lessons learned, and share a public portfolio page.

## Commands

- `pnpm dev` — start dev server (Next.js on localhost:3000)
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm optimize-images` — run image optimization script

No test framework is configured.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **MongoDB** via **Mongoose** (connection singleton in `lib/db.ts`, env var: `MONGO_URI`)
- **Clerk** for auth (middleware in `middleware.ts` protects `/dashboard` routes)
- **UploadThing** for file uploads (4MB max, configured in `lib/uploadthing.ts`)
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI primitives in `components/ui/`)
- **Zod** for validation schemas + **React Hook Form**
- **DiceBear** for auto-generated avatars

## Architecture

### Route Groups (App Router)

- `app/(auth)/` — Clerk sign-in/sign-up pages
- `app/(public)/` — Landing page, about, feedback (no auth required)
- `app/(protected)/` — Dashboard (auth required via Clerk middleware)
- `app/[slug]/` — Public user profile pages (dynamic route at root level)
- `app/api/uploadthing/` — UploadThing file upload API route

### Server Actions (`actions/action.ts`)

All data mutations go through a single server actions file. Every action returns `ActionResponse` (defined in `lib/error-utils.ts`) with `{ success, data?, error?, errorLocation? }`. Key actions:
- `getUser()` — fetch current authenticated user
- `getUserBySlug(slug)` — fetch user by public slug
- `saveUser(data, clerkUserId)` — upsert user profile (uses `findOneAndUpdate` with upsert)
- `checkSlugAvailability(slug, currentUserId?)` — checks slug uniqueness with in-memory 5-min cache
- `submitFeedback(data)` — save contact form feedback

### Data Model

Two Mongoose models in `models/`:
- **User** (`UserSchema.ts`) — `clerkUserId` (unique), `name`, `slug` (unique, lowercase, 3-50 chars, regex-validated), `bio`, `avatarUrl`, nested arrays of `socials` and `business`, timestamps
- **Feedback** (`FeedbackSchema.ts`)

Business status enum: `active | inactive | pending | sold | cancelled | failed` (config in `lib/config/status.ts`)

### Validation

Zod schemas mirror Mongoose schemas:
- `lib/userValidation.ts` — `UserSchema` + `UserFormValues` type
- `lib/feedbackValidation.ts` — feedback form schema

TypeScript types in `lib/types/user.ts` define `User`, `Business`, `Social` interfaces used across components.

### Key Patterns

- Mongoose documents are serialized via `JSON.parse(JSON.stringify(...))` with explicit `_id.toString()` calls before returning from server actions
- MongoDB connection uses a global cache pattern (`lib/db.ts`) to survive HMR in dev
- Slug has a pre-save hook in the Mongoose schema that normalizes format
- `next.config.ts` strips console logs in production, enables tree-shaking for lucide-react and radix icons

## Environment Variables

```
MONGO_URI                              # MongoDB connection string (note: NOT MONGODB_URI)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY      # Clerk public key
CLERK_SECRET_KEY                       # Clerk secret key
UPLOADTHING_SECRET                     # UploadThing secret
UPLOADTHING_APP_ID                     # UploadThing app ID
```

## Gotchas

- The env var is `MONGO_URI` (not `MONGODB_URI`) despite the README saying otherwise — see `lib/db.ts`
- Slug uniqueness is checked both at the Mongoose schema level and in the `saveUser` action
- The `UserForm` component is the main complex form — handles profile, socials, and businesses in one form with React Hook Form field arrays
- Remote image domains are allowlisted in `next.config.ts`: `api.dicebear.com` and `utfs.io`
