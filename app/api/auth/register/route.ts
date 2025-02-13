import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    console.log('📝 Received registration data:', { name, email, passwordLength: password?.length })

    if (!email || !password || !name) {
      console.log('❌ Missing fields:', { email: !!email, password: !!password, name: !!name })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log('🔍 Existing user check:', !!existingUser)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('🔒 Password hashed successfully')

    // Crear el usuario
    console.log('👤 Attempting to create user with data:', {
      name,
      email,
      passwordHash: hashedPassword.substring(0, 10) + '...'
    })

    try {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })
      console.log('✅ User created successfully')
    } catch (prismaError) {
      console.error('❌ Prisma error:', prismaError)
      throw prismaError
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          name,
          email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}