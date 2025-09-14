"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResonse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResonse> {

    try {
        const session = await auth.api.getSession({ headers: await headers() })


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
                    userId: session?.user.id as string,
                }
            }
        )

        console.log(data)

        return {
            status: "success",
            message: "Course created successfully"
        }
    } catch (error) {
        console.log({ error })
        return {
            status: "error",
            message: "Failed to create a course"
        }
    }
}