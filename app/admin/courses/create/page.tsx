"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCategoies, courseLevels, courseSchema, CourseSchemaType, courseStatus } from "@/lib/zodSchemas";
import { ArrowLeft, Plus, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/fileuploader/Uploader";

export default function CourseCreationPage() {

    const courseResolver: Resolver<CourseSchemaType> = zodResolver(courseSchema as any);
    // 1. Define your form.
    const form = useForm<CourseSchemaType>({
        resolver: courseResolver,
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 1,
            duration: 0,
            level: "Beginner",
            category: "Web Development",
            status: "Draft",
            slug: "",
            smallDescription: "",
        },
    })

    function onSubmit(values: CourseSchemaType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <>
            <div className="flex items-center gap-4">
                <Link href={"/admin/courses"} className={buttonVariants({ variant: "outline", size: "icon" })}>
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold">Create Course</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Provide basic information about the course, including the course title, description, and other relevant details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="title"
                                render=
                                {
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                } />
                            <div className="flex items-end  gap-4">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render=
                                    {
                                        ({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-4">
                                                        <Input placeholder="Slug" {...field} className="w-full" />
                                                        <Button type="button" className="w-fit" onClick={() => {
                                                            const titleValue = form.getValues("title");
                                                            const slug = slugify(titleValue);
                                                            form.setValue("slug", slug, { shouldValidate: true })
                                                        }}>
                                                            Generate a Slug <SparkleIcon className="ml-1 size-6" />
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    } />

                            </div>
                            <FormField
                                control={form.control}
                                name="smallDescription"
                                render=
                                {
                                    ({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Small Description</FormLabel>
                                            <FormControl>
                                                <RichTextEditor field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                } />
                            <FormField
                                control={form.control}
                                name="description"
                                render=
                                {
                                    ({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Description" {...field} className="min-h-[120]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                } />
                            <FormField
                                control={form.control}
                                name="fileKey"
                                render=
                                {
                                    ({}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Thumbnail image</FormLabel>
                                            <FormControl>
                                                {/* <Input placeholder="Thumbnail url" {...field} /> */}
                                                <Uploader />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                } />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render=
                                    {
                                        ({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Category</FormLabel>

                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {courseCategoies.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )
                                    } />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render=
                                    {
                                        ({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Level</FormLabel>

                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {courseLevels.map((level) => (
                                                            <SelectItem key={level} value={level}>
                                                                {level}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )
                                    } />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render=
                                    {
                                        ({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Duration (hours)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Duration" type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    } />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render=
                                    {
                                        ({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Price" type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    } />
                            </div>
                            <FormField
                                control={form.control}
                                name="status"
                                render=
                                {
                                    ({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Status</FormLabel>

                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseStatus.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )
                                } />
                            <Button>
                                Create Course <Plus className="size-4" />
                            </Button>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
