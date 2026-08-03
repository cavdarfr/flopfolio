/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");
const identity = (subject: string, issuer = "https://clerk.test") => ({
    subject,
    issuer,
    tokenIdentifier: `${issuer}|${subject}`,
});
const flop = {
    slug: "cloud-crate",
    title: "CloudCrate",
    oneLiner: "A fictional workspace that solved the wrong workflow.",
    sector: "SaaS",
    startedYear: 2022,
    endedYear: 2024,
    outcome: "shutdown" as const,
    causeOfFailure: "Solved the wrong workflow",
    story: {
        context: "A fictional founder saw crews sharing every project update in group chats.",
        attempt: "The team built a focused workspace and tested it with three fictional crews.",
        downfall: "The crews returned to familiar tools because switching created more work than value.",
    },
    lessons: ["Test the cost of changing a habit before building deeply."],
    wouldDoDifferently: "Prototype inside the existing workflow first.",
    costs: { monthsSpent: 18, moneyLost: "$12,000 (fictional)" },
    logoUrl: "",
    cardTemplate: "tombstone" as const,
    published: true,
};

async function createProfile(t: ReturnType<typeof convexTest>, subject: string, slug: string) {
    return await t.withIdentity(identity(subject)).mutation(api.users.save, {
        name: subject,
        slug,
        bio: "Fictional test profile",
        avatarUrl: "",
        socials: [],
        business: [],
    });
}

describe("Convex flop authorization and publication", () => {
    it("requires authentication and a profile", async () => {
        const t = convexTest(schema, modules);
        expect((await t.mutation(api.flops.save, flop)).ok).toBe(false);
        expect((await t.withIdentity(identity("a")).mutation(api.flops.save, flop)).error).toMatch(/profile/i);
    });

    it("enforces ownership for reads, updates and deletes", async () => {
        const t = convexTest(schema, modules);
        await createProfile(t, "a", "owner-a");
        await createProfile(t, "b", "owner-b");
        const created = await t.withIdentity(identity("a")).mutation(api.flops.save, flop);
        expect(created.ok && created.flop).toBeTruthy();
        if (!created.ok || !created.flop) return;
        expect(await t.withIdentity(identity("b")).query(api.flops.getMine, { flopId: created.flop._id })).toBeNull();
        expect((await t.withIdentity(identity("b")).mutation(api.flops.remove, { flopId: created.flop._id })).ok).toBe(false);
    });

    it("keeps drafts private and counts only published views", async () => {
        const t = convexTest(schema, modules);
        await createProfile(t, "a", "owner-a");
        await t.withIdentity(identity("a")).mutation(api.flops.save, { ...flop, published: false });
        expect(await t.query(api.flops.listPublishedByUserSlug, { userSlug: "owner-a" })).toEqual([]);
        expect((await t.mutation(api.flops.trackPublishedView, { userSlug: "owner-a", flopSlug: flop.slug, source: "direct" })).counted).toBe(false);
    });

    it("enforces per-profile slug uniqueness and direct Convex validation", async () => {
        const t = convexTest(schema, modules);
        await createProfile(t, "a", "owner-a");
        expect((await t.withIdentity(identity("a")).mutation(api.flops.save, { ...flop, title: "" })).ok).toBe(false);
        expect((await t.withIdentity(identity("a")).mutation(api.flops.save, flop)).ok).toBe(true);
        expect((await t.withIdentity(identity("a")).mutation(api.flops.save, flop)).ok).toBe(false);
    });

    it("does not expose ownership identifiers publicly", async () => {
        const t = convexTest(schema, modules);
        await createProfile(t, "a", "owner-a");
        await t.withIdentity(identity("a")).mutation(api.flops.save, flop);
        const result = await t.query(api.flops.getBySlugs, { userSlug: "owner-a", flopSlug: flop.slug });
        expect("error" in result).toBe(false);
        if (!("error" in result)) {
            expect(result.flop).not.toHaveProperty("clerkUserId");
            expect(result.flop).not.toHaveProperty("ownerTokenIdentifier");
        }
    });
});
