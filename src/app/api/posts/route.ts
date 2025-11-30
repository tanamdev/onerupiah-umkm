import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPostSchema, postSchema } from '@/lib/validations/schemas'

// Mock data for demonstration
let posts = [
  {
    id: '1',
    title: 'First Post',
    content: 'This is the content of the first post.',
    authorId: '1',
    author: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'This is the content of the second post.',
    authorId: '2',
    author: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
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
    const paginatedPosts = posts.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit),
        hasNext: endIndex < posts.length,
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
    const validatedData = createPostSchema.parse(body)

    // For demo purposes, we'll use the first user as author
    // In a real app, you'd get this from authentication
    const mockAuthor = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Create new post
    const newPost = {
      id: Date.now().toString(),
      ...validatedData,
      authorId: mockAuthor.id,
      author: mockAuthor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    posts.unshift(newPost)

    return NextResponse.json({
      data: newPost,
      message: 'Post created successfully',
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