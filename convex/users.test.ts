/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

it("normalizes unique profile slugs and hides ownership identifiers", async () => {
    const t = convexTest(schema, modules);
    const a = t.withIdentity({ subject: "same", issuer: "https://a.test", tokenIdentifier: "https://a.test|same" });
    const b = t.withIdentity({ subject: "same", issuer: "https://b.test", tokenIdentifier: "https://b.test|same" });
    const saved = await a.mutation(api.users.save, { name: "A", slug: " Demo Profile ", bio: "", avatarUrl: "", socials: [], business: [] });
    expect(saved.ok).toBe(true);
    expect(saved.user?.slug).toBe("demo-profile");
    expect(saved.user).not.toHaveProperty("clerkUserId");
    expect((await b.mutation(api.users.save, { name: "B", slug: "demo-profile", bio: "", avatarUrl: "", socials: [], business: [] })).ok).toBe(false);
    expect((await t.query(api.users.checkSlugAvailability, { slug: "Demo   Profile" })).available).toBe(false);
});
