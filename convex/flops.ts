import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { outcomeValidator, cardTemplateValidator } from "./schema";

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

/** Mongo sorted { endedYear: -1, createdAt: -1 }; missing endedYear last. */
function byEndedYearThenCreation(a: Doc<"flops">, b: Doc<"flops">) {
    return (
        (b.endedYear ?? -Infinity) - (a.endedYear ?? -Infinity) ||
        (b.createdAt ?? b._creationTime) - (a.createdAt ?? a._creationTime)
    );
}

/** All published flops for a public profile, newest first. */
export const listPublishedByUserSlug = query({
    args: { userSlug: v.string() },
    handler: async (ctx, { userSlug }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", userSlug))
            .unique();
        if (!user) return null;
        const flops = await ctx.db
            .query("flops")
            .withIndex("by_user", (q) => q.eq("clerkUserId", user.clerkUserId))
            .collect();
        return flops.filter((f) => f.published).sort(byEndedYearThenCreation);
    },
});

/** One published flop + its owner's public profile, for /[slug]/[flopSlug]. */
export const getBySlugs = query({
    args: { userSlug: v.string(), flopSlug: v.string() },
    handler: async (ctx, { userSlug, flopSlug }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", userSlug))
            .unique();
        if (!user) return { error: "User not found" as const };
        const flop = await ctx.db
            .query("flops")
            .withIndex("by_user_slug", (q) =>
                q.eq("clerkUserId", user.clerkUserId).eq("slug", flopSlug)
            )
            .unique();
        if (!flop || !flop.published) {
            return { error: "Flop not found" as const };
        }
        return {
            flop,
            user: {
                name: user.name,
                slug: user.slug,
                avatarUrl: user.avatarUrl ?? "",
                bio: user.bio ?? "",
            },
        };
    },
});

/** All flops (drafts included) of the signed-in user, for the dashboard. */
export const listMine = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const flops = await ctx.db
            .query("flops")
            .withIndex("by_user", (q) =>
                q.eq("clerkUserId", identity.subject)
            )
            .collect();
        return flops.sort(
            (a, b) =>
                (b.updatedAt ?? b._creationTime) -
                (a.updatedAt ?? a._creationTime)
        );
    },
});

export const getMine = query({
    args: { flopId: v.id("flops") },
    handler: async (ctx, { flopId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const flop = await ctx.db.get(flopId);
        if (!flop || flop.clerkUserId !== identity.subject) return null;
        return flop;
    },
});

/** Create or update a flop for the signed-in user. */
export const save = mutation({
    args: { ...flopFields, flopId: v.optional(v.id("flops")) },
    handler: async (ctx, { flopId, ...data }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { ok: false as const, error: "User not authenticated" };
        }

        // Slug must be unique among this user's flops.
        const clash = await ctx.db
            .query("flops")
            .withIndex("by_user_slug", (q) =>
                q.eq("clerkUserId", identity.subject).eq("slug", data.slug)
            )
            .unique();
        if (clash && clash._id !== flopId) {
            return {
                ok: false as const,
                error: `You already have a flop with the slug "${data.slug}"`,
            };
        }

        if (flopId) {
            const existing = await ctx.db.get(flopId);
            if (!existing || existing.clerkUserId !== identity.subject) {
                return { ok: false as const, error: "Flop not found" };
            }
            await ctx.db.patch(flopId, { ...data, updatedAt: Date.now() });
            return { ok: true as const, flop: await ctx.db.get(flopId) };
        }

        const id = await ctx.db.insert("flops", {
            ...data,
            clerkUserId: identity.subject,
            views: 0,
            updatedAt: Date.now(),
        });
        return { ok: true as const, flop: await ctx.db.get(id) };
    },
});

export const remove = mutation({
    args: { flopId: v.id("flops") },
    handler: async (ctx, { flopId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { ok: false as const, error: "User not authenticated" };
        }
        const flop = await ctx.db.get(flopId);
        if (!flop || flop.clerkUserId !== identity.subject) {
            return { ok: false as const, error: "Flop not found" };
        }
        await ctx.db.delete(flopId);
        return { ok: true as const };
    },
});

/** Fire-and-forget view counter for public flop pages. */
export const incrementViews = mutation({
    args: { flopId: v.id("flops") },
    handler: async (ctx, { flopId }) => {
        const flop = await ctx.db.get(flopId);
        if (flop) {
            await ctx.db.patch(flopId, { views: flop.views + 1 });
        }
    },
});
