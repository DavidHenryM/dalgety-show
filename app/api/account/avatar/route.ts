import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { put } from "@vercel/blob";
import { auth } from "@lib/auth";
import { prisma } from "@lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
    }

    const form = await request.formData()
    const imageFile = form.get("file") as File | null

    if (!imageFile) {
      return NextResponse.json({ error: "no file provided" }, { status: 400 })
    }

    if (!imageFile.type?.startsWith("image/")) {
      return NextResponse.json({ error: "file must be an image" }, { status: 400 })
    }

    const token = process.env.BLOB_STORE_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "missing BLOB_STORE_READ_WRITE_TOKEN" }, { status: 500 })
    }

    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-")
    const filePath = `images/users/${session.user.id}/avatar-${Date.now()}-${safeName}`

    const blob = await put(filePath, buffer, {
      contentType: imageFile.type || "application/octet-stream",
      access: "public",
      token,
    })

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blob.url }
    })

    return NextResponse.json({ url: blob.url, userId: updatedUser.id })
  } catch (err: { message?: string } | unknown) {
    if (err && typeof err === "object" && "message" in err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
