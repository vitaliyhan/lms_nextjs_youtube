import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/s3-client";
import { v4 as uuidv4 } from 'uuid';

const fileUploadSchema = z.object(
    {
        fileName: z.string().min(1, { message: "File name required" }),
        contentType: z.string().min(1, { message: "Content type required" }),
        size: z.number().min(1, { message: "Size required" }),
        isImage: z.boolean(),
    }
)

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = fileUploadSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 })
        }

        const { fileName, contentType, size } = validation.data

        const unuqueKey = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: unuqueKey
        })

        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 })

        const response = {
            presignedUrl,
            key: unuqueKey
        }

        return NextResponse.json(response)

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
