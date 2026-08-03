import { describe, expect, it } from "vitest";
import { FlopSchema, flopSlugFromTitle } from "@/lib/flopValidation";

const validFlop = {
    slug: "cloud-crate",
    title: "CloudCrate",
    oneLiner: "A fictional file-sharing tool for construction teams.",
    sector: "SaaS",
    startedYear: 2022,
    endedYear: 2023,
    outcome: "shutdown" as const,
    causeOfFailure: "No distribution channel",
    story: {
        context: "A fictional founder noticed teams sharing plans in group chats.",
        attempt: "They built and tested a focused workspace with five mock teams.",
        downfall: "Interviews showed that the workflow did not solve a frequent problem.",
    },
    lessons: ["Validate a repeated workflow before building the product."],
    wouldDoDifferently: "Interview users before writing production code.",
    costs: { monthsSpent: 6, moneyLost: "EUR 1,200" },
    logoUrl: "",
    cardTemplate: "tombstone" as const,
    published: true,
};

describe("FlopSchema", () => {
    it("accepts a complete fictional post-mortem", () => {
        expect(FlopSchema.safeParse(validFlop).success).toBe(true);
    });

    it("rejects an end year before the start year", () => {
        const result = FlopSchema.safeParse({
            ...validFlop,
            startedYear: 2024,
            endedYear: 2023,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues).toContainEqual(
                expect.objectContaining({ path: ["endedYear"] })
            );
        }
    });

    it("rejects future years and incomplete lessons", () => {
        const result = FlopSchema.safeParse({
            ...validFlop,
            startedYear: new Date().getFullYear() + 1,
            endedYear: undefined,
            lessons: ["no"],
        });
        expect(result.success).toBe(false);
    });

    it("enforces the public slug format and length limits", () => {
        expect(
            FlopSchema.safeParse({ ...validFlop, slug: "Not a slug" }).success
        ).toBe(false);
        expect(
            FlopSchema.safeParse({ ...validFlop, oneLiner: "Too short" }).success
        ).toBe(false);
    });
});

describe("flopSlugFromTitle", () => {
    it("normalizes accents, punctuation and repeated separators", () => {
        expect(flopSlugFromTitle("  Échec & relance -- 2026  ")).toBe(
            "echec-relance-2026"
        );
    });
});
