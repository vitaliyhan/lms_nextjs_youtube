"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arkjet, { detectBot, fixedWindow } from "@/lib/arkjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas"
import { request } from "@arcjet/next"
import { revalidatePath } from "next/cache"

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

export async function reorderLessons(chapterId: string, lessons: { id: string, position: number }[], courseId: string): Promise<ApiResponse> {
    try {

        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: 'no lessons provided for reordering'
            }
        }

        const updates = lessons.map((lesson)=> prisma.lesson.update({
            where: {
                id: lesson.id, chapterId: chapterId
            },
            data: {
                position: lesson.position
            }
        }))

        await prisma.$transaction(updates)

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
         status: 'success',
         message: 'Lessons reorderd sucessfully'
        }

    } catch {
        return {
            status: 'error',
            message: "Failed to reorder lessons"
        }
    }
} 