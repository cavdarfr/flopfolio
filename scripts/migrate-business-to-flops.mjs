/**
 * One-shot, non-destructive migration: copies each user's embedded
 * `business[]` entries into the new `flops` collection.
 *
 * - Existing business data is left untouched.
 * - Re-runnable: skips flops whose (user, slug) already exists.
 * - Migrated flops get placeholder story sections to edit later.
 *
 * Run with:  node scripts/migrate-business-to-flops.mjs
 */
import mongoose from "mongoose";
import { readFileSync, existsSync } from "node:fs";

// Minimal .env.local loader (avoids adding a dependency)
if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
            process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
        }
    }
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI is not set (checked env and .env.local)");
    process.exit(1);
}

const statusToOutcome = {
    active: "still-running",
    inactive: "abandoned",
    pending: "still-running",
    sold: "acquired",
    cancelled: "abandoned",
    failed: "shutdown",
};

function slugify(title) {
    return (
        title
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 80) || "untitled"
    );
}

await mongoose.connect(MONGO_URI);
const db = mongoose.connection.db;
const users = db.collection("users");
const flops = db.collection("flops");

const PLACEHOLDER =
    "(Migrated from the old profile format — edit this flop to tell the full story.)";

let created = 0;
let skipped = 0;

for await (const user of users.find({ "business.0": { $exists: true } })) {
    const createdYear = user.createdAt
        ? new Date(user.createdAt).getFullYear()
        : new Date().getFullYear();

    for (const biz of user.business ?? []) {
        if (!biz?.name) continue;
        let slug = slugify(biz.name);
        const exists = await flops.findOne({
            clerkUserId: user.clerkUserId,
            slug,
        });
        if (exists) {
            skipped++;
            continue;
        }

        const now = new Date();
        await flops.insertOne({
            clerkUserId: user.clerkUserId,
            slug,
            title: biz.name.slice(0, 80),
            oneLiner: (biz.description || biz.name).slice(0, 140),
            startedYear: createdYear,
            outcome: statusToOutcome[biz.status] ?? "shutdown",
            causeOfFailure: "Not specified yet",
            story: {
                context: biz.description || PLACEHOLDER,
                attempt: PLACEHOLDER,
                downfall: PLACEHOLDER,
            },
            lessons: biz.lessons ? [biz.lessons.slice(0, 220)] : ["—"],
            costs: {},
            logoUrl: biz.logoUrl || "",
            cardTemplate: "tombstone",
            published: true,
            views: 0,
            createdAt: now,
            updatedAt: now,
        });
        created++;
    }
}

console.log(`Done. ${created} flop(s) created, ${skipped} skipped (already migrated).`);
await mongoose.disconnect();
