import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { socialValidator, businessValidator } from "./schema";
import { findCurrentUser, getIdentity, isOwner } from "./auth";
import type { Id } from "./_generated/dataModel";

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function normalizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

function validUrl(value: string): boolean {
    if (value.length === 0) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

function validateProfile(
    args: {
        name: string;
        slug: string;
        bio?: string;
        avatarUrl?: string;
        socials: Array<{ id: string; name: string; url: string }>;
        business: Array<{
            id: string;
            name: string;
            description: string;
            logoUrl?: string;
            status:
                | "active"
                | "inactive"
                | "pending"
                | "sold"
                | "cancelled"
                | "failed";
            lessons: string;
        }>;
    },
    slug: string
): string | null {
    if (args.name.length < 1) return "Name is required";
    if (slug.length < 3) return "Slug must be at least 3 characters";
    if (slug.length > 50) return "Slug cannot exceed 50 characters";
    if (!SLUG_REGEX.test(slug)) return "Slug format is invalid.";
    if (args.avatarUrl !== undefined && !validUrl(args.avatarUrl)) {
        return "Avatar URL is invalid";
    }
    for (const social of args.socials) {
        if (social.name.length < 1) return "Social name is required";
        if (!validUrl(social.url) || social.url.length === 0) {
            return "Social URL is invalid";
        }
    }
    for (const business of args.business) {
        if (business.name.length < 1) return "Business name is required";
        if (business.description.length < 1) {
            return "Business description is required";
        }
        if (business.lessons.length < 1) return "Business lessons are required";
        if (business.logoUrl !== undefined && !validUrl(business.logoUrl)) {
            return "Business logo URL is invalid";
        }
    }
    return null;
}

/** Never expose either ownership identifier from a client-facing query. */
function profileResult(user: {
    _id: Id<"users">;
    _creationTime: number;
    name: string;
    slug: string;
    bio?: string;
    avatarUrl?: string;
    socials: Array<{ id: string; name: string; url: string }>;
    business: Array<{
        id: string;
        name: string;
        description: string;
        logoUrl?: string;
        status:
            | "active"
            | "inactive"
            | "pending"
            | "sold"
            | "cancelled"
            | "failed";
        lessons: string;
    }>;
    createdAt?: number;
    updatedAt?: number;
}) {
    return {
        _id: user._id,
        _creationTime: user._creationTime,
        name: user.name,
        slug: user.slug,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        socials: user.socials,
        business: user.business,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

/** Profile of the signed-in user (null when signed out or no profile yet). */
export const getCurrent = query({
    args: {},
    handler: async (ctx) => {
        const identity = await getIdentity(ctx);
        if (!identity) return null;
        const user = await findCurrentUser(ctx, identity);
        return user ? profileResult(user) : null;
    },
});

/** Public profile lookup for /[slug] pages. */
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(slug)))
            .unique();
        return user ? profileResult(user) : null;
    },
});

/** A slug is available when unused, or used by the authenticated caller. */
export const checkSlugAvailability = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug: rawSlug }) => {
        const slug = normalizeSlug(rawSlug);
        if (
            slug.length < 3 ||
            slug.length > 50 ||
            !SLUG_REGEX.test(slug)
        ) {
            return { available: false, slug };
        }

        const identity = await getIdentity(ctx);
        const existing = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
        return {
            available: !existing || (identity !== null && isOwner(existing, identity)),
            slug,
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
        const identity = await getIdentity(ctx);
        if (!identity) {
            return { ok: false as const, error: "User not authenticated" };
        }

        const slug = normalizeSlug(args.slug);
        const validationError = validateProfile(args, slug);
        if (validationError) {
            return { ok: false as const, error: validationError };
        }

        const slugOwner = await ctx.db
            .query("users")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
        if (slugOwner && !isOwner(slugOwner, identity)) {
            return {
                ok: false as const,
                error: `Slug "${slug}" is already taken`,
            };
        }

        const fields = {
            ...args,
            slug,
            ownerTokenIdentifier: identity.tokenIdentifier,
            updatedAt: Date.now(),
        };
        const existing = await findCurrentUser(ctx, identity);

        const id = existing
            ? (await ctx.db.patch(existing._id, fields), existing._id)
            : await ctx.db.insert("users", {
                  ...fields,
                  clerkUserId: identity.subject,
              });

        const user = await ctx.db.get(id);
        return {
            ok: true as const,
            user: user ? profileResult(user) : null,
        };
    },
});
