import { getUser } from "@/actions/action";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/UserForm";
import { UserFormValues } from "@/lib/userValidation";
import { SignOutButton } from "@clerk/nextjs";

export default async function DashboardPage() {
    const response = await getUser();
    
    // Make sure we're passing a plain object to the client component
    const user = response.success && response.data 
        ? response.data as UserFormValues
        : null;

    // If there's an error, we'll still render the form but with null user data
    // The form will handle creating a new user profile
    
    return (
        <div className="w-full max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 my-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
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
        </div>
    );
}
