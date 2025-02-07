import { getUser } from "@/actions/action";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/UserForm";
import { UserFormValues } from "@/lib/userValidation";
import { SignOutButton } from "@clerk/nextjs";
export default async function DashboardPage() {
    const user = await getUser();

    return (
        // <div className="flex flex-col items-center justify-center w-full max-w-screen-lg rounded-md p-4">
        <div className="w-full max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 my-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <Button variant={"destructive"} asChild>
                    <SignOutButton />
                </Button>
            </div>
            <UserForm user={user as UserFormValues} />
        </div>
    );
}
