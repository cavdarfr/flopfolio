// Client-safe flop constants and types.
// Do not import Mongoose models here — this module is used by client components.

export const FLOP_OUTCOMES = [
    "shutdown",
    "pivoted",
    "acquired",
    "abandoned",
    "still-running",
] as const;

export type FlopOutcome = (typeof FLOP_OUTCOMES)[number];

export const CARD_TEMPLATES = ["tombstone", "autopsy", "editorial"] as const;
export type CardTemplate = (typeof CARD_TEMPLATES)[number];
