import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { renderCard, formatYears, CARD_SIZES } from "@/lib/og/templates";
import { outcomeConfig } from "@/lib/config/outcome";
import { loadCardFonts } from "@/lib/og/fonts";

export const size = CARD_SIZES.og;
export const contentType = "image/png";
export const alt = "Flop post-mortem card";

type Params = Promise<{ slug: string; flopSlug: string }>;

export default async function Image({ params }: { params: Params }) {
    const { slug, flopSlug } = await params;

    const result = await fetchQuery(api.flops.getBySlugs, {
        userSlug: slug,
        flopSlug,
    });
    const flop = "error" in result ? null : result.flop;
    const user = "error" in result ? null : result.user;

    const fonts = await loadCardFonts().catch(() => []);

    const data =
        user && flop
            ? {
                  title: flop.title,
                  oneLiner: flop.oneLiner,
                  cause: flop.causeOfFailure,
                  years: formatYears(flop.startedYear, flop.endedYear),
                  lesson: flop.lessons?.[0] ?? "",
                  author: user.slug,
                  outcome: outcomeConfig[flop.outcome]?.label ?? flop.outcome,
              }
            : {
                  title: "Flopfolio",
                  oneLiner: "Post-mortems of projects that didn't make it.",
                  cause: "Unknown",
                  years: "",
                  lesson: "Every setback is a setup for a comeback.",
                  author: "flopfolio",
                  outcome: "Flop",
              };

    return new ImageResponse(
        renderCard(flop?.cardTemplate ?? "tombstone", data, "og"),
        {
            ...size,
            ...(fonts.length > 0 ? { fonts } : {}),
        }
    );
}
