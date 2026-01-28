import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { put } from '@vercel/blob'

const allowedKinds = new Set(["stall-image", "insurance"])

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }

    const form = await request.formData()
    const file = form.get('file') as File | null
    const kind = form.get('kind') as string | null

    if (!file) {
      return NextResponse.json({ error: 'no file provided' }, { status: 400 })
    }

    if (!kind || !allowedKinds.has(kind)) {
      return NextResponse.json({ error: 'invalid kind' }, { status: 400 })
    }

    const token = process.env.BLOB_STORE_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'missing BLOB_STORE_READ_WRITE_TOKEN' }, { status: 500 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const timestamp = Date.now()
    const blob = await put(`stalls/${session.user.email}/${kind}/${timestamp}-${safeName}`, buffer, {
      contentType: file.type || 'application/octet-stream',
      access: 'public',
      token
    })

    return NextResponse.json({ url: blob.url })
  } catch (err: { message?: string } | unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
