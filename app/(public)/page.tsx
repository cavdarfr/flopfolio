"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    LightbulbIcon,
    UserRoundIcon,
    UsersRoundIcon,
    Check,
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
// import { Case } from "@/components/ui/cases-with-infinite-scroll";

// Dummy status configuration for business cards.
const statusConfig = {
    active: { color: "bg-green-500", label: "Active" },
    pending: { color: "bg-yellow-500", label: "Pending" },
    inactive: { color: "bg-zinc-500", label: "Inactive" },
    sold: { color: "bg-blue-500", label: "Sold" },
    cancelled: { color: "bg-purple-500", label: "Cancelled" },
    failed: { color: "bg-red-500", label: "Failed" },
};

type Business = {
    name: string;
    description: string;
    lessons: string;
    status: keyof typeof statusConfig;
    logoUrl?: string;
};

// Sample data for the business examples section.
const sampleBusinesses: Business[] = [
    {
        name: "Dinnr",
        description:
            "An on-demand ingredient delivery service for home cooking.",
        lessons: "Validate real market demand before launching a business.",
        status: "active",
        logoUrl: "/sample/dinnr.png",
    },
    {
        name: "PostRocket",
        description:
            "A Facebook marketing tool for optimizing post engagement.",
        lessons:
            "Set realistic product goals, prioritize reliability, and mitigate platform dependency risks.",
        status: "failed",
        logoUrl: "/sample/postrocket.webp",
    },
    {
        name: "Everpix",
        description: "A cloud-based photo storage and organization platform.",
        lessons:
            "A great product is not enough; marketing, user acquisition, and competitive positioning matter.",
        status: "failed",
        logoUrl: "/sample/everpix.webp",
    },
];

// BusinessCard component (using your provided code snippet as a base).
function BusinessCard({
    business,
    isPriority = false,
}: {
    business: Business;
    isPriority?: boolean;
}) {
    return (
        <div
            key={business.name}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white shadow-lg"
        >
            <div className="p-4 sm:p-6 flex flex-col flex-1 text-xs">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {business.name}
                        </h2>
                        <Badge variant="outline" className="gap-1.5 w-fit">
                            <span
                                className={cn(
                                    "inline-block h-2 w-2 rounded-full",
                                    statusConfig[business.status].color
                                )}
                                aria-hidden="true"
                            />
                            {statusConfig[business.status].label}
                        </Badge>
                    </div>
                    {business.logoUrl && (
                        <OptimizedImage
                            src={business.logoUrl}
                            alt={`${business.name} logo`}
                            width={68}
                            height={68}
                            style={{ objectFit: "contain" }}
                            className="border rounded-full w-[68px] h-[68px] mr-4"
                            isPriority={isPriority}
                        />
                    )}
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 my-4">
                    {business.description}
                </p>
                <Separator className="mb-4" />
                <div>
                    <div className="flex gap-3 ">
                        <LightbulbIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <p className="text-zinc-600 dark:text-zinc-300">
                            {business.lessons}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <main className="pt-14 px-5 md:px-5">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row gap-8 min-h-min">
                {/* Left Column */}
                <div className="flex flex-col gap-8 flex-1 w-full md:w-2/3">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl md:text-7xl tracking-tighter">
                            Celebrate Your Failures. <br />
                            Empower Your Future.
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-300 md:w-2/3">
                            Showcase your entrepreneurial journey, celebrate
                            your learnings, and grow from every setback.
                            Flopfolio helps you document your ventures—from the
                            big wins to the tough flops—and share the invaluable
                            lessons behind them.
                        </p>
                    </div>
                    <Link href="/dashboard" prefetch={true}>
                        <Button
                            className="rounded-full w-fit text-xl h-12"
                            size={"lg"}
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
                {/* Right Column */}
                <div className="grid grid-cols-1 gap-4 rounded-2xl md:px-8">
                    {sampleBusinesses.map((business, index) => (
                        <BusinessCard
                            key={business.name}
                            business={business}
                            isPriority={index === 0}
                        />
                    ))}
                </div>
            </section>

            {/* Rest of the content with code splitting */}
            <HowItWorksSection />
            <PricingSection />
            <FaqSection />
            <CtaSection />
        </main>
    );
}

// Split components for better code splitting and performance
function HowItWorksSection() {
    return (
        <section className="mt-16 md:mt-32 px-4 md:px-16 py-8 md:py-20 flex flex-col gap-6 md:gap-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-4xl lg:text-5xl tracking-tighter font-regular text-center">
                How it works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-14">
                {/* First Card */}
                <div className="flex flex-col gap-3 md:gap-8 bg-zinc-100 p-6 md:p-8 rounded-xl md:rounded-2xl shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl md:text-2xl lg:text-3xl tracking-tighter font-regular">
                            Create Your Profile
                        </h3>
                        <UserRoundIcon className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-2" />
                    </div>
                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                        Sign up and build your personalized profile that
                        reflects not only your successes but also your learning
                        experiences.
                    </p>
                </div>

                {/* Second Card */}
                <div className="flex flex-col gap-3 md:gap-8 bg-zinc-100 p-6 md:p-8 rounded-xl md:rounded-2xl shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl md:text-2xl lg:text-3xl tracking-tighter font-regular">
                            Showcase Your Projects
                        </h3>
                        <LightbulbIcon className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-2" />
                    </div>
                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                        Upload details about your ventures – from active
                        projects to those you&apos;ve had to close down. Include
                        descriptions, logos, and the lessons you learned along
                        the way.
                    </p>
                </div>

                {/* Third Card - Full Width */}
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-3 md:gap-8 bg-zinc-100 p-6 md:p-8 rounded-xl md:rounded-2xl shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl md:text-2xl lg:text-3xl tracking-tighter font-regular">
                            Connect & Inspire
                        </h3>
                        <UsersRoundIcon className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-2" />
                    </div>
                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                        Share your Flopfolio link just like a Linktree. Let
                        investors, collaborators, or fellow entrepreneurs
                        discover your story and the wisdom you&apos;ve gained
                        from every stumble.
                    </p>
                </div>
            </div>
        </section>
    );
}

// Pricing Section Component
function PricingSection() {
    return (
        <section className="mt-32 px-5 md:px-16 py-20 flex flex-col gap-12 min-h-min">
            <div className="text-center">
                <h2 className="text-2xl md:text-4xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-center mx-auto">
                    Choose the plan that&apos;s right for you
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mt-4 md:w-2/3 mx-auto">
                    Start with our free MVP plan and scale as you grow. No
                    hidden fees or commitments. Upgrade or downgrade at any
                    time.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Free MVP Plan Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col">
                    <div className="text-center mb-6">
                        <h3 className="text-3xl font-semibold mb-2">
                            Free MVP
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-300">
                            For entrepreneurs starting their journey
                        </p>
                        <p className="text-4xl font-bold mt-4">$0</p>
                        <Badge variant="secondary" className="mt-2">
                            Currently MVP
                        </Badge>
                    </div>
                    <ul className="mb-8 space-y-3 flex-grow">
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            Create & Showcase Projects
                        </li>
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            Personalized Flopfolio Link
                        </li>
                        <li className="flex items-center gap-2 text-zinc-500 line-through dark:text-zinc-400">
                            <Check
                                className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
                                aria-hidden="true"
                            />
                            <s>Custom Domain Support</s>{" "}
                            <Badge variant="outline">Soon</Badge>
                        </li>
                    </ul>
                    <Link href="/sign-up" className="mt-auto">
                        <Button className="w-full rounded-full">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Growth Plan Card - Disabled for MVP */}
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col opacity-60">
                    <div className="text-center mb-6">
                        <h3 className="text-3xl font-semibold mb-2">Growth</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">
                            For serious entrepreneurs
                        </p>
                        <p className="text-4xl font-bold mt-4">$9</p>
                        <Badge variant="outline" className="mt-2">
                            Coming Soon
                        </Badge>
                    </div>
                    <ul className="mb-8 space-y-3 flex-grow">
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            All Free Features
                        </li>
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            Custom Domain Support
                        </li>
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            Advanced Analytics
                        </li>
                    </ul>
                    <Button
                        className="w-full rounded-full"
                        variant="outline"
                        disabled
                    >
                        Coming Soon
                    </Button>
                </div>

                {/* Pro Plan Card - Disabled for MVP */}
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col opacity-60">
                    <div className="text-center mb-6">
                        <h3 className="text-3xl font-semibold mb-2">Pro</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">
                            For professional entrepreneurs
                        </p>
                        <p className="text-4xl font-bold mt-4">$29</p>
                        <Badge variant="outline" className="mt-2">
                            Coming Soon
                        </Badge>
                    </div>
                    <ul className="mb-8 space-y-3 flex-grow">
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            All Growth Features
                        </li>
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            Priority Support
                        </li>
                        <li className="flex items-center gap-2">
                            <Check
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                            API Access
                        </li>
                    </ul>
                    <Button
                        className="w-full rounded-full"
                        variant="outline"
                        disabled
                    >
                        Coming Soon
                    </Button>
                </div>
            </div>
        </section>
    );
}

// FAQ Section Component
function FaqSection() {
    return (
        <section className="mt-32 px-5 md:px-16 py-20 flex flex-col gap-12 min-h-min">
            <div className="text-center">
                <h2 className="text-2xl md:text-4xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-center mx-auto">
                    Frequently Asked Questions
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mt-4 md:w-2/3 mx-auto">
                    Have questions? We&apos;ve got answers.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* FAQ Item 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">
                        What is Flopfolio?
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                        Flopfolio is a platform that helps entrepreneurs
                        showcase their journey, including both successes and
                        failures, to help others learn from their experiences.
                    </p>
                </div>

                {/* FAQ Item 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">
                        Is Flopfolio free to use?
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                        Yes, Flopfolio is currently free to use as we are in the
                        MVP stage. We plan to introduce paid plans with
                        additional features in the future.
                    </p>
                </div>

                {/* FAQ Item 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">
                        How do I get started?
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                        Simply sign up for an account, create your profile, and
                        start adding your projects. You can then share your
                        Flopfolio link with others.
                    </p>
                </div>

                {/* FAQ Item 4 */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">
                        Can I use a custom domain?
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                        Custom domain support is coming soon as part of our paid
                        plans. Stay tuned for updates!
                    </p>
                </div>
            </div>
        </section>
    );
}

// CTA Section Component
function CtaSection() {
    return (
        <section className="mt-32 px-5 md:px-16 py-20 flex flex-col gap-8 min-h-min bg-white rounded-2xl shadow-lg">
            <div className="text-center">
                <h2 className="text-2xl md:text-4xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-center mx-auto">
                    Ready to showcase your journey?
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mt-4 md:w-2/3 mx-auto">
                    Join Flopfolio today and start sharing your entrepreneurial
                    story with the world.
                </p>
            </div>
            <div className="flex justify-center">
                <Link href="/sign-up">
                    <Button className="rounded-full text-xl h-12" size={"lg"}>
                        Get Started
                    </Button>
                </Link>
            </div>
        </section>
    );
}
