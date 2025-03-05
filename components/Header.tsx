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
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
export default function Header() {
    const user = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="flex flex-row items-center justify-between px-5 py-10">
            <div>
                <Link href="/" className="flex flex-row gap-4 items-center">
                    <Image
                        src={"/logo.avif"}
                        alt="Flopfolio Logo"
                        width={34}
                        height={34}
                        priority
                        className="rounded-md"
                    />
                    <span className="text-2xl font-bold">Flopfolio</span>
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
                <SheetContent side="right" className="sm:max-w-sm p-6">
                    <SheetHeader>
                        <SheetTitle>Navigation</SheetTitle>
                        <SheetDescription>Explore Flopfolio</SheetDescription>
                    </SheetHeader>
                    <nav className="grid gap-4 text-lg mt-4">
                        {/* Navigation links inside Sheet */}
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                        {/* <Link href="/contact">Contact</Link> */}
                        {user ? (
                            <Link href="/dashboard">
                                <Button
                                    variant="default"
                                    className="rounded-full w-full text-xl h-12"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/sign-up">
                                <Button
                                    variant="default"
                                    className="rounded-full w-full text-xl h-12"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex flex-row gap-8 items-center">
                <Link href="/">
                    <Button variant={"link"} className="text-xl px-0">
                        Home
                    </Button>
                </Link>
                <Link href="/about">
                    <Button variant={"link"} className="text-xl px-0">
                        About
                    </Button>
                </Link>
                {user ? (
                    <Link href="/dashboard">
                        <Button
                            className="rounded-full text-xl h-12"
                            size={"lg"}
                        >
                            Dashboard
                        </Button>
                    </Link>
                ) : (
                    <Link href="/sign-up">
                        <Button
                            className="rounded-full text-xl h-12"
                            size={"lg"}
                        >
                            Get Started
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
}
