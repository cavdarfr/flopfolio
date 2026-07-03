import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/UserSchema";
import FlopModel, { CARD_TEMPLATES, CardTemplate } from "@/models/FlopSchema";
import {
    renderCard,
    formatYears,
    CARD_SIZES,
    CardFormat,
} from "@/lib/og/templates";
import { outcomeConfig } from "@/lib/config/outcome";
import { loadCardFonts } from "@/lib/og/fonts";

type Params = Promise<{ userSlug: string; flopSlug: string }>;

/**
 * Downloadable share card for a published flop.
 *   ?format=og|square|story   (og 1200×630 for link previews, square 1080×1080
 *                              and story 1080×1350 for Instagram)
 *   ?template=...             (defaults to the flop's own cardTemplate)
 *   ?download=1               (adds Content-Disposition: attachment)
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
    const { userSlug, flopSlug } = await params;
    const q = req.nextUrl.searchParams;

    await dbConnect();
    const user = await User.findOne({ slug: userSlug }).lean();
    if (!user) return new Response("Not found", { status: 404 });
    const flop = await FlopModel.findOne({
        clerkUserId: user.clerkUserId,
        slug: flopSlug,
        published: true,
    }).lean();
    if (!flop) return new Response("Not found", { status: 404 });

    const template = (
        CARD_TEMPLATES.includes(q.get("template") as CardTemplate)
            ? q.get("template")
            : flop.cardTemplate
    ) as CardTemplate;
    const format = (
        ["og", "square", "story"].includes(q.get("format") ?? "")
            ? q.get("format")
            : "og"
    ) as CardFormat;

    const { width, height } = CARD_SIZES[format];
    const fonts = await loadCardFonts().catch(() => []);

    const headers: Record<string, string> = {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    };
    if (q.get("download") === "1") {
        headers["Content-Disposition"] =
            `attachment; filename="flopfolio-${flopSlug}-${format}.png"`;
    }

    return new ImageResponse(
        renderCard(
            template,
            {
                title: flop.title,
                oneLiner: flop.oneLiner,
                cause: flop.causeOfFailure,
                years: formatYears(flop.startedYear, flop.endedYear),
                lesson: flop.lessons?.[0] ?? "",
                author: user.slug,
                outcome: outcomeConfig[flop.outcome]?.label ?? flop.outcome,
            },
            format
        ),
        {
            width,
            height,
            ...(fonts.length > 0 ? { fonts } : {}),
            headers,
        }
    );
}
