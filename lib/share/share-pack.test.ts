import { describe, expect, it } from "vitest";
import { attributedUrl, buildShareTexts, canonicalPostUrl, normalizeShareSource } from "@/lib/share/share-pack";

describe("share pack", () => {
    it("builds and attributes canonical URLs", () => {
        const url = canonicalPostUrl("https://flopfolio.test/base", "mira", "cloud-crate");
        expect(url).toBe("https://flopfolio.test/mira/cloud-crate");
        expect(attributedUrl(url, "linkedin")).toContain("ref=linkedin");
    });
    it("creates copyable text without inventing claims", () => {
        const texts = buildShareTexts({ title: "CloudCrate", oneLiner: "A fictional failed workspace.", lesson: "Validate habits first.", url: "https://flopfolio.test/mira/cloud" });
        expect(texts.lesson).toContain("Validate habits first.");
        expect(texts.post).toContain("ref=copy");
    });
    it("bounds tracking sources", () => {
        expect(normalizeShareSource("x")).toBe("x");
        expect(normalizeShareSource("attacker-input")).toBe("unknown");
    });
});
