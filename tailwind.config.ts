import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                bone: "var(--bone)",
                surface: "var(--surface)",
                ink: "var(--ink)",
                muted: "var(--muted)",
                faint: "var(--faint)",
                line: "var(--line)",
                vermilion: {
                    DEFAULT: "var(--vermilion)",
                    bright: "var(--vermilion-bright)",
                },
                acid: "var(--acid)",
                cream: "var(--cream)",
                night: "var(--night)",
            },
            fontFamily: {
                display: ["var(--font-display)", "Arial Black", "sans-serif"],
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
                serif: ["var(--font-serif)", "Georgia", "serif"],
            },
            boxShadow: {
                slab: "6px 6px 0 0 var(--ink)",
                "slab-sm": "4px 4px 0 0 var(--ink)",
                "slab-vermilion": "6px 6px 0 0 var(--vermilion)",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    safelist: [
        "bg-green-500",
        "bg-blue-500",
        "bg-amber-500",
        "bg-gray-500",
        "bg-red-500",
        "bg-yellow-500",
    ],
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default withUt(config);
