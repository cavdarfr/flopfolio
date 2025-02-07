import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: {
        default: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        template: "%s | Flopfolio",
    },
    description:
        "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback. Document your ventures and share invaluable lessons.",
    keywords: [
        "entrepreneurship",
        "startup",
        "business",
        "failure",
        "learning",
        "portfolio",
    ],
    authors: [{ name: "Flopfolio" }],
    creator: "Flopfolio",
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon?<generated>', type: 'image/png' }
        ],
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://flopfolio.com",
        title: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        description:
            "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback.",
        siteName: "Flopfolio",
        images: ["/logo.avif"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        description:
            "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback.",
        creator: "@flopfolio",
        images: ["/logo.avif"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" data-theme="light">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
                >
                    <NextSSRPlugin
                        routerConfig={extractRouterConfig(ourFileRouter)}
                    />
                    <Toaster />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
