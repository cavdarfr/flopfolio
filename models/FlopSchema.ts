import mongoose, { Schema, Model, Document } from "mongoose";

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

export interface FlopDocument extends Document {
    clerkUserId: string;
    slug: string;
    title: string;
    oneLiner: string;
    sector?: string;
    startedYear: number;
    endedYear?: number;
    outcome: FlopOutcome;
    causeOfFailure: string;
    story: {
        context: string;
        attempt: string;
        downfall: string;
    };
    lessons: string[];
    wouldDoDifferently?: string;
    costs: {
        monthsSpent?: number;
        moneyLost?: string;
    };
    logoUrl?: string;
    cardTemplate: CardTemplate;
    published: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const FlopSchema: Schema = new Schema(
    {
        clerkUserId: { type: String, required: true, index: true },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 80,
            match: [
                /^[a-z0-9]+(-[a-z0-9]+)*$/,
                "Please use a valid slug format (e.g., 'my-failed-startup')",
            ],
        },
        title: { type: String, required: true, trim: true, maxlength: 80 },
        oneLiner: { type: String, required: true, trim: true, maxlength: 140 },
        sector: { type: String, trim: true, maxlength: 60 },
        startedYear: { type: Number, required: true, min: 1970, max: 2100 },
        endedYear: { type: Number, min: 1970, max: 2100 },
        outcome: {
            type: String,
            enum: FLOP_OUTCOMES,
            required: true,
            default: "shutdown",
        },
        causeOfFailure: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        story: {
            context: { type: String, required: true, maxlength: 2000 },
            attempt: { type: String, required: true, maxlength: 2000 },
            downfall: { type: String, required: true, maxlength: 2000 },
        },
        lessons: {
            type: [{ type: String, trim: true, maxlength: 220 }],
            validate: {
                validator: (v: string[]) => v.length >= 1 && v.length <= 3,
                message: "A flop needs between 1 and 3 lessons",
            },
        },
        wouldDoDifferently: { type: String, maxlength: 1000 },
        costs: {
            monthsSpent: { type: Number, min: 0, max: 600 },
            moneyLost: { type: String, trim: true, maxlength: 40 },
        },
        logoUrl: { type: String, default: "" },
        cardTemplate: {
            type: String,
            enum: CARD_TEMPLATES,
            default: "tombstone",
        },
        published: { type: Boolean, default: true },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// One slug per user — the public URL is /[userSlug]/[flopSlug]
FlopSchema.index({ clerkUserId: 1, slug: 1 }, { unique: true });

const FlopModel: Model<FlopDocument> =
    mongoose.models.Flop || mongoose.model<FlopDocument>("Flop", FlopSchema);

export default FlopModel;
