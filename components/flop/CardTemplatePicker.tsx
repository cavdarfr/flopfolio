"use client";

import { CARD_TEMPLATES, type CardTemplate } from "@/lib/types/flop";
import { cn } from "@/lib/utils";

const TEMPLATE_LABELS: Record<CardTemplate, string> = {
    tombstone: "Tombstone",
    autopsy: "Autopsy",
    editorial: "Editorial",
};

type CardTemplatePickerProps = {
    value: CardTemplate;
    onChange: (template: CardTemplate) => void;
    preview: {
        title: string;
        oneLiner: string;
        cause: string;
        years: string;
        lesson: string;
    };
    /** Bump to refresh the preview images when form fields change */
    cacheKey: number;
};

export default function CardTemplatePicker({
    value,
    onChange,
    preview,
    cacheKey,
}: CardTemplatePickerProps) {
    const previewSrc = (template: CardTemplate) => {
        const params = new URLSearchParams({
            template,
            format: "og",
            title: preview.title,
            oneLiner: preview.oneLiner,
            cause: preview.cause,
            years: preview.years,
            lesson: preview.lesson,
            v: String(cacheKey),
        });
        return `/api/card/preview?${params.toString()}`;
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CARD_TEMPLATES.map((template) => (
                <button
                    key={template}
                    type="button"
                    onClick={() => onChange(template)}
                    aria-pressed={value === template}
                    className={cn(
                        "group rounded-2xl border-2 p-2 text-left transition-colors",
                        value === template
                            ? "border-zinc-900 bg-zinc-50"
                            : "border-zinc-200 hover:border-zinc-400"
                    )}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewSrc(template)}
                        alt={`${TEMPLATE_LABELS[template]} card preview`}
                        width={1200}
                        height={630}
                        loading="lazy"
                        className="w-full rounded-xl border border-zinc-100 bg-zinc-100 aspect-[1200/630] object-cover"
                    />
                    <span
                        className={cn(
                            "mt-2 block px-1 pb-1 text-sm font-medium",
                            value === template
                                ? "text-zinc-900"
                                : "text-zinc-500 group-hover:text-zinc-700"
                        )}
                    >
                        {TEMPLATE_LABELS[template]}
                    </span>
                </button>
            ))}
        </div>
    );
}
