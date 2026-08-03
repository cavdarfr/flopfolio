import type { UserIdentity } from "convex/server";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type AuthCtx = Pick<QueryCtx, "auth"> | Pick<MutationCtx, "auth">;
type DatabaseCtx = Pick<QueryCtx, "db"> | Pick<MutationCtx, "db">;
type OwnedDocument = {
    clerkUserId: string;
    ownerTokenIdentifier?: string;
};

export async function getIdentity(ctx: AuthCtx): Promise<UserIdentity | null> {
    return await ctx.auth.getUserIdentity();
}

/**
 * Canonical ownership check with a narrow compatibility path for imported rows.
 * Once ownerTokenIdentifier exists, subject-only fallback is never allowed.
 */
export function isOwner(
    document: OwnedDocument,
    identity: UserIdentity
): boolean {
    return document.ownerTokenIdentifier !== undefined
        ? document.ownerTokenIdentifier === identity.tokenIdentifier
        : document.clerkUserId === identity.subject;
}

/** Locate the current profile without mutating legacy rows from a query. */
export async function findCurrentUser(
    ctx: DatabaseCtx,
    identity: UserIdentity
): Promise<Doc<"users"> | null> {
    const canonical = await ctx.db
        .query("users")
        .withIndex("by_ownerTokenIdentifier", (q) =>
            q.eq("ownerTokenIdentifier", identity.tokenIdentifier)
        )
        .unique();
    if (canonical) return canonical;

    const legacy = await ctx.db
        .query("users")
        .withIndex("by_clerk_user", (q) =>
            q.eq("clerkUserId", identity.subject)
        )
        .unique();

    return legacy && isOwner(legacy, identity) ? legacy : null;
}
