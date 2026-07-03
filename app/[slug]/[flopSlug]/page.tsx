import { notFound } from "next/navigation";
import { after } from "next/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
    getFlopBySlugs,
    incrementFlopViews,
    SerializedFlop,
} from "@/actions/flop-actions";
import { outcomeConfig } from "@/lib/config/outcome";
import { formatYears } from "@/lib/og/templates";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ShareBar from "@/components/flop/ShareBar";
import { ArrowLeft, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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

    after(() => incrementFlopViews(flop._id));

    return (
        <article className="w-full max-w-2xl mx-auto my-8 px-1">
            {/* Back to profile */}
            <Link
                href={`/${user.slug}`}
                className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                {user.avatarUrl && (
                    <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                    />
                )}
                {user.name}
            </Link>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl p-6 sm:p-10">
                {/* Header */}
                <header>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className={cn("border-0", outcome?.badgeClass)}>
                            {outcome?.label ?? flop.outcome}
                        </Badge>
                        <span className="font-mono text-sm text-zinc-500">
                            {formatYears(flop.startedYear, flop.endedYear)}
                        </span>
                        {flop.sector && (
                            <Badge variant="outline">{flop.sector}</Badge>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-400">
                            <Eye className="h-3.5 w-3.5" />
                            {flop.views}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {flop.title}
                    </h1>
                    <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300">
                        {flop.oneLiner}
                    </p>

                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/40">
                        <p className="font-mono text-xs uppercase tracking-widest text-red-500 dark:text-red-400">
                            Cause of death
                        </p>
                        <p className="mt-1 font-medium text-red-800 dark:text-red-200">
                            {flop.causeOfFailure}
                        </p>
                    </div>

                    <div className="mt-6">
                        <ShareBar
                            userSlug={user.slug}
                            flopSlug={flop.slug}
                            title={flop.title}
                            lesson={flop.lessons?.[0]}
                        />
                    </div>
                </header>

                <Separator className="my-8" />

                {/* Story */}
                <div className="space-y-8">
                    {storySections.map(({ key, label }) => (
                        <section key={key}>
                            <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                                {label}
                            </h2>
                            <p className="whitespace-pre-line leading-relaxed text-zinc-700 dark:text-zinc-300">
                                {flop.story[key]}
                            </p>
                        </section>
                    ))}
                </div>

                <Separator className="my-8" />

                {/* Lessons */}
                <section>
                    <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4">
                        Lessons learned
                    </h2>
                    <div className="space-y-3">
                        {flop.lessons.map((lesson, i) => (
                            <blockquote
                                key={i}
                                className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 flex gap-4"
                            >
                                <span className="font-mono text-sm text-zinc-300 dark:text-zinc-600 select-none">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="text-zinc-800 dark:text-zinc-200 font-medium">
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
                        <Separator className="my-8" />
                        <section className="space-y-6">
                            {flop.wouldDoDifferently && (
                                <div>
                                    <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                                        With hindsight
                                    </h2>
                                    <p className="whitespace-pre-line leading-relaxed text-zinc-700 dark:text-zinc-300">
                                        {flop.wouldDoDifferently}
                                    </p>
                                </div>
                            )}
                            {(flop.costs?.monthsSpent !== undefined ||
                                flop.costs?.moneyLost) && (
                                <div className="flex gap-8">
                                    {flop.costs?.monthsSpent !== undefined && (
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                                                Time spent
                                            </p>
                                            <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                                                {flop.costs.monthsSpent} mo
                                            </p>
                                        </div>
                                    )}
                                    {flop.costs?.moneyLost && (
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                                                Money lost
                                            </p>
                                            <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
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
