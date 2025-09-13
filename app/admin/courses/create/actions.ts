"use server"

import { prisma } from "@/lib/db";
import { ApiResonse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResonse> {

    try {
        const validation = courseSchema.safeParse(values)
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            }
        }

        const data = await prisma.course.create(
            {
                data: {
                    ...validation.data,
                    userId: "fdgd"
                }
            }
        )

        console.log(data)

        return {
            status: "success",
            message: "Course created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create a course"
        }
    }
}