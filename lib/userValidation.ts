// schema/user.ts
import { z } from "zod";

// Social Schema
const SocialSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "Name is required"),
    url: z.string().url("Invalid URL format"),
});

// Business Schema
const BusinessSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    logoUrl: z.string().url("Invalid URL format").optional(),
    status: z.enum([
        "active",
        "inactive",
        "pending",
        "sold",
        "cancelled",
        "failed",
    ]),
    lessons: z.string().min(1, "Lessons are required"),
});

// User Schema
export const UserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(50, "Slug cannot exceed 50 characters")
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format"),
    bio: z.string().optional(),
    avatarUrl: z.string().url("Invalid URL format").optional(),
    socials: z.array(SocialSchema).optional(),
    business: z.array(BusinessSchema).optional(),
});

// Infer TypeScript types from the schema
export type UserFormValues = z.infer<typeof UserSchema>;
