"use client"
import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { RenderEmptyState, RenderErrorState } from './RenderState'
import { toast } from 'sonner'
import { uuidv4 } from 'zod'

interface UploaderState {
    id: string | null
    file: File | null
    uploading: boolean
    progress: number
    key?: string
    isDeleting: boolean
    error: boolean
    objectUrl?: string
    fileType: "image" | "video"
}

export default function Uploader() {

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        fileType: "image",
        id: null,
        isDeleting: false,
        progress: 0,
        uploading: false
    })

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0
        }))

        try {
            // 1. get presign url
            const presignedResponse = await fetch('/api/s3/upload',
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileName: file.name, contentType: file.type, size: file.size, isImage: true })
                }
            )

            if (!presignedResponse.ok) {
                toast.error('Error uploading file')
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true
                }))

                return
            }

            const { presignedUrl, key } = await presignedResponse.json()

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = Math.round((event.loaded / event.total) * 100)

                        setFileState((prev) => ({
                            ...prev,
                            progress: percentageCompleted
                        }))
                    }
                }

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            key,
                        }))
                        toast.success('Successfully uploaded file')
                        resolve()
                    } else {
                        reject(new Error("Upload failed"))
                    }

                }

                xhr.onerror = () => {
                    reject(new Error("Upload failed"))
                }

                xhr.open('PUT', presignedUrl)
                xhr.setRequestHeader('Content-Type', file.type)
                xhr.send(file)

            })
        }
        catch {
            toast.error("Something went wrong")
            setFileState((prev) => ({
                ...prev,
                progress: 0,
                error: true,
                uploading: false
            }))
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4().toString(),
                isDeleting: false,
                fileType: "image"
            })
            uploadFile(file)
        }
    }, [])

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code == 'too-many-files')
            if (tooManyFiles) {
                toast.error('Too many files (max is 1)')
            }

            const fileSizeTooBig = fileRejection.find((rejection) => rejection.errors[0].code == 'file-too-large')
            if (fileSizeTooBig) {
                toast.error('File size too big (max is 5MB)')
            }
        }
    }

    function RenderContent() {
        if (fileState.uploading) {
            return <h1>uploading...</h1>
        }
        if (fileState.error) {
            return <RenderErrorState />
        }

        if (fileState.objectUrl) {
            return (
                <h1>Uploaded file</h1>
            )
        }
        return <RenderEmptyState isDragActive={isDragActive} />
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone(
        {
            onDrop,
            accept: { 'image/*': [] },
            maxFiles: 1,
            multiple: false,
            maxSize: 20 * 1024 * 1024,
            onDropRejected: rejectedFiles,
        }
    )
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 rounded-none ease-in-out w-full h-42",
            isDragActive ? 'border-primary bg-primary/10 border-solid'
                : "border-border hover:border-primary"
        )}>
            <CardContent className='flex items-center justify-center h-full w-full'>
                <input {...getInputProps()} />
                <RenderContent />
            </CardContent>

        </Card>
    )
}
