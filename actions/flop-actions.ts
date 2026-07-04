"use server";

import { fetchQuery, fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { convexAuthToken } from "@/lib/convex-server";
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

function serializeFlop(doc: Doc<"flops">): SerializedFlop {
    const { _creationTime, createdAt, updatedAt, ...rest } = doc;
    return {
        ...rest,
        createdAt: new Date(createdAt ?? _creationTime).toISOString(),
        updatedAt: new Date(updatedAt ?? _creationTime).toISOString(),
    } as SerializedFlop;
}

/** All published flops for a public profile, newest first */
export async function getFlopsByUserSlug(
    userSlug: string
): Promise<ActionResponse> {
    try {
        const flops = await fetchQuery(api.flops.listPublishedByUserSlug, {
            userSlug,
        });
        if (!flops) {
            return {
                success: false,
                error: "User not found",
                errorLocation: "getFlopsByUserSlug/user",
            };
        }
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
        const result = await fetchQuery(api.flops.getBySlugs, {
            userSlug,
            flopSlug,
        });
        if ("error" in result) {
            return {
                success: false,
                error: result.error,
                errorLocation:
                    result.error === "User not found"
                        ? "getFlopBySlugs/user"
                        : "getFlopBySlugs/flop",
            };
        }
        return createSuccessResponse({
            flop: serializeFlop(result.flop),
            user: result.user,
        });
    } catch (error) {
        return createErrorResponse(error, "getFlopBySlugs");
    }
}

/** All flops (drafts included) of the signed-in user, for the dashboard */
export async function getMyFlops(): Promise<ActionResponse> {
    try {
        const token = await convexAuthToken();
        const flops = token
            ? await fetchQuery(api.flops.listMine, {}, { token })
            : null;
        if (!flops) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "getMyFlops/auth",
            };
        }
        return createSuccessResponse(flops.map(serializeFlop));
    } catch (error) {
        return createErrorResponse(error, "getMyFlops");
    }
}

export async function getMyFlopById(flopId: string): Promise<ActionResponse> {
    try {
        const token = await convexAuthToken();
        if (!token) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "getMyFlopById/auth",
            };
        }
        const flop = await fetchQuery(
            api.flops.getMine,
            { flopId: flopId as Id<"flops"> },
            { token }
        );
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
        const token = await convexAuthToken();
        if (!token) {
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

        const result = await fetchMutation(
            api.flops.save,
            {
                ...parsed.data,
                flopId: flopId ? (flopId as Id<"flops">) : undefined,
            },
            { token }
        );

        if (!result.ok || !result.flop) {
            return {
                success: false,
                error: result.ok ? "Flop not found" : result.error,
                errorLocation: "saveFlop/update",
            };
        }

        const user = await fetchQuery(api.users.getCurrent, {}, { token });
        revalidatePath("/dashboard");
        if (user) {
            revalidatePath(`/${user.slug}`);
            revalidatePath(`/${user.slug}/${parsed.data.slug}`);
        }
        return createSuccessResponse(serializeFlop(result.flop));
    } catch (error) {
        return createErrorResponse(error, "saveFlop");
    }
}

export async function deleteFlop(flopId: string): Promise<ActionResponse> {
    try {
        const token = await convexAuthToken();
        if (!token) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "deleteFlop/auth",
            };
        }
        const result = await fetchMutation(
            api.flops.remove,
            { flopId: flopId as Id<"flops"> },
            { token }
        );
        if (!result.ok) {
            return {
                success: false,
                error: result.error,
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
        await fetchMutation(api.flops.incrementViews, {
            flopId: flopId as Id<"flops">,
        });
    } catch {
        // View counting must never break the page
    }
}
