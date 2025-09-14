import arkjet, { detectBot, fixedWindow } from "@/lib/arkjet";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const aj = arkjet.withRule(detectBot({ mode: "LIVE", allow: [] })).withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 10 }))

export async function DELETE(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    try {

        const decision = await aj.protect(request, { fingerprint: session?.user.id as string })

        if (decision.isDenied()) {
            return NextResponse.json({ error: "Bot not allowed" }, { status: 429 })
        }

        const body = await request.json();
        const key = body.key;

        console.log(body)

        if (!key) {
            return NextResponse.json(
                {
                    error: "Key is required"
                },
                { status: 400 }
            )
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key
        })

        await S3.send(command)

        return NextResponse.json({ message: "File deleted succesfully" }, { status: 200 })

    } catch {
        return NextResponse.json({ message: "Missing or invalid object key" }, { status: 500 })
    }

}