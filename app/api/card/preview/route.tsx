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

    const template = (
        CARD_TEMPLATES.includes(q.get("template") as CardTemplate)
            ? q.get("template")
            : "tombstone"
    ) as CardTemplate;
    const format = (
        ["og", "square", "story"].includes(q.get("format") ?? "")
            ? q.get("format")
            : "og"
    ) as CardFormat;

    const data: CardData = {
        title: q.get("title")?.trim() || "CloudCrate",
        oneLiner:
            q.get("oneLiner")?.trim() ||
            "Dropbox for construction sites. Nobody on a construction site asked for it.",
        cause: q.get("cause")?.trim() || "No distribution channel",
        years: q.get("years")?.trim() || "2021 — 2023",
        lesson:
            q.get("lesson")?.trim() ||
            "Build the audience before you build the product.",
        author: q.get("author")?.trim() || "hakan",
        outcome: q.get("outcome")?.trim() || "Shut down",
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
