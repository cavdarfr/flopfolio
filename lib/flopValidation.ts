import { z } from "zod";
import { FLOP_OUTCOMES, CARD_TEMPLATES } from "@/models/FlopSchema";

export const FlopSchema = z.object({
    slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(80, "Slug cannot exceed 80 characters")
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format"),
    title: z.string().min(1, "Title is required").max(80),
    oneLiner: z
        .string()
        .min(10, "Give it a punchy one-liner (at least 10 characters)")
        .max(140, "Keep the one-liner under 140 characters"),
    sector: z.string().max(60).optional().or(z.literal("")),
    startedYear: z.coerce.number().int().min(1970).max(2100),
    endedYear: z.coerce
        .number()
        .int()
        .min(1970)
        .max(2100)
        .optional()
        .or(z.literal("").transform(() => undefined)),
    outcome: z.enum(FLOP_OUTCOMES),
    causeOfFailure: z
        .string()
        .min(3, "Name the main cause of failure")
        .max(80, "Keep the cause short — it goes on the card"),
    story: z.object({
        context: z
            .string()
            .min(20, "What was the idea? Who was it for? (at least 20 characters)")
            .max(2000),
        attempt: z
            .string()
            .min(20, "What did you actually build and try? (at least 20 characters)")
            .max(2000),
        downfall: z
            .string()
            .min(20, "What went wrong, concretely? (at least 20 characters)")
            .max(2000),
    }),
    lessons: z
        .array(z.string().min(5, "A lesson needs at least 5 characters").max(220))
        .min(1, "At least one lesson — that's the whole point")
        .max(3, "Three lessons max — pick the ones that matter"),
    wouldDoDifferently: z.string().max(1000).optional().or(z.literal("")),
    costs: z
        .object({
            monthsSpent: z.coerce.number().int().min(0).max(600).optional(),
            moneyLost: z.string().max(40).optional().or(z.literal("")),
        })
        .default({}),
    logoUrl: z.string().url().optional().or(z.literal("")),
    cardTemplate: z.enum(CARD_TEMPLATES).default("tombstone"),
    published: z.boolean().default(true),
});

export type FlopFormValues = z.infer<typeof FlopSchema>;

export function flopSlugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}
