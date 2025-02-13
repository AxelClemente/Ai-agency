import { NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/auth.config"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export async function POST(req: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    // Convertir el archivo a un buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a Cloudinary con configuración de tamaño
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'restaurants',
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          max_bytes: 10485760, // 10MB en bytes
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return new NextResponse("Error uploading file", { status: 500 })
  }
}