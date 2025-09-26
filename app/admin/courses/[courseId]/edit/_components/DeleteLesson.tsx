"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "../actions";
import { toast } from "sonner";

export function DeleteLessson({ chapterId, courseId, lessonId }: { chapterId: string, courseId: string, lessonId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    async function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteLesson({ chapterId, courseId, lessonId }))
            if (error) {
                toast.error("An uxpected error. Try again")
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
                setIsOpen(false)
            } else {
                toast.error(result.message)
            }
        })
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete the lesson.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={pending}>{pending? "Deleting": "Delete"}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>
    )
}