import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { outcomeValidator, cardTemplateValidator } from "./schema";
import { findCurrentUser, getIdentity, isOwner } from "./auth";

const flopFields = {
    slug: v.string(),
    title: v.string(),
    oneLiner: v.string(),
    sector: v.optional(v.string()),
    startedYear: v.number(),
    endedYear: v.optional(v.number()),
    outcome: outcomeValidator,
    causeOfFailure: v.string(),
    story: v.object({
        context: v.string(),
        attempt: v.string(),
        downfall: v.string(),
    }),
    lessons: v.array(v.string()),
    wouldDoDifferently: v.optional(v.string()),
    costs: v.object({
        monthsSpent: v.optional(v.number()),
        moneyLost: v.optional(v.string()),
    }),
    logoUrl: v.optional(v.string()),
    cardTemplate: cardTemplateValidator,
    published: v.boolean(),
};

const viewSourceValidator = v.union(
    v.literal("direct"),
    v.literal("copy"),
    v.literal("x"),
    v.literal("linkedin"),
    v.literal("native"),
    v.literal("unknown")
);
type ViewSource = "direct" | "copy" | "x" | "linkedin" | "native" | "unknown";

type FlopInput = Omit<Doc<"flops">, "_id" | "_creationTime" | "clerkUserId" | "ownerTokenIdentifier" | "views" | "createdAt" | "updatedAt">;

function validateFlop(data: FlopInput): string | null {
    const currentYear = new Date().getFullYear();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug.length < 3 || data.slug.length > 80) return "Invalid slug format";
    if (data.title.length < 1 || data.title.length > 80) return "Title must contain 1 to 80 characters";
    if (data.oneLiner.length < 10 || data.oneLiner.length > 140) return "One-liner must contain 10 to 140 characters";
    if (data.startedYear < 1970 || data.startedYear > currentYear || !Number.isInteger(data.startedYear)) return "Start year is invalid";
    if (data.endedYear !== undefined && (!Number.isInteger(data.endedYear) || data.endedYear < data.startedYear || data.endedYear > currentYear)) return "End year is invalid";
    if (data.causeOfFailure.length < 3 || data.causeOfFailure.length > 80) return "Cause of failure must contain 3 to 80 characters";
    if ([data.story.context, data.story.attempt, data.story.downfall].some((text) => text.length < 20 || text.length > 2000)) return "Each story section must contain 20 to 2000 characters";
    if (data.lessons.length < 1 || data.lessons.length > 3 || data.lessons.some((lesson) => lesson.length < 5 || lesson.length > 220)) return "Provide 1 to 3 lessons of 5 to 220 characters";
    if ((data.sector?.length ?? 0) > 60 || (data.wouldDoDifferently?.length ?? 0) > 1000 || (data.costs.moneyLost?.length ?? 0) > 40) return "Optional content exceeds its limit";
    if (data.costs.monthsSpent !== undefined && (!Number.isInteger(data.costs.monthsSpent) || data.costs.monthsSpent < 0 || data.costs.monthsSpent > 600)) return "Months spent is invalid";
    if (data.logoUrl) {
        try { new URL(data.logoUrl); } catch { return "Logo URL is invalid"; }
    }
    return null;
}

function byEndedYearThenCreation(a: Doc<"flops">, b: Doc<"flops">) {
    return (b.endedYear ?? -Infinity) - (a.endedYear ?? -Infinity) || (b.createdAt ?? b._creationTime) - (a.createdAt ?? a._creationTime);
}

function publicFlop(flop: Doc<"flops">, aggregateViews: number) {
    const { clerkUserId: _clerkUserId, ownerTokenIdentifier: _ownerTokenIdentifier, ...safe } = flop;
    void _clerkUserId;
    void _ownerTokenIdentifier;
    return { ...safe, views: flop.views + aggregateViews };
}

async function aggregateViews(ctx: Pick<QueryCtx, "db"> | Pick<MutationCtx, "db">, flopId: Id<"flops">): Promise<number> {
    const stats = await ctx.db.query("flopStats").withIndex("by_flopId", (q) => q.eq("flopId", flopId)).unique();
    return stats?.views ?? 0;
}

async function recordView(ctx: Pick<MutationCtx, "db">, flopId: Id<"flops">, source: ViewSource) {
    const stats = await ctx.db.query("flopStats").withIndex("by_flopId", (q) => q.eq("flopId", flopId)).unique();
    if (stats) {
        await ctx.db.patch(stats._id, { views: stats.views + 1, [source]: stats[source] + 1 });
    } else {
        await ctx.db.insert("flopStats", { flopId, views: 1, direct: source === "direct" ? 1 : 0, copy: source === "copy" ? 1 : 0, x: source === "x" ? 1 : 0, linkedin: source === "linkedin" ? 1 : 0, native: source === "native" ? 1 : 0, unknown: source === "unknown" ? 1 : 0 });
    }
}

export const listPublishedByUserSlug = query({
    args: { userSlug: v.string() },
    handler: async (ctx, { userSlug }) => {
        const user = await ctx.db.query("users").withIndex("by_slug", (q) => q.eq("slug", userSlug)).unique();
        if (!user) return null;
        const flops = await ctx.db.query("flops").withIndex("by_user_and_published", (q) => q.eq("clerkUserId", user.clerkUserId).eq("published", true)).take(100);
        flops.sort(byEndedYearThenCreation);
        return await Promise.all(flops.map(async (flop) => publicFlop(flop, await aggregateViews(ctx, flop._id))));
    },
});

export const getBySlugs = query({
    args: { userSlug: v.string(), flopSlug: v.string() },
    handler: async (ctx, { userSlug, flopSlug }) => {
        const user = await ctx.db.query("users").withIndex("by_slug", (q) => q.eq("slug", userSlug)).unique();
        if (!user) return { error: "User not found" as const };
        const flop = await ctx.db.query("flops").withIndex("by_user_slug", (q) => q.eq("clerkUserId", user.clerkUserId).eq("slug", flopSlug)).unique();
        if (!flop || !flop.published) return { error: "Flop not found" as const };
        return { flop: publicFlop(flop, await aggregateViews(ctx, flop._id)), user: { name: user.name, slug: user.slug, avatarUrl: user.avatarUrl ?? "", bio: user.bio ?? "" } };
    },
});

export const listMine = query({
    args: {},
    handler: async (ctx) => {
        const identity = await getIdentity(ctx);
        if (!identity) return null;
        const user = await findCurrentUser(ctx, identity);
        if (!user) return [];
        const rows = await ctx.db.query("flops").withIndex("by_user", (q) => q.eq("clerkUserId", user.clerkUserId)).take(100);
        const owned: Doc<"flops">[] = [];
        for (const row of rows) {
            if (isOwner(row, identity)) owned.push(row);
        }
        owned.sort((a, b) => (b.updatedAt ?? b._creationTime) - (a.updatedAt ?? a._creationTime));
        return await Promise.all(owned.map(async (flop) => publicFlop(flop, await aggregateViews(ctx, flop._id))));
    },
});

export const getMine = query({
    args: { flopId: v.id("flops") },
    handler: async (ctx, { flopId }) => {
        const identity = await getIdentity(ctx);
        if (!identity) return null;
        const flop = await ctx.db.get(flopId);
        if (!flop || !isOwner(flop, identity)) return null;
        return publicFlop(flop, await aggregateViews(ctx, flop._id));
    },
});

export const save = mutation({
    args: { ...flopFields, flopId: v.optional(v.id("flops")) },
    handler: async (ctx, { flopId, ...data }) => {
        const identity = await getIdentity(ctx);
        if (!identity) return { ok: false as const, error: "User not authenticated" };
        const user = await findCurrentUser(ctx, identity);
        if (!user) return { ok: false as const, error: "Create your profile before adding a flop" };
        const validationError = validateFlop(data);
        if (validationError) return { ok: false as const, error: validationError };
        const clash = await ctx.db.query("flops").withIndex("by_user_slug", (q) => q.eq("clerkUserId", user.clerkUserId).eq("slug", data.slug)).unique();
        if (clash && clash._id !== flopId) return { ok: false as const, error: `You already have a flop with the slug "${data.slug}"` };
        if (flopId) {
            const existing = await ctx.db.get(flopId);
            if (!existing || !isOwner(existing, identity) || existing.clerkUserId !== user.clerkUserId) return { ok: false as const, error: "Flop not found" };
            await ctx.db.patch(flopId, { ...data, ownerTokenIdentifier: identity.tokenIdentifier, updatedAt: Date.now() });
            const updated = await ctx.db.get(flopId);
            return { ok: true as const, flop: updated ? publicFlop(updated, await aggregateViews(ctx, flopId)) : null, userSlug: user.slug };
        }
        const id = await ctx.db.insert("flops", { ...data, clerkUserId: user.clerkUserId, ownerTokenIdentifier: identity.tokenIdentifier, views: 0, updatedAt: Date.now() });
        const inserted = await ctx.db.get(id);
        return { ok: true as const, flop: inserted ? publicFlop(inserted, 0) : null, userSlug: user.slug };
    },
});

export const remove = mutation({
    args: { flopId: v.id("flops") },
    handler: async (ctx, { flopId }) => {
        const identity = await getIdentity(ctx);
        if (!identity) return { ok: false as const, error: "User not authenticated" };
        const flop = await ctx.db.get(flopId);
        if (!flop || !isOwner(flop, identity)) return { ok: false as const, error: "Flop not found" };
        const stats = await ctx.db.query("flopStats").withIndex("by_flopId", (q) => q.eq("flopId", flopId)).unique();
        if (stats) await ctx.db.delete(stats._id);
        await ctx.db.delete(flopId);
        return { ok: true as const };
    },
});

export const trackPublishedView = mutation({
    args: { userSlug: v.string(), flopSlug: v.string(), source: viewSourceValidator },
    handler: async (ctx, { userSlug, flopSlug, source }) => {
        const user = await ctx.db.query("users").withIndex("by_slug", (q) => q.eq("slug", userSlug)).unique();
        if (!user) return { counted: false };
        const flop = await ctx.db.query("flops").withIndex("by_user_slug", (q) => q.eq("clerkUserId", user.clerkUserId).eq("slug", flopSlug)).unique();
        if (!flop?.published) return { counted: false };
        await recordView(ctx, flop._id, source);
        return { counted: true };
    },
});

export const incrementViews = mutation({
    args: { flopId: v.id("flops") },
    handler: async (ctx, { flopId }) => {
        const flop = await ctx.db.get(flopId);
        if (!flop?.published) return { counted: false };
        await recordView(ctx, flopId, "unknown");
        return { counted: true };
    },
});
