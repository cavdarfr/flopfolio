import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className=" w-full px-6 py-8 bg-gray-100 shadow-lg rounded-lg text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-2xl font-semibold text-gray-600 mb-6">
                    Page Not Found
                </p>
                <p className="text-gray-500 mb-8">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or
                    has been moved.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild variant="default">
                        <Link href="/" className="flex items-center">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Homepage
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link
                            href="javascript:history.back()"
                            className="flex items-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
