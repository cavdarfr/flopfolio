import type { Metadata } from "next";
import {
    Archivo_Black,
    IBM_Plex_Mono,
    IBM_Plex_Sans,
    Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";

// Brand type system — mirrors the share-card art directions
// (tombstone: Archivo Black, autopsy: IBM Plex Mono, editorial: Instrument Serif)
const displayFont = Archivo_Black({
    variable: "--font-display",
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    preload: true,
    fallback: ["Arial Black", "sans-serif"],
});

const sansFont = IBM_Plex_Sans({
    variable: "--font-sans",
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
    fallback: ["system-ui", "sans-serif"],
});

const monoFont = IBM_Plex_Mono({
    variable: "--font-mono",
    weight: ["400", "500", "600"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["monospace"],
});

const serifFont = Instrument_Serif({
    variable: "--font-serif",
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || "https://flopfolio.vercel.app"
    ),
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
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "Flopfolio - Celebrate Your Failures, Empower Your Future",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Flopfolio - Celebrate Your Failures, Empower Your Future",
        description: "Showcase your entrepreneurial journey, celebrate your learnings, and grow from every setback.",
        images: ["/twitter-image.png"],
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
                </head>
                <body
                    className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} ${serifFont.variable} antialiased bg-bone text-ink font-sans`}
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
