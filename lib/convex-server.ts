import { auth } from "@clerk/nextjs/server";

/**
 * Clerk-issued JWT for Convex ("convex" JWT template in the Clerk
 * dashboard). Undefined when signed out — Convex then treats the caller
 * as unauthenticated.
 */
export async function convexAuthToken(): Promise<string | undefined> {
    try {
        const { getToken } = await auth();
        return (await getToken({ template: "convex" })) ?? undefined;
    } catch {
        return undefined;
    }
}
