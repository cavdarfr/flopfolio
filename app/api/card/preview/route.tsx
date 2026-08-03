import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
    renderCard,
    CARD_SIZES,
    CardFormat,
    CardData,
} from "@/lib/og/templates";
import { CARD_TEMPLATES, CardTemplate } from "@/lib/types/flop";
import { loadCardFonts } from "@/lib/og/fonts";

/**
 * Live card preview — no database, data comes from query params with
 * sample fallbacks. Used by the wizard's template picker and /dev/cards.
 */
export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams;

    const requestedTemplate = q.get("template");
    if (requestedTemplate && !CARD_TEMPLATES.includes(requestedTemplate as CardTemplate)) {
        return new Response("Invalid template", { status: 400 });
    }
    const template = (requestedTemplate ?? "tombstone") as CardTemplate;
    const requestedFormat = q.get("format");
    if (requestedFormat && !["og", "square", "story"].includes(requestedFormat)) {
        return new Response("Invalid format", { status: 400 });
    }
    const format = (requestedFormat ?? "og") as CardFormat;

    const data: CardData = {
        title: q.get("title")?.trim().slice(0, 80) || "CloudCrate — fictional demo",
        oneLiner:
            q.get("oneLiner")?.trim().slice(0, 140) ||
            "Dropbox for construction sites. Nobody on a construction site asked for it.",
        cause: q.get("cause")?.trim().slice(0, 80) || "No distribution channel",
        years: q.get("years")?.trim().slice(0, 24) || "2021 — 2023",
        lesson:
            q.get("lesson")?.trim().slice(0, 220) ||
            "Build the audience before you build the product.",
        author: q.get("author")?.trim().slice(0, 80) || "fictional-demo",
        outcome: q.get("outcome")?.trim().slice(0, 40) || "Shut down",
    };

    const { width, height } = CARD_SIZES[format];
    const fonts = await loadCardFonts().catch(() => []);

    return new ImageResponse(renderCard(template, data, format), {
        width,
        height,
        ...(fonts.length > 0 ? { fonts } : {}),
        headers: {
            "Cache-Control": "public, max-age=60",
        },
    });
}
