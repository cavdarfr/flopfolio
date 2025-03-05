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
    preload: true,
    fallback: ["system-ui", "sans-serif"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: true,
    fallback: ["monospace"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://flopfolio.vercel.app'),
    title: {
        default: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        template: "%s | Flopfolio",
    },
    description: "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback.",
    keywords: ["entrepreneurship", "startup", "business", "failure", "learning", "portfolio"],
    authors: [{ name: "Flopfolio" }],
    creator: "Flopfolio",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://flopfolio.vercel.app",
        siteName: "Flopfolio",
        title: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        description: "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Flopfolio - Celebrate Your Failures, Empower Your Future",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        creator: "@flopfolio",
        title: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        description: "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback.",
        images: ["/twitter-image.jpg"],
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
                <head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link rel="preload" as="image" href="/logo.avif" />
                </head>
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
