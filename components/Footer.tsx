import Link from "next/link";

const footerLink =
    "font-mono text-sm text-muted transition-colors hover:text-vermilion";

export default function Footer() {
    return (
        <footer className="mt-20 border-t-2 border-ink">
            <div className="mx-auto max-w-7xl px-6 pt-12 pb-2 md:flex md:items-start md:justify-between lg:px-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-2">
                        <span
                            aria-hidden="true"
                            className="font-display text-lg leading-none text-vermilion"
                        >
                            †
                        </span>
                        <span className="font-mono text-base font-semibold lowercase tracking-[0.25em]">
                            flopfolio
                        </span>
                    </div>
                    <p className="max-w-xs font-serif text-lg italic text-muted">
                        Celebrate your failures. Empower your future.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="mt-8 md:mt-0">
                    <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                        <div className="flex flex-col gap-4">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                                Navigation
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link href="/" className={footerLink}>
                                    Home
                                </Link>
                                <Link href="/about" className={footerLink}>
                                    About
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                                Product
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link href="/feedback" className={footerLink}>
                                    Give feedback
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 pb-2 md:flex-row">
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-faint">
                        © {new Date().getFullYear()} Flopfolio — every project
                        dies someday
                    </p>
                    <p className="font-mono text-xs text-faint">
                        Free MVP · no paid plans
                    </p>
                </div>
            </div>
        </footer>
    );
}
