"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Share2 } from "lucide-react";
import XTwitterIcon from "@/components/icons/XTwitterIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import { attributedUrl, buildShareTexts, cardUrl } from "@/lib/share/share-pack";

type Props = { userSlug: string; flopSlug: string; title: string; oneLiner: string; lesson?: string; canonicalUrl: string; updatedAt: string };

export default function ShareBar(props: Props) {
    const [copied, setCopied] = useState<"link" | "post" | "lesson" | null>(null);
    const [error, setError] = useState("");
    const texts = buildShareTexts({ title: props.title, oneLiner: props.oneLiner, lesson: props.lesson, url: props.canonicalUrl });
    const copy = async (kind: "link" | "post" | "lesson", value: string) => {
        try { await navigator.clipboard.writeText(value); setCopied(kind); setError(""); setTimeout(() => setCopied(null), 2000); }
        catch { setError("Copy failed. Select and copy the text manually."); }
    };
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texts.x)}&url=${encodeURIComponent(attributedUrl(props.canonicalUrl, "x"))}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(attributedUrl(props.canonicalUrl, "linkedin"))}`;
    const formats = [
        ["og", "Landscape", "1200 × 630"],
        ["square", "Square", "1080 × 1080"],
        ["portrait", "Portrait 4:5", "1080 × 1350"],
    ] as const;
    return (
        <section aria-labelledby="share-pack-title" className="border-2 border-ink bg-bone p-4">
            <div className="flex items-center justify-between gap-3"><div><h2 id="share-pack-title" className="font-display uppercase">Share pack</h2><p className="text-xs text-muted">Copy a message or download a social card.</p></div><Share2 className="h-5 w-5 text-vermilion" /></div>
            <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild><a href={xUrl} target="_blank" rel="noopener noreferrer"><XTwitterIcon size={16} /> Post</a></Button>
                <Button variant="outline" size="sm" asChild><a href={linkedInUrl} target="_blank" rel="noopener noreferrer"><LinkedInIcon size={16} /> Share</a></Button>
                <Button variant="outline" size="sm" onClick={() => copy("link", attributedUrl(props.canonicalUrl, "copy"))}>{copied === "link" ? <Check /> : <Copy />} Copy link</Button>
                <Button variant="outline" size="sm" onClick={() => copy("post", texts.post)}>{copied === "post" ? <Check /> : <Copy />} Copy post</Button>
                {props.lesson && <Button variant="outline" size="sm" onClick={() => copy("lesson", texts.lesson)}>{copied === "lesson" ? <Check /> : <Copy />} Copy lesson</Button>}
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && <Button size="sm" onClick={() => navigator.share({ title: props.title, text: props.oneLiner, url: attributedUrl(props.canonicalUrl, "native") }).catch(() => undefined)}><Share2 /> Share</Button>}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">{formats.map(([format, label, size]) => <a key={format} href={cardUrl(props.userSlug, props.flopSlug, format, props.updatedAt)} className="border border-line bg-surface px-3 py-2 text-sm hover:border-ink"><span className="flex items-center gap-2 font-medium"><Download className="h-4 w-4" />{label}</span><span className="text-xs text-faint">{size}</span></a>)}</div>
            <p aria-live="polite" className="mt-2 text-xs text-vermilion">{error || (copied ? "Copied to clipboard." : "")}</p>
        </section>
    );
}
