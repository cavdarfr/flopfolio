import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: ["api.dicebear.com", "utfs.io"],
        dangerouslyAllowSVG: true,
    },
};

export default nextConfig;
