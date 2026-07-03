"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Copy, Download, Share2 } from "lucide-react";
import XTwitterIcon from "@/components/icons/XTwitterIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";

type ShareBarProps = {
    userSlug: string;
    flopSlug: string;
    title: string;
    lesson?: string;
};

export default function ShareBar({
    userSlug,
    flopSlug,
    title,
    lesson,
}: ShareBarProps) {
    const [copied, setCopied] = useState(false);

    const url =
        typeof window !== "undefined"
            ? `${window.location.origin}/${userSlug}/${flopSlug}`
            : `/${userSlug}/${flopSlug}`;

    const shareText = lesson
        ? `"${lesson}" — the story of ${title}, a flop worth reading:`
        : `The story of ${title} — a flop worth reading:`;

    const copyLink = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const cardBase = `/api/card/${userSlug}/${flopSlug}`;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <XTwitterIcon size={16} />
                    <span className="ml-2">Post</span>
                </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <LinkedInIcon size={16} />
                    <span className="ml-2">Share</span>
                </a>
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
                <span className="ml-2">{copied ? "Copied" : "Copy link"}</span>
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button size="sm">
                        <Download className="h-4 w-4" />
                        <span className="ml-2">Download card</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                    <div className="flex flex-col gap-1">
                        <a
                            href={`${cardBase}?format=story&download=1`}
                            className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Instagram post{" "}
                            <span className="text-zinc-400">1080 × 1350</span>
                        </a>
                        <a
                            href={`${cardBase}?format=square&download=1`}
                            className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Square{" "}
                            <span className="text-zinc-400">1080 × 1080</span>
                        </a>
                        <a
                            href={`${cardBase}?format=og&download=1`}
                            className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Landscape{" "}
                            <span className="text-zinc-400">1200 × 630</span>
                        </a>
                    </div>
                </PopoverContent>
            </Popover>
            <Share2 className="ml-1 hidden h-4 w-4 text-zinc-300 sm:block" />
        </div>
    );
}
