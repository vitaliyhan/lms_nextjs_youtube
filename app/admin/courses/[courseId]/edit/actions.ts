"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arkjet, { detectBot, fixedWindow } from "@/lib/arkjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchemas"
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
    await requireAdmin()
    try {

        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: 'no lessons provided for reordering'
            }
        }

        const updates = lessons.map((lesson) => prisma.lesson.update({
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

export async function reorderChapters(courseId: string, chapters: { id: string, position: number }[]): Promise<ApiResponse> {
    await requireAdmin()
    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters provided"
            }
        }

        const updates = chapters.map(
            (chapter) => prisma.chapter.update(
                {
                    where: {
                        id: chapter.id,
                        courseId: courseId
                    },
                    data: {
                        position: chapter.position
                    }
                }
            )
        )

        await prisma.$transaction(updates)

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: 'success',
            message: 'Chapters reorderd sucessfully'
        }
    }
    catch {
        return {
            status: "error",
            message: "Failed to reorder chapters"
        }
    }
}

export async function CreateChapter(values: ChapterSchemaType): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const result = chapterSchema.safeParse(values)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid chapter data"
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true
                },
                orderBy: {
                    position: "desc"
                }
            })

            await tx.chapter.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        })
        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

        return {
            message: "Chapter created successfully",
            status: "success"
        }
    }
    catch {
        return {
            status: "error",
            message: 'Failed to create chapter'
        }
    }
}

export async function CreateLesson(values: LessonSchemaType): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const result = lessonSchema.safeParse(values)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid chapter data"
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chaptereId,
                },
                select: {
                    position: true
                },
                orderBy: {
                    position: "desc"
                }
            })

            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    videoKey: result.data.videoKey,
                    thumbnailKey: result.data.thumbnailKey,
                    chapterId: result.data.chaptereId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        })
        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

        return {
            message: "Lesson created successfully",
            status: "success"
        }
    }
    catch {
        return {
            status: "error",
            message: 'Failed to create lesson'
        }
    }
}

export async function deleteLesson({ chapterId, courseId, lessonId }: { chapterId: string, courseId: string, lessonId: string }): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        })

        if (!chapterWithLessons) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }

        const lessons = chapterWithLessons.lessons

        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId)

        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson not found"
            }
        }

        const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId)

        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: { id: lesson.id },
                data: { position: index + 1 }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId
                }
            })
        ])
        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            message: "Lesson deleted successfully",
            status: "success"
        }
    }
    catch {
        return {
            status: "error",
            message: 'Failed to delete lesson'
        }
    }
}

export async function deleteChapter({ chapterId, courseId }: { chapterId: string, courseId: string }): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                chapter: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        })

        if (!courseWithChapters) {
            return {
                status: "error",
                message: "Course not found"
            }
        }

        const chapters = courseWithChapters.chapter

        const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId)

        if (!chapterToDelete) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }

        const remainingChapters = chapters.filter((chapters) => chapters.id !== chapterId)

        const updates = remainingChapters.map((chapters, index) => {
            return prisma.chapter.update({
                where: { id: chapters.id },
                data: { position: index + 1 }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId
                }
            })
        ])
        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            message: "Chapter deleted successfully",
            status: "success"
        }
    }
    catch {
        return {
            status: "error",
            message: 'Failed to delete chapter'
        }
    }
}