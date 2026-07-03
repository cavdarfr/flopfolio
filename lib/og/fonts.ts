/**
 * Fonts for the share-card renderer (satori requires TTF/OTF/WOFF, not woff2).
 * Fetched from Google Fonts at runtime — a server-side fetch without a browser
 * user-agent returns TTF sources. Cached per server instance.
 */

export type CardFont = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: "normal" | "italic";
};

const FONT_SOURCES: Array<Omit<CardFont, "data"> & { cssUrl: string }> = [
    {
        name: "Archivo Black",
        cssUrl: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
        weight: 400,
        style: "normal",
    },
    {
        name: "IBM Plex Mono",
        cssUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap",
        weight: 400,
        style: "normal",
    },
    {
        name: "IBM Plex Mono",
        cssUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@700&display=swap",
        weight: 700,
        style: "normal",
    },
    {
        name: "Instrument Serif",
        cssUrl: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap",
        weight: 400,
        style: "italic",
    },
];

let fontsPromise: Promise<CardFont[]> | null = null;

async function fetchFontData(cssUrl: string): Promise<ArrayBuffer> {
    const css = await fetch(cssUrl, {
        // No browser UA → Google serves TTF, which satori can consume
        headers: { "User-Agent": "node" },
    }).then((r) => r.text());
    const match = css.match(/src:\s*url\(([^)]+)\)/);
    if (!match) throw new Error(`No font url in CSS from ${cssUrl}`);
    const res = await fetch(match[1]);
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    return res.arrayBuffer();
}

export async function loadCardFonts(): Promise<CardFont[]> {
    if (!fontsPromise) {
        fontsPromise = Promise.all(
            FONT_SOURCES.map(async ({ cssUrl, ...meta }) => ({
                ...meta,
                data: await fetchFontData(cssUrl),
            }))
        ).catch((err) => {
            fontsPromise = null; // allow retry on next request
            throw err;
        });
    }
    return fontsPromise;
}
