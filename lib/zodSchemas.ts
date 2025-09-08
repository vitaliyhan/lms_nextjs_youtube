import {z} from "zod";

export const courseSchema = z.object({
    title: z.string()
        .min(3, { error: "Title must be at least 3 characters long" })
        .max(100, { error: "Title cannot exceed 100 characters" }),

    description: z.string()
        .min(3, { error: "Description must be at least 3 characters long" })
        .max(2500, { error: "Description cannot exceed 2500 characters" }),

    fileKey: z.string()
        .min(3, { error: "File key must be at least 3 characters long" }),

    price: z.coerce
        .number()
        .min(1, { error: "Price must be at least 1" })
        .max(10000, { error: "Price cannot exceed 10000" }),

    duration: z.coerce
        .number()
        .min(1, { error: "Duration must be at least 1" })
        .max(500, { error: "Duration cannot exceed 500" }),

    level: z.enum(['Beginner', 'Intermediate', 'Advanced'], { error: "Level must be one of: Beginner, Intermediate, Advanced" }),

    category: z.string()
        .min(3, { error: "Category must be at least 3 characters long" })
        .max(100, { error: "Category cannot exceed 100 characters" }),

    smallDescription: z.string()
        .min(3, { error: "Small description must be at least 3 characters long" })
        .max(250, { error: "Small description cannot exceed 250 characters" }),

    slug: z.string()
        .min(3, { error: "Slug must be at least 3 characters long" })
        .max(100, { error: "Slug cannot exceed 100 characters" }),

    status: z.enum(['Draft', 'Published', 'Archived'], { error: 'Status must be one of: Draft, Published, Archived' }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;