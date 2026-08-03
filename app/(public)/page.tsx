import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEMO_NOTICE, DEMO_SHOWCASES } from "@/lib/demo/fixtures";

// Mini tombstone — the share-card art direction shrunk into a list card.
function TombstoneCard({
    flop,
}: {
    flop: (typeof DEMO_SHOWCASES)[number];
}) {
    return (
        <div
            className={cn(
                "border-2 border-ink bg-surface p-6 shadow-slab transition-transform duration-200 hover:rotate-0",
                flop.tilt
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] lowercase tracking-[0.3em] text-faint">
                    flopfolio
                </span>
                <span className="rounded-full border-2 border-ink px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                    {flop.outcome}
                </span>
            </div>
            <h2 className="mt-4 font-display text-2xl uppercase tracking-tight">
                {flop.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-muted">
                † {flop.years}
            </p>
            <p className="mt-3 text-sm text-muted">{flop.oneLiner}</p>
            <div className="mt-4 border-t border-dashed border-faint pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermilion">
                    Lesson
                </p>
                <p className="mt-1 text-sm font-medium">{flop.lesson}</p>
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <main className="px-5 pt-14 md:px-5">
            {/* Hero Section */}
            <section className="flex min-h-min flex-col gap-12 md:flex-row">
                {/* Left Column */}
                <div className="flex w-full flex-1 flex-col gap-8 md:w-2/3">
                    <div className="flex flex-col gap-5">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">
                            The portfolio of post-mortems
                        </p>
                        <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl">
                            Celebrate your{" "}
                            <span className="text-vermilion-bright">
                                failures.
                            </span>
                            <br />
                            Empower your future.
                        </h1>
                        <p className="text-muted md:w-2/3">
                            Showcase your entrepreneurial journey, celebrate
                            your learnings, and grow from every setback.
                            Flopfolio helps you document your ventures—from the
                            big wins to the tough flops—and share the invaluable
                            lessons behind them.
                        </p>
                    </div>
                    <Link href="/dashboard" prefetch={true}>
                        <Button className="w-fit" size={"lg"}>
                            Get Started
                        </Button>
                    </Link>
                </div>
                {/* Right Column */}
                <div className="grid grid-cols-1 gap-6 md:px-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        {DEMO_NOTICE}
                    </p>
                    {DEMO_SHOWCASES.map((flop) => (
                        <TombstoneCard key={flop.name} flop={flop} />
                    ))}
                </div>
            </section>

            <HowItWorksSection />
            <MvpSection />
            <FaqSection />
            <CtaSection />
        </main>
    );
}

const steps = [
    {
        num: "01",
        title: "Create Your Profile",
        text: "Sign up and build your personalized profile that reflects not only your successes but also your learning experiences.",
    },
    {
        num: "02",
        title: "Showcase Your Projects",
        text: "Upload details about your ventures – from active projects to those you've had to close down. Include descriptions, logos, and the lessons you learned along the way.",
    },
    {
        num: "03",
        title: "Connect & Inspire",
        text: "Share your Flopfolio link just like a Linktree. Let investors, collaborators, or fellow entrepreneurs discover your story and the wisdom you've gained from every stumble.",
    },
];

function HowItWorksSection() {
    return (
        <section className="mt-16 flex flex-col gap-8 md:mt-32">
            <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">
                    How it works
                </span>
                <div className="h-[2px] flex-1 bg-ink" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {steps.map((step) => (
                    <div
                        key={step.num}
                        className="flex flex-col gap-4 border-2 border-ink bg-surface p-6 md:p-8"
                    >
                        <span className="font-display text-4xl text-faint">
                            {step.num}
                        </span>
                        <h3 className="font-display text-lg uppercase tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-sm text-muted">{step.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function MvpSection() {
    return (
        <section className="mt-16 flex min-h-min flex-col gap-12 md:mt-32">
            <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">
                    Available now
                </span>
                <div className="h-[2px] flex-1 bg-ink" aria-hidden="true" />
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 border-2 border-ink bg-surface shadow-slab md:grid-cols-[0.8fr_1.2fr]">
                <div className="flex flex-col justify-between border-b-2 border-ink bg-vermilion-bright p-8 text-cream md:border-r-2 md:border-b-0">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.25em]">
                            One honest offer
                        </p>
                        <h2 className="mt-4 font-display text-4xl uppercase tracking-tight">
                            Free MVP
                        </h2>
                        <p className="mt-4 text-cream/85">
                            Use the product as it exists today. No paid tier,
                            billing flow, or unimplemented upgrade promise.
                        </p>
                    </div>
                    <Link href="/sign-up" className="mt-8">
                        <Button className="w-full border-cream bg-cream text-vermilion-bright hover:bg-transparent hover:text-cream">
                            Create a free profile
                        </Button>
                    </Link>
                </div>
                <div className="p-8 md:p-10">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-faint">
                        Included in the MVP
                    </p>
                    <ul className="mt-6 grid gap-4 font-mono text-sm sm:grid-cols-2">
                        {[
                            "Structured post-mortem wizard",
                            "Draft and published states",
                            "Personal public profile",
                            "Public post-mortem page",
                            "Three social-card designs",
                            "Downloadable image ratios",
                        ].map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                                <span className="text-vermilion" aria-hidden="true">
                                    +
                                </span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

const faqs = [
    {
        q: "What is Flopfolio?",
        a: "Flopfolio is a platform that helps entrepreneurs showcase their journey, including both successes and failures, to help others learn from their experiences.",
    },
    {
        q: "Is Flopfolio free to use?",
        a: "Yes. The current MVP is free to use and does not include billing or paid tiers.",
    },
    {
        q: "How do I get started?",
        a: "Simply sign up for an account, create your profile, and start adding your projects. You can then share your Flopfolio link with others.",
    },
    {
        q: "What can I share?",
        a: "Each published post-mortem has a public page, social links, and downloadable cards in landscape, square, and portrait formats.",
    },
];

// FAQ Section Component
function FaqSection() {
    return (
        <section className="mt-16 flex min-h-min flex-col gap-12 md:mt-32">
            <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">
                    FAQ
                </span>
                <div className="h-[2px] flex-1 bg-ink" aria-hidden="true" />
            </div>
            <div className="text-center">
                <h2 className="mx-auto font-display text-2xl uppercase tracking-tight md:text-4xl lg:max-w-2xl">
                    Frequently Asked Questions
                </h2>
                <p className="mx-auto mt-4 text-muted md:w-2/3">
                    Have questions? We&apos;ve got answers.
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                {faqs.map((faq, i) => (
                    <div
                        key={faq.q}
                        className="border-2 border-ink bg-surface p-8"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                            Q{String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 font-display text-base uppercase tracking-tight">
                            {faq.q}
                        </h3>
                        <p className="mt-3 text-sm text-muted">{faq.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// CTA Section Component — editorial art direction: vermilion ground, serif pull-quote
function CtaSection() {
    return (
        <section className="mt-16 flex min-h-min flex-col gap-8 border-2 border-ink bg-vermilion-bright px-5 py-16 text-cream shadow-slab md:mt-32 md:px-16 md:py-20">
            <div className="text-center">
                <p className="font-serif text-2xl italic md:text-3xl">
                    “Every flop is a lesson someone else needs.”
                </p>
                <h2 className="mx-auto mt-6 font-display text-2xl uppercase tracking-tight md:text-4xl lg:max-w-2xl">
                    Ready to showcase your journey?
                </h2>
                <p className="mx-auto mt-4 text-cream/85 md:w-2/3">
                    Try the free MVP with a clearly marked fictional example,
                    then publish a post-mortem you can share.
                </p>
            </div>
            <div className="flex justify-center">
                <Link href="/sign-up">
                    <Button
                        size={"lg"}
                        className="border-cream bg-cream text-vermilion-bright shadow-slab-sm hover:bg-transparent hover:text-cream"
                    >
                        Get Started
                    </Button>
                </Link>
            </div>
        </section>
    );
}
