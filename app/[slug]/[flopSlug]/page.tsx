import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
    getFlopBySlugs,
    SerializedFlop,
} from "@/actions/flop-actions";
import { outcomeConfig } from "@/lib/config/outcome";
import { formatYears } from "@/lib/og/templates";
import ShareBar from "@/components/flop/ShareBar";
import ViewTracker from "@/components/flop/ViewTracker";
import { canonicalPostUrl } from "@/lib/share/share-pack";
import { ArrowLeft, Eye } from "lucide-react";

type Params = Promise<{ slug: string; flopSlug: string }>;

type FlopPageData = {
    flop: SerializedFlop;
    user: { name: string; slug: string; avatarUrl: string; bio: string };
};

const storySections = [
    { key: "context", label: "The idea" },
    { key: "attempt", label: "The execution" },
    { key: "downfall", label: "The downfall" },
] as const;

export default async function FlopPage({ params }: { params: Params }) {
    const { slug, flopSlug } = await params;
    const response = await getFlopBySlugs(slug, flopSlug);
    if (!response.success || !response.data) notFound();

    const { flop, user } = response.data as FlopPageData;
    const outcome = outcomeConfig[flop.outcome];

    const canonicalUrl = canonicalPostUrl(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        user.slug,
        flop.slug
    );

    return (
        <article className="w-full max-w-2xl mx-auto my-8 px-1">
            <ViewTracker userSlug={user.slug} flopSlug={flop.slug} />
            {/* Back to profile */}
            <Link
                href={`/${user.slug}`}
                className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-vermilion"
            >
                <ArrowLeft className="h-4 w-4" />
                {user.avatarUrl && (
                    <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={20}
                        height={20}
                        className="border border-ink"
                    />
                )}
                {user.name}
            </Link>

            <div className="border-2 border-ink bg-surface p-6 shadow-slab sm:p-10">
                {/* Header */}
                <header>
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border-2 border-ink px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                            {outcome?.label ?? flop.outcome}
                        </span>
                        <span className="font-mono text-sm text-faint">
                            † {formatYears(flop.startedYear, flop.endedYear)}
                        </span>
                        {flop.sector && (
                            <span className="rounded-full border border-faint px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                                {flop.sector}
                            </span>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-faint">
                            <Eye className="h-3.5 w-3.5" />
                            {flop.views}
                        </span>
                    </div>
                    <h1 className="font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-4xl">
                        {flop.title}
                    </h1>
                    <p className="mt-3 text-lg text-muted">{flop.oneLiner}</p>

                    <div className="mt-6 border-2 border-vermilion bg-vermilion/5 px-4 py-3">
                        <p className="font-mono text-xs uppercase tracking-widest text-vermilion">
                            Cause of death
                        </p>
                        <p className="mt-1 font-medium">
                            {flop.causeOfFailure}
                        </p>
                    </div>

                    <div className="mt-6">
                        <ShareBar
                            userSlug={user.slug}
                            flopSlug={flop.slug}
                            title={flop.title}
                            oneLiner={flop.oneLiner}
                            lesson={flop.lessons?.[0]}
                            canonicalUrl={canonicalUrl}
                            updatedAt={flop.updatedAt}
                        />
                    </div>
                </header>

                <div className="my-8 h-[2px] bg-ink" aria-hidden="true" />

                {/* Story */}
                <div className="space-y-8">
                    {storySections.map(({ key, label }) => (
                        <section key={key}>
                            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">
                                {label}
                            </h2>
                            <p className="whitespace-pre-line leading-relaxed text-muted">
                                {flop.story[key]}
                            </p>
                        </section>
                    ))}
                </div>

                <div className="my-8 h-[2px] bg-ink" aria-hidden="true" />

                {/* Lessons — editorial art direction: serif pull-quotes */}
                <section>
                    <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-faint">
                        Lessons learned
                    </h2>
                    <div className="space-y-4">
                        {flop.lessons.map((lesson, i) => (
                            <blockquote
                                key={i}
                                className="flex gap-4 border-l-4 border-vermilion-bright py-1 pl-4"
                            >
                                <span className="select-none font-mono text-sm text-faint">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="font-serif text-xl italic leading-snug">
                                    {lesson}
                                </p>
                            </blockquote>
                        ))}
                    </div>
                </section>

                {/* Hindsight + costs */}
                {(flop.wouldDoDifferently ||
                    flop.costs?.monthsSpent !== undefined ||
                    flop.costs?.moneyLost) && (
                    <>
                        <div className="my-8 h-[2px] bg-ink" aria-hidden="true" />
                        <section className="space-y-6">
                            {flop.wouldDoDifferently && (
                                <div>
                                    <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">
                                        With hindsight
                                    </h2>
                                    <p className="whitespace-pre-line leading-relaxed text-muted">
                                        {flop.wouldDoDifferently}
                                    </p>
                                </div>
                            )}
                            {(flop.costs?.monthsSpent !== undefined ||
                                flop.costs?.moneyLost) && (
                                <div className="flex gap-8">
                                    {flop.costs?.monthsSpent !== undefined && (
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-widest text-faint">
                                                Time spent
                                            </p>
                                            <p className="mt-1 font-display text-2xl tabular-nums">
                                                {flop.costs.monthsSpent} mo
                                            </p>
                                        </div>
                                    )}
                                    {flop.costs?.moneyLost && (
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-widest text-faint">
                                                Money lost
                                            </p>
                                            <p className="mt-1 font-display text-2xl tabular-nums">
                                                {flop.costs.moneyLost}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </article>
    );
}

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { slug, flopSlug } = await params;
    const response = await getFlopBySlugs(slug, flopSlug);
    if (!response.success || !response.data) {
        return { title: "Flop not found" };
    }
    const { flop, user } = response.data as FlopPageData;
    const title = `${flop.title} — a flop by ${user.name}`;
    return {
        title,
        description: flop.oneLiner,
        openGraph: {
            title: `${title} | Flopfolio`,
            description: flop.oneLiner,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: flop.oneLiner,
        },
    };
}
