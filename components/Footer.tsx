import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import GitHubIcon from "./icons/GitHubIcon";

export default function Footer() {
    return (
        <footer className="mt-20">
            <div className="mx-auto max-w-7xl px-6 pt-12 pb-2 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold">Flopfolio</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Celebrate Your Failures. Empower Your Future.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="mt-8 md:mt-0">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Navigation
                            </p>
                            <div className="flex flex-col gap-4">
                                <Link href="/">
                                    <Button
                                        variant="link"
                                        className="h-auto p-0"
                                    >
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button
                                        variant="link"
                                        className="h-auto p-0"
                                    >
                                        About
                                    </Button>
                                </Link>
                                {/* <Link href="/contact">
                                    <Button
                                        variant="link"
                                        className="h-auto p-0"
                                    >
                                        Contact
                                    </Button>
                                </Link> */}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Legal
                            </p>
                            <div className="flex flex-col gap-4">
                                <Link href="/"> {/*Comming soon*/}
                                    <Button
                                        variant="link"
                                        className="h-auto p-0"
                                    >
                                        Privacy Policy
                                    </Button>
                                </Link>
                                <Link href="/"> {/*Comming soon*/}
                                    <Button
                                        variant="link"
                                        className="h-auto p-0"
                                    >
                                        Terms of Service
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                <Separator className="mb-6" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        © {new Date().getFullYear()} Flopfolio. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHubIcon className="w-6 h-6" /> Github
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
