import Link from "next/link";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center p-4">
            <Link
                href="/"
                className="mt-4 flex items-baseline gap-2 transition-colors hover:text-vermilion"
            >
                <span
                    aria-hidden="true"
                    className="font-display text-sm leading-none text-vermilion"
                >
                    †
                </span>
                <span className="font-mono text-xs font-semibold lowercase tracking-[0.3em]">
                    flopfolio
                </span>
            </Link>
            <div className="flex w-full flex-1 flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
}
