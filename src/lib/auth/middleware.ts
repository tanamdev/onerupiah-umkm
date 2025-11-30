import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth/jwt'

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return null
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return null
    }

    // Check if session exists and is valid
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!session) {
      return null
    }

    // Get user details - add safety check for userId
    if (!decoded.userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return user

  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}