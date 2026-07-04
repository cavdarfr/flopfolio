import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { socialValidator, businessValidator } from "./schema";

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Same normalization the old Mongoose pre-save hook applied. */
function normalizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

/** Profile of the signed-in user (null when signed out or no profile yet). */
export const getCurrent = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_user", (q) =>
                q.eq("clerkUserId", identity.subject)
            )
            .unique();
    },
});

/** Public profile lookup for /[slug] pages. */
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        return await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
    },
});

/** A slug is available when unused, or used by the caller themself. */
export const checkSlugAvailability = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const identity = await ctx.auth.getUserIdentity();
        const existing = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
        return {
            available:
                !existing || existing.clerkUserId === identity?.subject,
        };
    },
});

/** Upsert the signed-in user's profile. */
export const save = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        socials: v.array(socialValidator),
        business: v.array(businessValidator),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { ok: false as const, error: "User not authenticated" };
        }

        const slug = normalizeSlug(args.slug);
        if (!SLUG_REGEX.test(slug)) {
            return { ok: false as const, error: "Slug format is invalid." };
        }

        const slugOwner = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
        if (slugOwner && slugOwner.clerkUserId !== identity.subject) {
            return {
                ok: false as const,
                error: `Slug "${slug}" is already taken`,
            };
        }

        const fields = { ...args, slug, updatedAt: Date.now() };
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerk_user", (q) =>
                q.eq("clerkUserId", identity.subject)
            )
            .unique();

        const id = existing
            ? (await ctx.db.patch(existing._id, fields), existing._id)
            : await ctx.db.insert("users", {
                  ...fields,
                  clerkUserId: identity.subject,
              });

        return { ok: true as const, user: await ctx.db.get(id) };
    },
});
