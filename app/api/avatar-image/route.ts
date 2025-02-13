import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/auth.config"
import { cloudinary } from '@/lib/cloudinary'
import type { UploadApiResponse } from 'cloudinary'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'avatars',
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          max_bytes: 5242880, // 5MB
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as UploadApiResponse)
        }
      ).end(buffer)
    })

    // Actualizar el avatar del usuario
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: result.secure_url
      }
    })

    return NextResponse.json({
      success: true,
      image: updatedUser.image
    })

  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json(
      { error: 'Failed to update avatar' },
      { status: 500 }
    )
  }
}