import { notFound } from "next/navigation";
import { getUserBySlug } from "@/actions/action";
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
import { Social, Business } from "@/lib/types/user";
import type { Metadata } from "next";

const socialIcons = {
    github: GitHubIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
    twitter: XTwitterIcon,
};

export default async function Page({
    params,
}: {
    params: { slug: string };
}) {
    const slug = params.slug;
    const user = await getUserBySlug(slug);
    if (!user) {
        notFound();
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl p-6 my-8">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {/* User info */}
                <div className="pb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Image
                            src={user.avatarUrl}
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
                        {user.bio}
                    </p>
                </div>

                {/* Socials */}
                <div className="py-6">
                    <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                        My Socials
                    </h2>
                    <div className="flex items-center gap-4">
                        {user.socials.map((social: Social) => {
                            const Icon = socialIcons[social.name];
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

                {/* Business */}
                <div className="pt-6">
                    <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                        Business Journey
                    </h2>
                    <div className="space-y-6">
                        {user.business.map((business: Business) => (
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
                                                src={business.logoUrl || ""}
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
            </div>
        </div>
    );
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const user = await getUserBySlug(params.slug);

    if (!user) {
        return {
            title: "User Not Found",
            description: "The requested user profile could not be found.",
        };
    }

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
            images: [{ url: user.avatarUrl }],
        },
    };
}
