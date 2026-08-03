"use client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Header() {
    const { isLoaded, isSignedIn } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="flex flex-row items-center justify-between border-b-2 border-ink px-5 py-5">
            <div>
                <Link href="/" className="flex items-baseline gap-2">
                    <span
                        aria-hidden="true"
                        className="font-display text-xl leading-none text-vermilion"
                    >
                        †
                    </span>
                    <span className="font-mono text-lg font-semibold lowercase tracking-[0.25em]">
                        flopfolio
                    </span>
                </Link>
            </div>

            {/* Mobile Menu (Sheet Trigger) - Hidden on desktop */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                    {/* Hidden on medium screens and up */}
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="sm:max-w-sm border-l-2 border-ink bg-bone p-6"
                >
                    <SheetHeader>
                        <SheetTitle className="font-mono uppercase tracking-[0.2em]">
                            Navigation
                        </SheetTitle>
                        <SheetDescription className="font-mono text-xs text-muted">
                            Explore Flopfolio
                        </SheetDescription>
                    </SheetHeader>
                    <nav className="mt-6 grid gap-5 font-mono text-sm uppercase tracking-[0.15em]">
                        {/* Navigation links inside Sheet */}
                        <Link href="/" className="hover:text-vermilion">
                            Home
                        </Link>
                        <Link href="/about" className="hover:text-vermilion">
                            About
                        </Link>
                        {isSignedIn ? (
                            <Link href="/dashboard">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    disabled={!isLoaded}
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/sign-up">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    disabled={!isLoaded}
                                >
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex flex-row items-center gap-8">
                <Link
                    href="/"
                    className="font-mono text-sm uppercase tracking-[0.15em] transition-colors hover:text-vermilion"
                >
                    Home
                </Link>
                <Link
                    href="/about"
                    className="font-mono text-sm uppercase tracking-[0.15em] transition-colors hover:text-vermilion"
                >
                    About
                </Link>
                {isSignedIn ? (
                    <Link href="/dashboard">
                        <Button size={"lg"} disabled={!isLoaded}>
                            Dashboard
                        </Button>
                    </Link>
                ) : (
                    <Link href="/sign-up">
                        <Button size={"lg"} disabled={!isLoaded}>
                            Get Started
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
}
