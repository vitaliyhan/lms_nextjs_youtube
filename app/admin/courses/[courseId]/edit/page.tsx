import { adminGetCourse } from "@/app/data/admin/admin-get-couse"

type Params = Promise<{ courseId: string }>

export default async function EditRoute({ params }: { params: Params }) {

    const { courseId } = await params
    const data = await adminGetCourse(courseId)
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course: <span>{data.title}</span>
            </h1>

        </div>
    )
}