import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createUserSchema, userSchema } from '@/lib/validations/schemas'

// Mock data for demonstration
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
        hasNext: endIndex < users.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = users.find(user => user.email === validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists', success: false },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)

    return NextResponse.json({
      data: newUser,
      message: 'User created successfully',
      success: true,
      status: 201,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          success: false,
          errors: error.issues.reduce((acc, err) => {
            acc[err.path.join('.')] = err.message
            return acc
          }, {} as Record<string, string>),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}