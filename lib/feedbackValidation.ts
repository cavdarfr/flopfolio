import { z } from "zod";

export const FeedbackSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message cannot exceed 500 characters"),
});

// Infer TypeScript types from the schema
export type FeedbackFormValues = z.infer<typeof FeedbackSchema>;
