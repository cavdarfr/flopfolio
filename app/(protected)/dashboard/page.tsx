import Link from "next/link";
import { getUser } from "@/actions/action";
import { getMyFlops, SerializedFlop } from "@/actions/flop-actions";
import { Button } from "@/components/ui/button";
import FlopList from "@/components/flop/FlopList";
import UserForm from "@/components/UserForm";
import { UserFormValues } from "@/lib/userValidation";
import { SignOutButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
    const [response, flopsResponse] = await Promise.all([
        getUser(),
        getMyFlops(),
    ]);

    // Make sure we're passing a plain object to the client component
    const user = response.success && response.data
        ? response.data as UserFormValues
        : null;

    const flops =
        flopsResponse.success && flopsResponse.data
            ? (flopsResponse.data as SerializedFlop[])
            : [];

    // If there's an error, we'll still render the form but with null user data
    // The form will handle creating a new user profile

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 my-8">
            {/* My flops */}
            <section className="bg-white border border-zinc-200 rounded-3xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">My flops</h1>
                        <p className="text-sm text-zinc-500">
                            Your post-mortems — drafts included.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/flops/new">
                            <Plus className="mr-1 h-4 w-4" />
                            New flop
                        </Link>
                    </Button>
                </div>
                {!flopsResponse.success && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                        <p>Note: {flopsResponse.error}</p>
                    </div>
                )}
                <FlopList flops={flops} />
            </section>

            {/* Profile */}
            <section className="bg-white border border-zinc-200 rounded-3xl shadow-xl p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Profile</h2>
                    <Button variant={"destructive"} asChild>
                        <SignOutButton />
                    </Button>
                </div>

                {/* Display error message if there is one */}
                {!response.success && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                        <p>Note: {response.error}</p>
                        <p className="text-sm mt-1">You can create your profile below.</p>
                    </div>
                )}

                <UserForm user={user} />
            </section>
        </div>
    );
}
