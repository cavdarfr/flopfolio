// lib/config/outcome.ts
import type { FlopOutcome } from "@/models/FlopSchema";

export const outcomeConfig: Record<
    FlopOutcome,
    { label: string; badgeClass: string; cardLabel: string }
> = {
    shutdown: {
        label: "Shut down",
        badgeClass:
            "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
        cardLabel: "SHUT DOWN",
    },
    pivoted: {
        label: "Pivoted",
        badgeClass:
            "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        cardLabel: "PIVOTED",
    },
    acquired: {
        label: "Acquired",
        badgeClass:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        cardLabel: "ACQUIRED",
    },
    abandoned: {
        label: "Abandoned",
        badgeClass:
            "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
        cardLabel: "ABANDONED",
    },
    "still-running": {
        label: "Still running",
        badgeClass:
            "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        cardLabel: "STILL RUNNING",
    },
};
