# Flopfolio

Flopfolio is a free MVP for publishing structured, shareable post-mortems of entrepreneurial projects. It focuses on what is available now: a public profile, a guided post-mortem wizard, public/draft visibility, social cards, copyable share text, and an approximate first-party view counter.

No billing, paid plan, custom-domain system, testimonial program, API product, or community network is implemented. None is advertised as available.

## Stack

- Next.js 16 and React 19
- Convex for data, queries, mutations, and aggregate view stats
- Clerk authentication
- Tailwind CSS and Radix UI
- React Hook Form and Zod
- `next/og` for generated PNG social cards
- pnpm, Vitest, `convex-test`, ESLint, and TypeScript

## Local setup

Requirements: Node.js 22+, pnpm 11, a Clerk test application, a Convex development deployment, and optionally UploadThing for uploads.

```bash
pnpm install
cp .env.example .env.local
pnpm exec convex dev
pnpm dev
```

Fill `.env.local` with the Clerk and Convex development values described in `.env.example`. Open [http://localhost:3000](http://localhost:3000).

## Fictional demo walkthrough

The UI includes a clearly labelled fictional profile and post-mortem fixture. It never writes automatically.

1. Sign in with a Clerk development/test account.
2. On the dashboard, choose **Use fictional demo profile**, review it, then save.
3. Choose **New flop**, then **Use fictional example**.
4. Review every wizard step and publish.
5. Open the public post-mortem and its share pack.
6. Copy a prepared post or download landscape (1200×630), square (1080×1080), and portrait 4:5 (1080×1350) PNG cards.

CloudCrate, Mira Vale, and every value supplied by these buttons are fictional demo data. Do not reuse them as testimonials or real customer evidence.

## Quality checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm check
```

CI runs tests, lint, typecheck, and the production build on pushes to `main`/`staging` and on pull requests.

## Privacy and view counts

Views are approximate. The browser reports at most one view per post-mortem per tab session. Convex stores only aggregate counters by a small source allowlist; it does not store IP addresses, user agents, cookies, or visitor identifiers for this feature. Legacy `flops.views` values remain a read-only baseline, so no production data migration is required.

## License

MIT. See [LICENSE](LICENSE).
