"use server";

import dbConnect from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/UserSchema"; // Assurez-vous d'avoir ce modèle

import { UserFormValues } from "@/lib/userValidation";
import { revalidatePath } from "next/cache";

export const getUser = async () => {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
        console.log("User not found");
        return null; // ✅ Empêche les erreurs si l'utilisateur n'est pas authentifié
    }

    const user = await User.findOne({ clerkUserId: userId }).lean();

    if (!user) {
        return null;
    }

    // Convertir l'objet en format JSON sérialisable
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

    return serializedUser;
};

// save user to database
export async function saveUser(data: UserFormValues, clerkUserId: string) {
    await dbConnect();

    try {
        // Clean the data to avoid circular references
        const cleanedData = {
            ...data,
            socials: data.socials?.map(({ _id, name, url }) => ({
                _id,
                name,
                url,
            })), // Select only necessary fields
            business: data.business?.map(
                ({ _id, name, description, status, lessons }) => ({
                    _id,
                    name,
                    description,
                    status,
                    lessons,
                })
            ),
            clerkUserId,
        };
        await User.findOneAndUpdate({ clerkUserId }, cleanedData, {
            upsert: true,
            new: true,
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to save user data:", error);
        return { error: "Failed to save user data" };
    }
}
