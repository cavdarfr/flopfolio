import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("feedback", args);
        return await ctx.db.get(id);
    },
});
