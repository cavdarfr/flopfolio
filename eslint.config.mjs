import coreWebVitals from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    { ignores: ["convex/_generated/**"] },
    ...coreWebVitals,
];

export default config;
