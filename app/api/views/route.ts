import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { normalizeShareSource } from "@/lib/share/share-pack";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Record<string, unknown>;
        if (typeof body.userSlug !== "string" || typeof body.flopSlug !== "string" || body.userSlug.length > 80 || body.flopSlug.length > 80) {
            return Response.json({ counted: false }, { status: 400 });
        }
        const result = await fetchMutation(api.flops.trackPublishedView, {
            userSlug: body.userSlug,
            flopSlug: body.flopSlug,
            source: normalizeShareSource(typeof body.source === "string" ? body.source : "unknown"),
        });
        return Response.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch {
        return Response.json({ counted: false }, { status: 400 });
    }
}
