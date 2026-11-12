import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// UploadThing variants, inlined from uploadthing/tw. Importing uploadthing/tw
// (withUt or uploadthingPlugin) breaks the Turbopack build on Next 16.4: it
// pulls the package's .d.cts files into the bundle.
const uploadthingPlugin = plugin(({ addVariant }) => {
    addVariant("ut-button", '&>*[data-ut-element="button"]');
    addVariant("ut-allowed-content", '&>*[data-ut-element="allowed-content"]');
    addVariant("ut-label", '&>*[data-ut-element="label"]');
    addVariant("ut-upload-icon", '&>*[data-ut-element="upload-icon"]');
    addVariant("ut-clear-btn", '&>*[data-ut-element="clear-btn"]');
    addVariant("ut-readying", '&[data-state="readying"]');
    addVariant("ut-ready", '&[data-state="ready"]');
    addVariant("ut-uploading", '&[data-state="uploading"]');
});

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        // UploadThing UI classes (what withUt() added).
        "./node_modules/@uploadthing/react/dist/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
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
    plugins: [require("tailwindcss-animate"), uploadthingPlugin],
} satisfies Config;

export default config;
