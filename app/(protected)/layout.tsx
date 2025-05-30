import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {children}
        </div>
    );
}
