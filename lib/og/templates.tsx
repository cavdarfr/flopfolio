/**
 * Share-card templates, rendered by satori via next/og ImageResponse.
 * Satori constraints: flexbox only, inline styles, explicit display:flex
 * on any div with multiple children.
 *
 * Three art directions:
 *  - tombstone : brutalist memorial — bone white, massive type, funeral vernacular
 *  - autopsy   : clinical dark report — spec-sheet rows, acid accent, barcode
 *  - editorial : magazine pull-quote — vermilion ground, serif italic lesson
 */
import type { ReactElement } from "react";
import type { CardTemplate } from "@/models/FlopSchema";

export type CardData = {
    title: string;
    oneLiner: string;
    cause: string;
    years: string;
    lesson: string;
    author: string;
    outcome: string;
};

export type CardFormat = "og" | "square" | "story";

export const CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
    og: { width: 1200, height: 630 },
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1350 },
};

const truncate = (s: string, n: number) =>
    s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

function titleSize(title: string, base: number): number {
    const len = title.length;
    if (len <= 10) return base;
    if (len <= 16) return base * 0.8;
    if (len <= 26) return base * 0.62;
    return base * 0.5;
}

/* ------------------------------------------------------------------ */
/* TOMBSTONE — bone-white brutalist memorial                           */
/* ------------------------------------------------------------------ */
function Tombstone(data: CardData, format: CardFormat): ReactElement {
    const { width, height } = CARD_SIZES[format];
    const portrait = height > width;
    const pad = Math.round(width * 0.055);
    const title = truncate(data.title, 40).toUpperCase();
    const tSize = titleSize(title, portrait ? width * 0.13 : width * 0.105);

    return (
        <div
            style={{
                width,
                height,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#EFECE3",
                color: "#151310",
                padding: pad,
                fontFamily: "IBM Plex Mono",
            }}
        >
            {/* masthead */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", fontSize: width * 0.018, letterSpacing: 4 }}>
                    flopfolio
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: width * 0.015,
                        letterSpacing: 3,
                        border: "2px solid #151310",
                        padding: `${width * 0.006}px ${width * 0.016}px`,
                        borderRadius: 999,
                    }}
                >
                    {data.outcome.toUpperCase()}
                </div>
            </div>

            {/* headstone */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: portrait ? height * 0.02 : height * 0.03,
                }}
            >
                {/* drawn headstone silhouette (round-top stone on a base) */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            width: width * 0.03,
                            height: width * 0.034,
                            backgroundColor: "#151310",
                            borderTopLeftRadius: width * 0.015,
                            borderTopRightRadius: width * 0.015,
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            width: width * 0.044,
                            height: width * 0.006,
                            backgroundColor: "#151310",
                            marginTop: width * 0.003,
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: width * 0.021,
                        letterSpacing: 8,
                    }}
                >
                    {data.years}
                </div>
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Archivo Black",
                        fontSize: tSize,
                        lineHeight: 0.95,
                        letterSpacing: -2,
                        maxWidth: width * 0.88,
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: width * 0.02,
                        lineHeight: 1.45,
                        maxWidth: width * 0.72,
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#4A453C",
                    }}
                >
                    {truncate(data.oneLiner, 110)}
                </div>
            </div>

            {/* footer */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", height: 3, backgroundColor: "#151310" }} />
                <div style={{ display: "flex", height: 1, backgroundColor: "#151310" }} />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: width * 0.016,
                            letterSpacing: 2,
                        }}
                    >
                        CAUSE OF DEATH: {truncate(data.cause, 42).toUpperCase()}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: width * 0.015,
                            color: "#4A453C",
                        }}
                    >
                        laid to rest by @{data.author}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* AUTOPSY — dark clinical report                                      */
/* ------------------------------------------------------------------ */
function Autopsy(data: CardData, format: CardFormat): ReactElement {
    const { width, height } = CARD_SIZES[format];
    const portrait = height > width;
    const pad = Math.round(width * 0.055);
    const ink = "#E9EDF1";
    const dim = "#7A8694";
    const acid = "#D3F244";
    const line = "#242B34";
    const label = {
        display: "flex" as const,
        fontSize: width * 0.014,
        letterSpacing: 4,
        color: dim,
    };
    // deterministic pseudo-barcode from the title
    const bars = Array.from({ length: 32 }, (_, i) => {
        const c = data.title.charCodeAt(i % Math.max(data.title.length, 1)) || 70;
        return ((c * (i + 3)) % 7) + 2;
    });

    return (
        <div
            style={{
                width,
                height,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0D1117",
                color: ink,
                padding: pad,
                fontFamily: "IBM Plex Mono",
            }}
        >
            {/* header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", fontSize: width * 0.016, letterSpacing: 6 }}>
                        FLOPFOLIO
                    </div>
                    <div style={{ ...label }}>PROJECT AUTOPSY REPORT</div>
                </div>
                <div
                    style={{
                        display: "flex",
                        border: `2px solid ${acid}`,
                        color: acid,
                        fontSize: width * 0.015,
                        letterSpacing: 3,
                        padding: `${width * 0.008}px ${width * 0.018}px`,
                        transform: "rotate(3deg)",
                    }}
                >
                    {data.outcome.toUpperCase()}
                </div>
            </div>

            {/* rows */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    justifyContent: "center",
                    gap: portrait ? height * 0.028 : height * 0.04,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        borderBottom: `1px dashed ${line}`,
                        paddingBottom: portrait ? height * 0.024 : height * 0.035,
                    }}
                >
                    <div style={label}>SUBJECT</div>
                    <div
                        style={{
                            display: "flex",
                            fontFamily: "Archivo Black",
                            fontSize: titleSize(data.title, width * 0.062),
                            lineHeight: 1,
                            letterSpacing: -1,
                        }}
                    >
                        {truncate(data.title, 40)}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        borderBottom: `1px dashed ${line}`,
                        paddingBottom: portrait ? height * 0.024 : height * 0.035,
                    }}
                >
                    <div style={label}>CAUSE OF DEATH</div>
                    <div
                        style={{
                            display: "flex",
                            color: acid,
                            fontSize: width * 0.034,
                            fontWeight: 700,
                            lineHeight: 1.15,
                        }}
                    >
                        {truncate(data.cause, 60)}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: width * 0.06,
                        borderBottom: `1px dashed ${line}`,
                        paddingBottom: portrait ? height * 0.024 : height * 0.035,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={label}>LIFESPAN</div>
                        <div style={{ display: "flex", fontSize: width * 0.024 }}>
                            {data.years}
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            flexGrow: 1,
                        }}
                    >
                        <div style={label}>FINDINGS</div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: width * 0.021,
                                lineHeight: 1.4,
                                color: ink,
                            }}
                        >
                            {truncate(data.lesson || data.oneLiner, portrait ? 160 : 120)}
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <div style={{ display: "flex", fontSize: width * 0.015, color: dim }}>
                    examined by @{data.author}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
                    {bars.map((w, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                width: w,
                                height: width * 0.03,
                                backgroundColor: i % 4 === 0 ? acid : ink,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* EDITORIAL — vermilion pull-quote                                    */
/* ------------------------------------------------------------------ */
function Editorial(data: CardData, format: CardFormat): ReactElement {
    const { width, height } = CARD_SIZES[format];
    const portrait = height > width;
    const pad = Math.round(width * 0.06);
    const cream = "#F6F1E7";
    const quote = truncate(data.lesson || data.oneLiner, portrait ? 180 : 140);
    const qLen = quote.length;
    const qSize =
        qLen <= 60
            ? width * 0.062
            : qLen <= 100
              ? width * 0.052
              : width * 0.044;

    return (
        <div
            style={{
                width,
                height,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#E8442B",
                color: cream,
                padding: pad,
                fontFamily: "IBM Plex Mono",
            }}
        >
            {/* masthead */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: width * 0.015,
                    letterSpacing: 5,
                }}
            >
                <div style={{ display: "flex" }}>FLOPFOLIO</div>
                <div style={{ display: "flex" }}>LESSON FROM A FLOP</div>
            </div>

            {/* pull quote */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Instrument Serif",
                        fontStyle: "italic",
                        fontSize: width * 0.14,
                        lineHeight: 0.4,
                        marginBottom: width * 0.02,
                    }}
                >
                    “
                </div>
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Instrument Serif",
                        fontStyle: "italic",
                        fontSize: qSize,
                        lineHeight: 1.18,
                        maxWidth: width * 0.86,
                    }}
                >
                    {quote}
                </div>
            </div>

            {/* byline */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                    style={{
                        display: "flex",
                        width: width * 0.09,
                        height: 4,
                        backgroundColor: cream,
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: width * 0.017,
                            letterSpacing: 2,
                        }}
                    >
                        {truncate(data.title, 30).toUpperCase()} · {data.years}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: width * 0.016,
                            opacity: 0.85,
                        }}
                    >
                        a flop by @{data.author}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

export function renderCard(
    template: CardTemplate,
    data: CardData,
    format: CardFormat
): ReactElement {
    switch (template) {
        case "autopsy":
            return Autopsy(data, format);
        case "editorial":
            return Editorial(data, format);
        case "tombstone":
        default:
            return Tombstone(data, format);
    }
}

export function formatYears(startedYear: number, endedYear?: number): string {
    if (!endedYear || endedYear === startedYear) {
        return endedYear ? String(startedYear) : `${startedYear} —`;
    }
    return `${startedYear} — ${endedYear}`;
}
