import "server-only"
import { requireAdmin } from "./require-admin"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export async function adminGetCourse(id: string) {
    await requireAdmin()

    const data = await prisma.course.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            slug: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            category: true,
            smallDescription: true,
        }
    })

    if (!data) {
        return notFound()
    }

    return data
}