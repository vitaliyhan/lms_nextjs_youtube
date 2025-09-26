"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {  CreateLesson } from "../actions";
import { toast } from "sonner";

export function NewLessonModal({ courseId, chapterId }: { courseId: string, chapterId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition()
    // 1. Define your form.
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            chaptereId: chapterId
        },
    })

    async function onSubmit(value: LessonSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(CreateLesson(value))

            if (error) {
                toast.error("An uxpected error. Try again")
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
                form.reset()
                setIsOpen(false)
            } else {
                toast.error("An unexpected error")
            }
        })
    }

    function handleOpenChange(open: boolean) {
        if(!open) form.reset()
        setIsOpen(open)
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="w-full justify-center gap-1">
                    <Plus className="size-4" />New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Create new lesson
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name your lesson?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>

                                <FormControl>
                                    <Input placeholder="Lesson name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit" disabled={pending}>
                                {pending ? "Saving" : "Save change"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}