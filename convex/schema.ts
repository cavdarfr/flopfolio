import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Note: Convex forbids field names starting with "_", so the nested
// socials/business entries use "id" here; the server-action layer maps
// them back to "_id" for the existing components.

export const socialValidator = v.object({
    id: v.string(),
    name: v.string(),
    url: v.string(),
});

export const businessStatusValidator = v.union(
    v.literal("active"),
    v.literal("inactive"),
    v.literal("pending"),
    v.literal("sold"),
    v.literal("cancelled"),
    v.literal("failed")
);

export const businessValidator = v.object({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    logoUrl: v.optional(v.string()),
    status: businessStatusValidator,
    lessons: v.string(),
});

export const outcomeValidator = v.union(
    v.literal("shutdown"),
    v.literal("pivoted"),
    v.literal("acquired"),
    v.literal("abandoned"),
    v.literal("still-running")
);

export const cardTemplateValidator = v.union(
    v.literal("tombstone"),
    v.literal("autopsy"),
    v.literal("editorial")
);

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(),
        name: v.string(),
        slug: v.string(),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        socials: v.array(socialValidator),
        business: v.array(businessValidator),
        // Original creation date for documents migrated from MongoDB (ms).
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    })
        .index("by_clerk_user", ["clerkUserId"])
        .index("by_slug", ["slug"]),

    flops: defineTable({
        clerkUserId: v.string(),
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
        views: v.number(),
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    })
        .index("by_user", ["clerkUserId"])
        .index("by_user_slug", ["clerkUserId", "slug"]),

    feedback: defineTable({
        name: v.string(),
        email: v.string(),
        message: v.string(),
    }),
});
