import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { updateUserSchema, userSchema } from '@/lib/validations/schemas'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = users.find(u => u.id === id)

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: user,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      )
    }

    // Check if email is being updated and if it's already taken
    if (validatedData.email) {
      const existingUser = users.find(user =>
        user.email === validatedData.email && user.id !== id
      )
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email already taken', success: false },
          { status: 400 }
        )
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      data: users[userIndex],
      message: 'User updated successfully',
      success: true,
    })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      )
    }

    const deletedUser = users[userIndex]
    users.splice(userIndex, 1)

    return NextResponse.json({
      data: deletedUser,
      message: 'User deleted successfully',
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}