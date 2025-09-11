import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";


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
