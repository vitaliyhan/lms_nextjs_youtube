"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { ArrowLeft, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";

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
            category: "",
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
                                                    <Input placeholder="Slug" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    } />
                                <Button type="button" className="w-fit" onClick={() => {
                                    const titleValue = form.getValues("title");
                                    const slug = slugify(titleValue);
                                    form.setValue("slug", slug, { shouldValidate: true })
                                }}>Generate a Slug <SparkleIcon className="ml-1 size-6" /></Button>
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
                                                <Textarea placeholder="Small Description" {...field} className="min-h-[120]" />
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
                                    ({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Thumbnail image</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Thumbnail url" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                } />
                        </form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
