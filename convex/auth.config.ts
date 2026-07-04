// Clerk <-> Convex auth wiring.
// CLERK_JWT_ISSUER_DOMAIN must be set in the Convex deployment env
// (npx convex env set CLERK_JWT_ISSUER_DOMAIN https://...clerk.accounts.dev)
// and a JWT template named "convex" must exist in the Clerk dashboard.
const authConfig = {
    providers: [
        {
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
            applicationID: "convex",
        },
    ],
};

export default authConfig;
