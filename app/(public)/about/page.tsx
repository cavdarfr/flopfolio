import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export default function AboutPage() {
    return (
        <main className="pt-14 px-5 md:px-5">
            {/* Hero Section */}
            <section className="flex flex-col gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-5xl md:text-7xl tracking-tighter">
                        About Flopfolio
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-300 md:w-4/5 mx-auto">
                        We believe that every failure is a stepping stone to
                        success. Flopfolio was created to help entrepreneurs
                        document their journey, learn from their experiences,
                        and share their stories with others.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="p-3 bg-zinc-100 rounded-full">
                                    <Heart className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Built with Purpose
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-300">
                                    Created to help entrepreneurs embrace and
                                    learn from their challenges and setbacks.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="p-3 bg-zinc-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Community Driven
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-300">
                                    A platform where entrepreneurs can connect,
                                    share experiences, and learn from each
                                    other.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="p-3 bg-zinc-100 rounded-full">
                                    <Sparkles className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Continuous Growth
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-300">
                                    We&apos;re constantly evolving and improving
                                    based on user feedback and needs.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Call to Action */}
            <section className="mt-32 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl tracking-tighter font-semibold mb-4">
                        Ready to Share Your Journey?
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-8">
                        Join our community of entrepreneurs and start
                        documenting your journey today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            className="rounded-full text-xl h-12"
                            size="lg"
                            asChild
                        >
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full text-xl h-12"
                            size="lg"
                            asChild
                        >
                            <Link href="/feedback">Give Feedback</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Flopfolio's mission to help entrepreneurs document their journey and learn from their experiences.",
    openGraph: {
        title: "About Flopfolio - Our Mission and Values",
        description:
            "Learn about Flopfolio's mission to help entrepreneurs document their journey and learn from their experiences.",
    },
};
