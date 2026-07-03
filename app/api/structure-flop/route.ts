import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { StructuredFlopSchema } from "@/lib/flopValidation";

export const maxDuration = 60;

const MIN_BRAIN_DUMP_LENGTH = 100;
const MAX_BRAIN_DUMP_LENGTH = 8000;

const SYSTEM_PROMPT = `You receive a founder's raw account of a failed project (a "flop"): unordered, often emotional, told the way they would tell a friend. It may be written in any language — often French or English.

Your job is to extract it faithfully into the given structure. Rules:

- Do NOT invent facts. Everything you output must come from the text or be clearly implied by it.
- Write all output fields in the SAME language as the input. If the founder writes in French, the structured flop is in French.
- Keep the founder's voice: first person, concrete, honest. Clean up the ordering, not the personality.
- "oneLiner" is a single punchy sentence describing what the project was, in first person past tense.
- "causeOfFailure" is the single main cause, as a short phrase — it will be printed on a share card.
- Each lesson must be standalone and quotable: understandable without reading the story, and worth repeating. Extract only lessons the founder actually expresses or clearly implies (1 to 3).
- Split the story into: context (the idea, who it was for), attempt (what was actually built and tried), downfall (what went wrong, concretely).
- Leave nullable fields null when the text does not say: endedYear, wouldDoDifferently, costs.monthsSpent, costs.moneyLost. Do not guess numbers or amounts.
- If the sector is not stated, infer a broad category only if obvious (e.g. "SaaS", "E-commerce"); keep it short.`;

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const brainDump =
        body && typeof body === "object" && "brainDump" in body
            ? (body as { brainDump: unknown }).brainDump
            : undefined;

    if (
        typeof brainDump !== "string" ||
        brainDump.trim().length < MIN_BRAIN_DUMP_LENGTH ||
        brainDump.length > MAX_BRAIN_DUMP_LENGTH
    ) {
        return NextResponse.json(
            {
                error: `brainDump must be a string of ${MIN_BRAIN_DUMP_LENGTH} to ${MAX_BRAIN_DUMP_LENGTH} characters`,
            },
            { status: 400 }
        );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
            { error: "AI structuring is not configured" },
            { status: 503 }
        );
    }

    try {
        const client = new Anthropic(); // reads ANTHROPIC_API_KEY
        const response = await client.messages.parse({
            model: "claude-opus-4-8",
            max_tokens: 16000,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: brainDump }],
            output_config: { format: zodOutputFormat(StructuredFlopSchema) },
        });

        if (!response.parsed_output) {
            return NextResponse.json(
                { error: "The AI could not structure this story — try again or fill it manually" },
                { status: 502 }
            );
        }

        return NextResponse.json(response.parsed_output);
    } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
            return NextResponse.json(
                { error: "The AI is a bit overwhelmed — try again in a minute" },
                { status: 429 }
            );
        }
        if (error instanceof Anthropic.APIError) {
            console.error("[structure-flop] Anthropic API error:", error.status, error.message);
            return NextResponse.json(
                { error: "AI structuring failed — try again or fill it manually" },
                { status: 502 }
            );
        }
        console.error("[structure-flop] Unexpected error:", error);
        return NextResponse.json(
            { error: "Something went wrong — try again or fill it manually" },
            { status: 500 }
        );
    }
}
