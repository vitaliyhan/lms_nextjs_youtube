import { AdminGetCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: AdminGetCourseType
}

export default function AdminCourseCard({ data }: iAppProps) {

    const thumbnailUrl = useConstructUrl(data.fileKey)

    return (
        <Card className="group relative py-0 gap-0">
            {/* absolute dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/edit`} className="cursor-pointer"><Pencil className="size-4" />Edit Course</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/courses/${data.slug}`} className="cursor-pointer"><Eye className="size-4" />Preview</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/delete`} className="cursor-pointer"><Trash2 className="size-4 text-destructive" />Delete Course</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image width={600} height={400} src={thumbnailUrl} alt="Thumbnail" className="w-full rounded-t-lg aspect-video h-full object-cover" />
            <CardContent className="flex flex-col gap-4 p-4">
                <Link href={`/admin/courses/${data.id}`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">{data.title}</Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight">
                    {data.smallDescription}
                </p>

                <div className="flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p>{data.duration} h</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p>{data.level}</p>
                    </div>
                </div>
                <Link className={buttonVariants({ className: "w-full" })} href={`/admin/courses/${data.id}/edit`}>Edit Course <ArrowRight className="size-4" /></Link>
            </CardContent>
        </Card>
    )
}
