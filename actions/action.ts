"use server";

import { fetchQuery, fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { convexAuthToken } from "@/lib/convex-server";
import { UserFormValues } from "@/lib/userValidation";
import { FeedbackFormValues } from "@/lib/feedbackValidation";
import {
    ActionResponse,
    createSuccessResponse,
    createErrorResponse,
} from "@/lib/error-utils";

// Cache for storing recently checked slugs
const slugCache = new Map<string, { available: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Convex stores nested socials/business entries with an "id" field
 * (field names starting with "_" are reserved); components expect "_id".
 */
function serializeUser(doc: Doc<"users">) {
    const { _creationTime, createdAt, updatedAt, socials, business, ...rest } =
        doc;
    return {
        ...rest,
        bio: doc.bio ?? "",
        avatarUrl: doc.avatarUrl ?? "",
        socials: (socials ?? []).map(({ id, name, url }) => ({
            _id: id,
            name,
            url,
        })),
        business: (business ?? []).map(({ id, ...b }) => ({ _id: id, ...b })),
        createdAt: new Date(createdAt ?? _creationTime).toISOString(),
        updatedAt: new Date(updatedAt ?? _creationTime).toISOString(),
    };
}

export const getUser = async (): Promise<ActionResponse> => {
    try {
        const token = await convexAuthToken();
        if (!token) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "getUser/auth",
            };
        }

        const user = await fetchQuery(api.users.getCurrent, {}, { token });
        if (!user) {
            return {
                success: false,
                error: "User profile not found",
                errorLocation: "getUser/database",
            };
        }

        return createSuccessResponse(serializeUser(user));
    } catch (error) {
        return createErrorResponse(error, "getUser");
    }
};

export const getUserBySlug = async (slug: string): Promise<ActionResponse> => {
    try {
        if (!slug) {
            return {
                success: false,
                error: "Slug parameter is required",
                errorLocation: "getUserBySlug/params",
            };
        }

        const user = await fetchQuery(api.users.getBySlug, { slug });
        if (!user) {
            return {
                success: false,
                error: "User not found",
                errorLocation: "getUserBySlug/database",
            };
        }

        return createSuccessResponse(serializeUser(user));
    } catch (error) {
        return createErrorResponse(error, "getUserBySlug");
    }
};

// save user to database
export async function saveUser(
    data: UserFormValues,
    clerkUserId: string
): Promise<ActionResponse> {
    // Check for user authentication
    if (!clerkUserId) {
        return {
            success: false,
            error: "User ID is missing",
            errorLocation: "Authentication Check",
        };
    }

    try {
        const token = await convexAuthToken();
        if (!token) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "saveUser/auth",
            };
        }

        const result = await fetchMutation(
            api.users.save,
            {
                name: data.name,
                slug: data.slug,
                bio: data.bio ?? "",
                avatarUrl: data.avatarUrl ?? "",
                socials: (data.socials ?? []).map(({ _id, name, url }) => ({
                    id: _id || crypto.randomUUID(),
                    name,
                    url,
                })),
                business: (data.business ?? []).map(
                    ({ _id, name, description, status, lessons, logoUrl }) => ({
                        id: _id || crypto.randomUUID(),
                        name,
                        description,
                        status,
                        lessons,
                        logoUrl: logoUrl ?? "",
                    })
                ),
            },
            { token }
        );

        if (!result.ok || !result.user) {
            return {
                success: false,
                error: result.ok ? "Profile not found" : result.error,
                errorLocation: "saveUser/database",
            };
        }

        revalidatePath("/dashboard");
        return createSuccessResponse(serializeUser(result.user));
    } catch (error) {
        // Simple error handling with location information
        return createErrorResponse(error, "saveUser");
    }
}

export async function submitFeedback(
    data: FeedbackFormValues
): Promise<ActionResponse> {
    try {
        if (!data) {
            return {
                success: false,
                error: "Feedback data is required",
                errorLocation: "submitFeedback/params",
            };
        }

        const result = await fetchMutation(api.feedback.submit, {
            name: data.name,
            email: data.email,
            message: data.message,
        });

        revalidatePath("/feedback");

        return createSuccessResponse(result);
    } catch (error) {
        return createErrorResponse(error, "submitFeedback");
    }
}

export async function checkSlugAvailability(
    slug: string,
    currentUserId?: string
): Promise<ActionResponse> {
    try {
        // Check cache first
        const cacheKey = `${slug}:${currentUserId ?? ""}`;
        const cachedResult = slugCache.get(cacheKey);
        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
            return createSuccessResponse({ available: cachedResult.available });
        }

        const token = await convexAuthToken();
        const { available } = await fetchQuery(
            api.users.checkSlugAvailability,
            { slug },
            token ? { token } : undefined
        );

        // Update cache
        slugCache.set(cacheKey, { available, timestamp: Date.now() });

        return createSuccessResponse({ available });
    } catch (error) {
        return createErrorResponse(error, "checkSlugAvailability");
    }
}
