import type { FlopFormValues } from "@/lib/flopValidation";
import type { UserFormValues } from "@/lib/userValidation";

export const DEMO_NOTICE =
    "Fictional demo data — CloudCrate and Mira Vale do not represent a real company or person.";

export function buildDemoProfile(userId?: string): UserFormValues {
    const suffix = userId
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(-6);

    return {
        name: "Mira Vale — fictional demo",
        slug: `mira-demo${suffix ? `-${suffix}` : ""}`,
        bio: "Fictional founder documenting the lessons behind CloudCrate. Demo data only.",
        avatarUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=mira-vale-demo",
        socials: [],
        business: [],
    };
}

export const DEMO_FLOP: FlopFormValues = {
    slug: "cloudcrate-fictional-demo",
    title: "CloudCrate — fictional demo",
    oneLiner:
        "A file-sharing workspace built for construction crews who preferred their existing group chats.",
    sector: "B2B SaaS",
    startedYear: 2022,
    endedYear: 2024,
    outcome: "shutdown",
    causeOfFailure: "Solved the wrong workflow",
    story: {
        context:
            "CloudCrate was a fictional workspace for small construction teams to share plans, site photos, and daily updates in one place.",
        attempt:
            "The fictional team interviewed ten contractors, built a mobile-first prototype, and ran a twelve-week pilot with three volunteer crews.",
        downfall:
            "Crews kept returning to their existing group chats. The product added structure, but not enough value to justify changing a familiar workflow.",
    },
    lessons: [
        "A repeated workaround is not automatically a problem people will pay to replace.",
        "Test the cost of switching habits before investing in product depth.",
    ],
    wouldDoDifferently:
        "Start with a lightweight add-on to the tools crews already use, then measure whether structured handoffs create enough value to earn a standalone product.",
    costs: {
        monthsSpent: 18,
        moneyLost: "$12,000 (fictional)",
    },
    logoUrl: "",
    cardTemplate: "tombstone",
    published: true,
};

export const DEMO_SHOWCASES = [
    {
        name: "CloudCrate",
        years: "2022 – 2024",
        outcome: "Shut down",
        oneLiner: "File sharing for construction crews who stayed in group chats.",
        lesson: "Test the cost of changing habits before building deeply.",
        tilt: "-rotate-1",
    },
    {
        name: "Dinnr Dash",
        years: "2021 – 2022",
        outcome: "Abandoned",
        oneLiner: "A meal-planning app with more recipes than recurring users.",
        lesson: "Retention deserves validation before content scale.",
        tilt: "rotate-1",
    },
    {
        name: "QuietLaunch",
        years: "2023 – 2023",
        outcome: "Pivoted",
        oneLiner: "A launch platform built before its audience existed.",
        lesson: "Distribution is part of the product, not a post-launch task.",
        tilt: "-rotate-[0.5deg]",
    },
] as const;
