import mongoose, { Schema, Model, Document } from "mongoose";

interface Social {
    _id: string;
    name: string;
    url: string;
}

interface Business {
    _id: string;
    name: string;
    description: string;
    logoUrl: string;
    status: "active" | "inactive" | "pending" | "sold" | "cancelled" | "failed";
    lessons: string;
}

interface User extends Document {
    clerkUserId: string;
    name: string;
    slug: string;
    bio?: string;
    avatarUrl?: string;
    socials: Social[];
    business: Business[];
}

const SocialSchema: Schema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
});

const BusinessSchema: Schema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    logoUrl: { type: String, required: false },
    status: {
        type: String,
        enum: ["active", "inactive", "pending", "sold", "cancelled", "failed"],
        default: "pending",
    },
    lessons: { type: String, required: true },
});

const UserSchema: Schema = new Schema(
    {
        clerkUserId: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        slug: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
            match: [
                /^[a-z0-9]+(-[a-z0-9]+)*$/,
                "Please use a valid slug format (e.g., 'johndoe')",
            ],
        },
        bio: { type: String, default: "" },
        avatarUrl: { type: String, default: "" },
        socials: [SocialSchema],
        business: [BusinessSchema],
    },
    { timestamps: true }
);

// Pre-save hook to format the slug
UserSchema.pre<User>("save", function (next) {
    if (this.isModified("slug")) {
        this.slug = this.slug
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/[^a-z0-9-]+/g, "") // Remove invalid characters
            .replace(/--+/g, "-") // Replace multiple hyphens with one
            .replace(/^-+/, "") // Remove leading hyphen
            .replace(/-+$/, ""); // Remove trailing hyphen

        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        if (!slugRegex.test(this.slug)) {
            return next(new Error("Slug format is invalid."));
        }
    }
    next();
});

// Create and export the User model
const UserModel: Model<User> =
    mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
