import { z } from "zod";

export const courseCategoies = [
    "Web Development", "AI", "Data Science", "Mobile Development", "Design", "Marketing", "Finance", "Business", "Healthcare", "Music", "Teaching", "Academics",
] as const;

export const courseLevels = [
    "Beginner", "Intermediate", "Advanced",
] as const;

export const courseStatus = ['Draft', 'Published', 'Archived'] as const;

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

    level: z.enum(courseLevels, { error: "Level must be one of: Beginner, Intermediate, Advanced" }),

    category: z.enum(courseCategoies, { error: "Category must be one of: " + courseCategoies.join(", ") }),

    smallDescription: z.string()
        .min(3, { error: "Small description must be at least 3 characters long" })
        .max(250, { error: "Small description cannot exceed 250 characters" }),

    slug: z.string()
        .min(3, { error: "Slug must be at least 3 characters long" })
        .max(100, { error: "Slug cannot exceed 100 characters" }),

    status: z.enum(courseStatus, { error: 'Status must be one of: Draft, Published, Archived' }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

export const chapterSchema = z.object({
    name: z.string().min(3, { error: "Chapter name must be at least 3 characters long" }),
    courseId: z.uuid({ error: "Invalid course id" })
})

export type ChapterSchemaType = z.infer<typeof chapterSchema>

export const lessonSchema = z.object({
    name: z.string().min(3, { error: "Chapter name must be at least 3 characters long" }),
    courseId: z.uuid({ error: "Invalid course id" }),
    chaptereId: z.uuid({ error: "Invalid chapter id" }),
    description: z.string().min(3, { error: "Description must be at least 3 characters long" }).optional(),
    thumbnailKey: z.string().min(3, { error: "Thumbnail must be at least 3 characters long" }).optional(),
    videoKey: z.string().min(3, { error: "Vide key must be at least 3 characters long" }).optional(),
})

export type LessonSchemaType = z.infer<typeof lessonSchema> 