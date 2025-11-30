import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth/middleware'

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateUser(request)

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      businessName,
      businessCategory,
      businessDescription,
      businessAddress,
      businessPhone,
      businessWebsite
    } = body

    // Validate input
    if (businessName && (typeof businessName !== 'string' || businessName.trim().length === 0)) {
      return NextResponse.json(
        { message: 'Nama bisnis tidak valid' },
        { status: 400 }
      )
    }

    // Update business profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        businessName: businessName?.trim() || null,
        businessCategory: businessCategory?.trim() || null,
        businessDescription: businessDescription?.trim() || null,
        businessAddress: businessAddress?.trim() || null,
        businessPhone: businessPhone?.trim() || null,
        businessWebsite: businessWebsite?.trim() || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        businessName: true,
        businessCategory: true,
        businessDescription: true,
        businessAddress: true,
        businessPhone: true,
        businessWebsite: true,
      }
    })

    return NextResponse.json({
      message: 'Profil bisnis berhasil diperbarui',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update business profile error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}