import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/s3-client";
import { v4 as uuidv4 } from 'uuid';
import arkjet, { detectBot, fixedWindow } from "@/lib/arkjet";
import { requireAdmin } from "@/app/data/admin/require-admin";

const fileUploadSchema = z.object(
    {
        fileName: z.string().min(1, { message: "File name required" }),
        contentType: z.string().min(1, { message: "Content type required" }),
        size: z.number().min(1, { message: "Size required" }),
        isImage: z.boolean(),
    }
)

const aj = arkjet.withRule(detectBot({ mode: "LIVE", allow: [] })).withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }))

export async function POST(request: Request) {
    const session = await requireAdmin()
    try {
        const decision = await aj.protect(request, { fingerprint: session?.user.id as string })

        if (decision.isDenied()) {
            return NextResponse.json({ error: "Bot not allowed" }, { status: 429 })
        }


        const body = await request.json();
        const validation = fileUploadSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 })
        }

        const { fileName, contentType, size } = validation.data

        const uniqueKey = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        })

        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 })

        const response = {
            presignedUrl,
            key: uniqueKey
        }

        return NextResponse.json(response)

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
