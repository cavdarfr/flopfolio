"use client";

import { useEffect } from "react";
import { normalizeShareSource } from "@/lib/share/share-pack";

export default function ViewTracker({ userSlug, flopSlug }: { userSlug: string; flopSlug: string }) {
    useEffect(() => {
        const key = `flopfolio:view:${userSlug}:${flopSlug}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
        const source = normalizeShareSource(new URLSearchParams(window.location.search).get("ref") ?? "direct");
        void fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userSlug, flopSlug, source }),
            keepalive: true,
        }).catch(() => sessionStorage.removeItem(key));
    }, [flopSlug, userSlug]);
    return null;
}
