/**
 * Export MongoDB collections as Convex-shaped JSONL files.
 *
 *   MONGO_URI="mongodb+srv://..." node scripts/export-mongo-to-convex.mjs <outDir>
 *
 * Then import with:
 *   npx convex import --table users    <outDir>/users.jsonl
 *   npx convex import --table flops    <outDir>/flops.jsonl
 *   npx convex import --table feedback <outDir>/feedback.jsonl
 *
 * Mapping notes:
 * - Nested socials/business `_id` becomes `id` (Convex reserves "_" fields)
 * - createdAt/updatedAt become epoch milliseconds
 * - Mongo `_id` and `__v` are dropped (Convex assigns its own ids)
 */
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
}
const outDir = process.argv[2] ?? "./convex-export";
fs.mkdirSync(outDir, { recursive: true });

const BUSINESS_STATUSES = [
    "active",
    "inactive",
    "pending",
    "sold",
    "cancelled",
    "failed",
];
const OUTCOMES = ["shutdown", "pivoted", "acquired", "abandoned", "still-running"];
const TEMPLATES = ["tombstone", "autopsy", "editorial"];

const ms = (d) => (d ? new Date(d).getTime() : undefined);
const strip = (obj) =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    );

await mongoose.connect(uri);
const db = mongoose.connection.db;

const users = (await db.collection("users").find().toArray()).map((u) =>
    strip({
        clerkUserId: u.clerkUserId,
        name: u.name ?? "",
        slug: u.slug,
        bio: u.bio ?? "",
        avatarUrl: u.avatarUrl ?? "",
        socials: (u.socials ?? []).map((s) => ({
            id: String(s._id ?? crypto.randomUUID()),
            name: s.name ?? "",
            url: s.url ?? "",
        })),
        business: (u.business ?? []).map((b) => ({
            id: String(b._id ?? crypto.randomUUID()),
            name: b.name ?? "",
            description: b.description ?? "",
            logoUrl: b.logoUrl ?? "",
            status: BUSINESS_STATUSES.includes(b.status) ? b.status : "pending",
            lessons: b.lessons ?? "",
        })),
        createdAt: ms(u.createdAt),
        updatedAt: ms(u.updatedAt),
    })
);

const flops = (await db.collection("flops").find().toArray()).map((f) =>
    strip({
        clerkUserId: f.clerkUserId,
        slug: f.slug,
        title: f.title ?? "",
        oneLiner: f.oneLiner ?? "",
        sector: f.sector ?? undefined,
        startedYear: f.startedYear,
        endedYear: f.endedYear ?? undefined,
        outcome: OUTCOMES.includes(f.outcome) ? f.outcome : "shutdown",
        causeOfFailure: f.causeOfFailure ?? "",
        story: {
            context: f.story?.context ?? "",
            attempt: f.story?.attempt ?? "",
            downfall: f.story?.downfall ?? "",
        },
        lessons: (f.lessons ?? []).map(String),
        wouldDoDifferently: f.wouldDoDifferently ?? undefined,
        costs: strip({
            monthsSpent: f.costs?.monthsSpent ?? undefined,
            moneyLost: f.costs?.moneyLost ?? undefined,
        }),
        logoUrl: f.logoUrl ?? "",
        cardTemplate: TEMPLATES.includes(f.cardTemplate)
            ? f.cardTemplate
            : "tombstone",
        published: f.published ?? true,
        views: f.views ?? 0,
        createdAt: ms(f.createdAt),
        updatedAt: ms(f.updatedAt),
    })
);

const feedback = (await db.collection("feedbacks").find().toArray()).map(
    (f) => ({
        name: f.name ?? "",
        email: f.email ?? "",
        message: f.message ?? "",
    })
);

for (const [table, rows] of Object.entries({ users, flops, feedback })) {
    const file = path.join(outDir, `${table}.jsonl`);
    fs.writeFileSync(file, rows.map((r) => JSON.stringify(r)).join("\n"));
    console.log(`${table}: ${rows.length} -> ${file}`);
}

await mongoose.disconnect();
