export const SHARE_SOURCES = ["direct", "copy", "x", "linkedin", "native", "unknown"] as const;
export type ShareSource = (typeof SHARE_SOURCES)[number];

export function normalizeShareSource(value: string | null | undefined): ShareSource {
    return SHARE_SOURCES.includes(value as ShareSource) ? (value as ShareSource) : "unknown";
}

export function canonicalPostUrl(origin: string, userSlug: string, flopSlug: string): string {
    const base = origin.startsWith("http") ? origin : `https://${origin}`;
    return new URL(`/${encodeURIComponent(userSlug)}/${encodeURIComponent(flopSlug)}`, base).toString();
}

export function attributedUrl(url: string, source: ShareSource): string {
    const result = new URL(url);
    result.searchParams.set("ref", source);
    return result.toString();
}

export function buildShareTexts(input: { title: string; oneLiner: string; lesson?: string; url: string }) {
    const intro = `${input.title}: ${input.oneLiner}`;
    return {
        post: `${intro}\n\n${attributedUrl(input.url, "copy")}`,
        lesson: input.lesson
            ? `“${input.lesson}” — from the ${input.title} post-mortem\n\n${attributedUrl(input.url, "copy")}`
            : `${intro}\n\n${attributedUrl(input.url, "copy")}`,
        x: `I shared the post-mortem of ${input.title}: ${input.oneLiner}`,
    };
}

export function cardUrl(userSlug: string, flopSlug: string, format: "og" | "square" | "portrait", updatedAt: string) {
    const version = encodeURIComponent(updatedAt);
    return `/api/card/${encodeURIComponent(userSlug)}/${encodeURIComponent(flopSlug)}?format=${format}&download=1&v=${version}`;
}
