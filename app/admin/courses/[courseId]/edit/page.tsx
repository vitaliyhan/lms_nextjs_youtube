import { adminGetCourse } from "@/app/data/admin/admin-get-course"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditFCourseForm from "./_components/EditCourseForm"
import CourseStructure from "./_components/CourseStructure"

type Params = Promise<{ courseId: string }>

export default async function EditRoute({ params }: { params: Params }) {

    const { courseId } = await params
    const data = await adminGetCourse(courseId)
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course: <span>{data.title}</span>
            </h1>
            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">
                        Basic info
                    </TabsTrigger>
                    <TabsTrigger value="course-structure">
                        Course structure
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Basic info
                            </CardTitle>
                            <CardDescription>
                                Edit basic info about the course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditFCourseForm data={data} />
                        </CardContent>
                    </Card>

                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Course structure
                            </CardTitle>
                            <CardDescription>
                                Edit course structure of the course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}