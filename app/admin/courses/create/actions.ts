"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import arkjet, { detectBot, fixedWindow } from "@/lib/arkjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arkjet.withRule(detectBot({ mode: "LIVE", allow: [] })).withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }))

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {

    const session = await requireAdmin()
    try {
        const req = await request()

        const decision = await aj.protect(req, {
            fingerprint: session.user.id
        })

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: "error",
                    message: "Rate limit exceeded!"
                }
            }

            return {
                status: "error",
                message: "Looks like you are a bot!"
            }
        }

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