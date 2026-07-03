import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserBySlug } from "@/actions/action";
import { getFlopsByUserSlug, SerializedFlop } from "@/actions/flop-actions";
import { outcomeConfig } from "@/lib/config/outcome";
import { formatYears } from "@/lib/og/templates";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { LightbulbIcon } from "lucide-react";
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
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl p-6 my-8">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {/* User info */}
                <div className="pb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Image
                            src={user.avatarUrl || "/placeholder.svg"}
                            alt={user.name}
                            width={80}
                            height={80}
                            className="rounded-full ring-2 ring-white dark:ring-zinc-800"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                {user.name}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                @{user.slug}
                            </p>
                        </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg">
                        {user.bio || ""}
                    </p>
                </div>

                {/* Socials */}
                {user.socials && user.socials.length > 0 && (
                    <div className="py-6">
                        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
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
                                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
                        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                            The flops
                        </h2>
                        <div className="space-y-4">
                            {flops.map((flop) => {
                                const outcome = outcomeConfig[flop.outcome];
                                return (
                                    <Link
                                        key={flop.slug}
                                        href={`/${slug}/${flop.slug}`}
                                        className="group block rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6 transition-colors hover:border-zinc-400 dark:hover:border-zinc-500"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {flop.title}
                                                    </h3>
                                                    <span className="font-mono text-xs text-zinc-400">
                                                        {formatYears(
                                                            flop.startedYear,
                                                            flop.endedYear
                                                        )}
                                                    </span>
                                                </div>
                                                <Badge
                                                    className={cn(
                                                        "border-0 w-fit",
                                                        outcome?.badgeClass
                                                    )}
                                                >
                                                    {outcome?.label ??
                                                        flop.outcome}
                                                </Badge>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                                        </div>
                                        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
                                            {flop.oneLiner}
                                        </p>
                                        {flop.lessons?.[0] && (
                                            <div className="mt-4 flex gap-3 border-t border-dashed border-zinc-200 pt-4 dark:border-zinc-700">
                                                <LightbulbIcon className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
                        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                            Business Journey
                        </h2>
                        <div className="space-y-6">
                            {user.business.map((business) => (
                                <div
                                    key={business.name}
                                    className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                                >
                                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
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
                                        <p className="text-zinc-600 dark:text-zinc-300 my-4 ">
                                            {business.description}
                                        </p>
                                        <Separator className="mb-4" />
                                        <div>
                                            <div className="flex gap-3">
                                                <LightbulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                                                <p className="text-zinc-600 dark:text-zinc-300">
                                                    {business.lessons}
                                                </p>
                                            </div>
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
