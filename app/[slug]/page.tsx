import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserBySlug } from "@/actions/action";
import { getFlopsByUserSlug, SerializedFlop } from "@/actions/flop-actions";
import { outcomeConfig } from "@/lib/config/outcome";
import { formatYears } from "@/lib/og/templates";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GitHubIcon from "@/components/icons/GitHubIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import XTwitterIcon from "@/components/icons/XTwitterIcon";
import { statusConfig } from "@/lib/config/status";
import type { Metadata } from "next";
import { UserFormValues } from "@/lib/userValidation";
import { SocialType } from "@/lib/config/socials";

const socialIcons = {
    github: GitHubIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
    twitter: XTwitterIcon,
};

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
    const { slug } = await params;

    const response = await getUserBySlug(slug);

    // Check if the response was successful and has data
    if (!response.success || !response.data) {
        notFound();
    }

    // Cast the data to UserFormValues type
    const user = response.data as UserFormValues;

    const flopsResponse = await getFlopsByUserSlug(slug);
    const flops = (
        flopsResponse.success ? (flopsResponse.data ?? []) : []
    ) as SerializedFlop[];

    return (
        <div className="w-full max-w-2xl mx-auto bg-surface border-2 border-ink shadow-slab p-6 my-8">
            <div className="divide-y divide-line">
                {/* User info */}
                <div className="pb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Image
                            src={user.avatarUrl || "/placeholder.svg"}
                            alt={user.name}
                            width={80}
                            height={80}
                            className="border-2 border-ink"
                        />
                        <div>
                            <h1 className="font-display text-2xl uppercase tracking-tight">
                                {user.name}
                            </h1>
                            <p className="font-mono text-sm text-faint">
                                @{user.slug}
                            </p>
                        </div>
                    </div>
                    <p className="text-lg text-muted">{user.bio || ""}</p>
                </div>

                {/* Socials */}
                {user.socials && user.socials.length > 0 && (
                    <div className="py-6">
                        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-faint">
                            My Socials
                        </h2>
                        <div className="flex items-center gap-4">
                            {user.socials.map((social) => {
                                const socialName = social.name as SocialType;
                                const Icon = socialIcons[socialName];
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 transition-colors hover:text-vermilion"
                                    >
                                        <Icon size={34} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Flops (post-mortems) */}
                {flops.length > 0 && (
                    <div className="pt-6">
                        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-faint">
                            The flops
                        </h2>
                        <div className="space-y-5">
                            {flops.map((flop) => {
                                const outcome = outcomeConfig[flop.outcome];
                                return (
                                    <Link
                                        key={flop.slug}
                                        href={`/${slug}/${flop.slug}`}
                                        className="group block border-2 border-ink bg-bone p-4 transition-all hover:-translate-y-[2px] hover:shadow-slab-sm sm:p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap items-baseline gap-3">
                                                    <h3 className="font-display text-xl uppercase tracking-tight">
                                                        {flop.title}
                                                    </h3>
                                                    <span className="font-mono text-xs text-faint">
                                                        †{" "}
                                                        {formatYears(
                                                            flop.startedYear,
                                                            flop.endedYear
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="w-fit rounded-full border-2 border-ink px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                                                    {outcome?.label ??
                                                        flop.outcome}
                                                </span>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 shrink-0 text-faint transition-colors group-hover:text-vermilion" />
                                        </div>
                                        <p className="mt-3 text-muted">
                                            {flop.oneLiner}
                                        </p>
                                        {flop.lessons?.[0] && (
                                            <div className="mt-4 border-t border-dashed border-faint pt-3">
                                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermilion">
                                                    Lesson
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {flop.lessons[0]}
                                                </p>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Legacy business entries (pre-flop format) */}
                {flops.length === 0 && user.business && user.business.length > 0 && (
                    <div className="pt-6">
                        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-faint">
                            Business Journey
                        </h2>
                        <div className="space-y-6">
                            {user.business.map((business) => (
                                <div
                                    key={business.name}
                                    className="border-2 border-ink bg-bone overflow-hidden"
                                >
                                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-display text-xl uppercase tracking-tight">
                                                    {business.name}
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1.5 w-fit"
                                                >
                                                    <span
                                                        className={cn(
                                                            "size-2 rounded-full bg-amber-500",
                                                            statusConfig[
                                                                business.status as keyof typeof statusConfig
                                                            ]?.color
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {
                                                        statusConfig[
                                                            business.status as keyof typeof statusConfig
                                                        ]?.label
                                                    }
                                                </Badge>
                                            </div>
                                            {business.logoUrl && (
                                                <Image
                                                    src={business.logoUrl}
                                                    alt={business.name}
                                                    width={68}
                                                    height={68}
                                                    className={
                                                        "border rounded-full w-20 h-20 mr-4"
                                                    }
                                                />
                                            )}
                                        </div>
                                        <p className="text-muted my-4 ">
                                            {business.description}
                                        </p>
                                        <div className="border-t border-dashed border-faint pt-3">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermilion">
                                                Lesson
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {business.lessons}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { slug } = await params;

    const response = await getUserBySlug(slug);

    // Check if the response was successful and has data
    if (!response.success || !response.data) {
        return {
            title: "User Not Found",
            description: "The requested user profile could not be found.",
        };
    }

    // Cast the data to UserFormValues type
    const user = response.data as UserFormValues;

    return {
        title: `${user.name}'s Portfolio`,
        description:
            user.bio ||
            `Check out ${user.name}'s entrepreneurial journey on Flopfolio`,
        openGraph: {
            title: `${user.name}'s Portfolio | Flopfolio`,
            description:
                user.bio ||
                `Check out ${user.name}'s entrepreneurial journey on Flopfolio`,
            images: user.avatarUrl ? [{ url: user.avatarUrl }] : [],
        },
    };
}
