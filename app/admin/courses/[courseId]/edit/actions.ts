"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arkjet, { detectBot, fixedWindow } from "@/lib/arkjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas"
import { request } from "@arcjet/next"

const aj = arkjet.withRule(detectBot({ mode: "LIVE", allow: [] })).withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }))


export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const req = await request()
    const user = await requireAdmin()
    try {
        const decision = await aj.protect(req, {
            fingerprint: user.user.id
        })
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
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


        const result = courseSchema.safeParse(data)

        if (!result.success) {
            return {
                message: "Invalid data",
                status: "error"
            }

        }
        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id
            },
            data: {
                ...result.data
            }
        })

        return {
            status: "success",
            message: "Course updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to update Course"
        }
    }
}