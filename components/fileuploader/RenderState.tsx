import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";


export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center cursor-pointer flex items-center flex-col">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted">
                <CloudUploadIcon className={
                    cn(
                        'size-6 text-muted-foreground',
                        isDragActive && "text-primary"
                    )
                } />
            </div>
            <p className="text-base font-semibold text-foreground">Drop files here or <span className="text-primary font-black">click to upload</span></p>
        </div>
    )
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="text-center cursor-pointer w-full h-full">
                <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30">
                    <ImageIcon className={
                        cn(
                            'size-6 text-destructive'
                        )
                    } />
                </div>
                <p className="text-base font-semibold">Upload failed</p>
                <p className="text-xs font-semibold mt-2">Something went wrong</p>
            </div>
        </div>
    )
}

export function RenderUploaderState({ previewUrl, isDeleting, handleRemoveFile }: { previewUrl: string, isDeleting: boolean, handleRemoveFile: () => void }) {
    return <div className="content">
        <Image src={previewUrl} alt="uploaded File" fill className="object-contain p-2" />
        <Button variant={"destructive"} size="icon" className={cn("absolute top-4 right-4")} onClick={handleRemoveFile} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <XIcon className="size" />}
        </Button>
    </div>
}

export function RenderUploadingState({ progress, file }: { progress: number, file: File }) {
    return (
        <div className="text-center flex justify-center items-center flex-col">
            <p>{progress}
            </p>
            <p className="mt-2 text-sm font-medium">
                Uploading...
            </p>
            <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
                {file.name}
            </p>
        </div>
    )
}