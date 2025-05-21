"use server";

import dbConnect from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/UserSchema"; // Assurez-vous d'avoir ce modèle
import { UserFormValues } from "@/lib/userValidation";
import { revalidatePath } from "next/cache";
import FeedbackModel from "@/models/FeedbackSchema";
import { FeedbackFormValues } from "@/lib/feedbackValidation";
import {
    ActionResponse,
    createSuccessResponse,
    createErrorResponse,
} from "@/lib/error-utils";

// Cache for storing recently checked slugs
const slugCache = new Map<string, { available: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getUser = async (): Promise<ActionResponse> => {
    try {
        await dbConnect();
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                error: "User not authenticated",
                errorLocation: "getUser/auth",
            };
        }

        // Use lean() to get a plain JavaScript object instead of a Mongoose document
        const user = await User.findOne({ clerkUserId: userId }).lean();

        if (!user) {
            return {
                success: false,
                error: "User profile not found",
                errorLocation: "getUser/database",
            };
        }

        // Serialize the user object to ensure it's a plain object
        const serializedUser = JSON.parse(
            JSON.stringify({
                ...user,
                _id: user._id.toString(),
                socials: user.socials?.map((social) => ({
                    ...social,
                    _id: social._id?.toString(),
                })),
                business: user.business?.map((business) => ({
                    ...business,
                    _id: business._id?.toString(),
                })),
            })
        );

        return createSuccessResponse(serializedUser);
    } catch (error) {
        return createErrorResponse(error, "getUser");
    }
};

export const getUserBySlug = async (slug: string): Promise<ActionResponse> => {
    try {
        await dbConnect();

        if (!slug) {
            return {
                success: false,
                error: "Slug parameter is required",
                errorLocation: "getUserBySlug/params",
            };
        }

        // Use lean() to get a plain JavaScript object instead of a Mongoose document
        const user = await User.findOne({ slug }).lean();

        if (!user) {
            return {
                success: false,
                error: "User not found",
                errorLocation: "getUserBySlug/database",
            };
        }

        // Serialize the user object to ensure it's a plain object
        const serializedUser = JSON.parse(
            JSON.stringify({
                ...user,
                _id: user._id.toString(),
                socials: user.socials?.map((social) => ({
                    ...social,
                    _id: social._id?.toString(),
                })),
                business: user.business?.map((business) => ({
                    ...business,
                    _id: business._id?.toString(),
                })),
            })
        );

        return createSuccessResponse(serializedUser);
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
        // Connect to database
        await dbConnect();

        // Check if slug is already taken by another user
        const existingUserWithSlug = await User.findOne({
            slug: data.slug,
            clerkUserId: { $ne: clerkUserId },
        });

        if (existingUserWithSlug) {
            return {
                success: false,
                error: `Slug "${data.slug}" is already taken`,
                errorLocation: "Slug Validation",
            };
        }

        // Prepare data for saving
        const cleanedData = {
            ...data,
            socials: data.socials?.map(({ _id, name, url }) => ({
                _id,
                name,
                url,
            })),
            business: data.business?.map(
                ({ _id, name, description, status, lessons, logoUrl }) => ({
                    _id,
                    name,
                    description,
                    status,
                    lessons,
                    logoUrl,
                })
            ),
            clerkUserId,
        };

        // Save to database
        const result = await User.findOneAndUpdate(
            { clerkUserId },
            cleanedData,
            { upsert: true, new: true, lean: true } // Use lean() to get a plain JavaScript object
        );

        // Properly serialize the result to avoid Mongoose document issues
        const serializedResult = JSON.parse(JSON.stringify(result));

        revalidatePath("/dashboard");
        return createSuccessResponse(serializedResult);
    } catch (error) {
        // Simple error handling with location information
        return createErrorResponse(error, "saveUser");
    }
}

export async function submitFeedback(
    data: FeedbackFormValues
): Promise<ActionResponse> {
    try {
        await dbConnect();

        if (!data) {
            return {
                success: false,
                error: "Feedback data is required",
                errorLocation: "submitFeedback/params",
            };
        }

        // Create the feedback and use lean() to get a plain JavaScript object
        const result = await FeedbackModel.create(data);

        // Convert to plain object
        const serializedResult = JSON.parse(JSON.stringify(result.toObject()));

        revalidatePath("/feedback");

        return createSuccessResponse(serializedResult);
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
        const cachedResult = slugCache.get(slug);
        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
            return createSuccessResponse({ available: cachedResult.available });
        }

        await dbConnect();

        // Check if slug is already taken by another user
        const existingUser = await User.findOne({
            slug,
            clerkUserId: currentUserId
                ? { $ne: currentUserId }
                : { $exists: true },
        });

        const available = !existingUser;

        // Update cache
        slugCache.set(slug, { available, timestamp: Date.now() });

        return createSuccessResponse({ available });
    } catch (error) {
        return createErrorResponse(error, "checkSlugAvailability");
    }
}
