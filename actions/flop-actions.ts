"use server";

import dbConnect from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import FlopModel, { FlopDocument } from "@/models/FlopSchema";
import User from "@/models/UserSchema";
import { FlopSchema, FlopFormValues } from "@/lib/flopValidation";
import {
    ActionResponse,
    createSuccessResponse,
    createErrorResponse,
} from "@/lib/error-utils";

export type SerializedFlop = Omit<FlopFormValues, "endedYear"> & {
    _id: string;
    clerkUserId: string;
    endedYear?: number;
    views: number;
    createdAt: string;
    updatedAt: string;
};

function serializeFlop(flop: FlopDocument | Record<string, unknown>) {
    return JSON.parse(
        JSON.stringify({
            ...flop,
            _id: String((flop as { _id: unknown })._id),
        })
    ) as SerializedFlop;
}

/** All published flops for a public profile, newest first */
export async function getFlopsByUserSlug(
    userSlug: string
): Promise<ActionResponse> {
    try {
        await dbConnect();
        const user = await User.findOne({ slug: userSlug }).lean();
        if (!user) {
            return {
                success: false,
                error: "User not found",
                errorLocation: "getFlopsByUserSlug/user",
            };
        }
        const flops = await FlopModel.find({
            clerkUserId: user.clerkUserId,
            published: true,
        })
            .sort({ endedYear: -1, createdAt: -1 })
            .lean();
        return createSuccessResponse(flops.map(serializeFlop));
    } catch (error) {
        return createErrorResponse(error, "getFlopsByUserSlug");
    }
}

/** One published flop + its owner's public profile, for /[slug]/[flopSlug] */
export async function getFlopBySlugs(
    userSlug: string,
    flopSlug: string
): Promise<ActionResponse> {
    try {
        await dbConnect();
        const user = await User.findOne({ slug: userSlug }).lean();
        if (!user) {
            return {
                success: false,
                error: "User not found",
                errorLocation: "getFlopBySlugs/user",
            };
        }
        const flop = await FlopModel.findOne({
            clerkUserId: user.clerkUserId,
            slug: flopSlug,
            published: true,
        }).lean();
        if (!flop) {
            return {
                success: false,
                error: "Flop not found",
                errorLocation: "getFlopBySlugs/flop",
            };
        }
        return createSuccessResponse({
            flop: serializeFlop(flop),
            user: {
                name: user.name,
                slug: user.slug,
                avatarUrl: user.avatarUrl ?? "",
                bio: user.bio ?? "",
            },
        });
    } catch (error) {
        return createErrorResponse(error, "getFlopBySlugs");
    }
}

/** All flops (drafts included) of the signed-in user, for the dashboard */
export async function getMyFlops(): Promise<ActionResponse> {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "getMyFlops/auth",
            };
        }
        const flops = await FlopModel.find({ clerkUserId: userId })
            .sort({ updatedAt: -1 })
            .lean();
        return createSuccessResponse(flops.map(serializeFlop));
    } catch (error) {
        return createErrorResponse(error, "getMyFlops");
    }
}

export async function getMyFlopById(flopId: string): Promise<ActionResponse> {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "getMyFlopById/auth",
            };
        }
        const flop = await FlopModel.findOne({
            _id: flopId,
            clerkUserId: userId,
        }).lean();
        if (!flop) {
            return {
                success: false,
                error: "Flop not found",
                errorLocation: "getMyFlopById/flop",
            };
        }
        return createSuccessResponse(serializeFlop(flop));
    } catch (error) {
        return createErrorResponse(error, "getMyFlopById");
    }
}

/** Create or update a flop for the signed-in user */
export async function saveFlop(
    data: FlopFormValues,
    flopId?: string
): Promise<ActionResponse> {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "saveFlop/auth",
            };
        }

        const parsed = FlopSchema.safeParse(data);
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues
                    .map((i) => `${i.path.join(".")}: ${i.message}`)
                    .join(", "),
                errorLocation: "saveFlop/validation",
            };
        }

        // Slug must be unique among this user's flops
        const clash = await FlopModel.findOne({
            clerkUserId: userId,
            slug: parsed.data.slug,
            ...(flopId ? { _id: { $ne: flopId } } : {}),
        });
        if (clash) {
            return {
                success: false,
                error: `You already have a flop with the slug "${parsed.data.slug}"`,
                errorLocation: "saveFlop/slug",
            };
        }

        const result = flopId
            ? await FlopModel.findOneAndUpdate(
                  { _id: flopId, clerkUserId: userId },
                  parsed.data,
                  { new: true, lean: true }
              )
            : ((await FlopModel.create({
                  ...parsed.data,
                  clerkUserId: userId,
              })) as FlopDocument);

        if (!result) {
            return {
                success: false,
                error: "Flop not found",
                errorLocation: "saveFlop/update",
            };
        }

        const user = await User.findOne({ clerkUserId: userId }).lean();
        revalidatePath("/dashboard");
        if (user) {
            revalidatePath(`/${user.slug}`);
            revalidatePath(`/${user.slug}/${parsed.data.slug}`);
        }
        return createSuccessResponse(
            serializeFlop(
                "toObject" in result ? result.toObject() : result
            )
        );
    } catch (error) {
        return createErrorResponse(error, "saveFlop");
    }
}

export async function deleteFlop(flopId: string): Promise<ActionResponse> {
    try {
        await dbConnect();
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "deleteFlop/auth",
            };
        }
        const deleted = await FlopModel.findOneAndDelete({
            _id: flopId,
            clerkUserId: userId,
        });
        if (!deleted) {
            return {
                success: false,
                error: "Flop not found",
                errorLocation: "deleteFlop/db",
            };
        }
        revalidatePath("/dashboard");
        return createSuccessResponse({ deleted: true });
    } catch (error) {
        return createErrorResponse(error, "deleteFlop");
    }
}

/** Fire-and-forget view counter for public flop pages */
export async function incrementFlopViews(flopId: string): Promise<void> {
    try {
        await dbConnect();
        await FlopModel.updateOne({ _id: flopId }, { $inc: { views: 1 } });
    } catch {
        // View counting must never break the page
    }
}
