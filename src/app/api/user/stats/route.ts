import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request)

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Count user's content generations
    const contentCount = await prisma.contentGeneration.count({
      where: {
        userId: user.id
      }
    })

    // Count user's image generations
    const imageCount = await prisma.imageGeneration.count({
      where: {
        userId: user.id
      }
    })

    // For auto replies, we'll use a placeholder count for now
    // This can be implemented later when we have auto reply functionality
    const autoReplyCount = 0

    // Calculate credits used (each content generation = 1 credit, each image generation = 2 credits)
    const creditsUsed = contentCount + (imageCount * 2)

    const stats = {
      contentGenerated: contentCount,
      imagesGenerated: imageCount,
      autoReplies: autoReplyCount,
      creditsUsed
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}