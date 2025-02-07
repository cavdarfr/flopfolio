import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
            },
            {
                protocol: "https",
                hostname: "utfs.io",
            },
        ],
        dangerouslyAllowSVG: true,
    },
};

export default nextConfig;
