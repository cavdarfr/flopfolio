"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PenLine, Sparkles } from "lucide-react";
import type { StructuredFlop } from "@/lib/flopValidation";

const MIN_LENGTH = 100;
const MAX_LENGTH = 8000;

type BrainDumpStepProps = {
    value: string;
    onChange: (value: string) => void;
    onStructured: (data: StructuredFlop) => void;
    onManual: () => void;
};

export default function BrainDumpStep({
    value: brainDump,
    onChange,
    onStructured,
    onManual,
}: BrainDumpStepProps) {
    const [isStructuring, setIsStructuring] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tooShort = brainDump.trim().length < MIN_LENGTH;

    const structure = async () => {
        setError(null);
        setIsStructuring(true);
        try {
            const res = await fetch("/api/structure-flop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brainDump }),
            });
            if (!res.ok) {
                const body = (await res.json().catch(() => null)) as {
                    error?: string;
                } | null;
                if (res.status === 503) {
                    setError(
                        "AI structuring isn't available right now — you can fill the form manually below."
                    );
                } else {
                    setError(
                        body?.error ||
                            "Something went wrong — try again or fill it manually."
                    );
                }
                return;
            }
            const data = (await res.json()) as StructuredFlop;
            onStructured(data);
        } catch {
            setError(
                "Could not reach the server — try again or fill it manually."
            );
        } finally {
            setIsStructuring(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-zinc-900">
                            Tell it, we structure it
                            <span className="ml-2 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                                Recommended
                            </span>
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Dump the whole story in one go — we turn it into a
                            clean post-mortem you can review and edit.
                        </p>
                    </div>
                </div>

                <Textarea
                    value={brainDump}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={MAX_LENGTH}
                    rows={10}
                    disabled={isStructuring}
                    placeholder="Tell the story of your flop like you'd tell a friend — what it was, what you tried, what went wrong, what you learned"
                    className="bg-white resize-y min-h-[200px]"
                />
                <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-zinc-400">
                        {tooShort
                            ? `At least ${MIN_LENGTH} characters (${brainDump.trim().length}/${MIN_LENGTH})`
                            : `${brainDump.length}/${MAX_LENGTH}`}
                    </span>
                    <Button
                        type="button"
                        onClick={structure}
                        disabled={tooShort || isStructuring}
                    >
                        {isStructuring ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Structuring your story…
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Structure it for me
                            </>
                        )}
                    </Button>
                </div>

                {isStructuring && (
                    <p className="text-sm text-zinc-500">
                        Reading your story and drafting the post-mortem — this
                        usually takes 15–30 seconds. Hang tight.
                    </p>
                )}

                {error && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs uppercase tracking-wide text-zinc-400">
                    or
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                        <PenLine className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-zinc-900">
                            Fill it manually
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Prefer full control? Walk through the form step by
                            step.
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onManual}
                    disabled={isStructuring}
                >
                    Start blank
                </Button>
            </div>
        </div>
    );
}
