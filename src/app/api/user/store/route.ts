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
      storeName,
      storeLogo,
      storeImage,
      storeAddress,
      storePhone,
      primaryColor,
      secondaryColor,
      thirdColor
    } = body

    // Validate input
    if (storeName && (typeof storeName !== 'string' || storeName.trim().length === 0)) {
      return NextResponse.json(
        { message: 'Nama toko tidak valid' },
        { status: 400 }
      )
    }

    // Update store profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        storeName: storeName?.trim() || null,
        storeLogo: storeLogo?.trim() || null,
        storeImage: storeImage?.trim() || null,
        storeAddress: storeAddress?.trim() || null,
        storePhone: storePhone?.trim() || null,
        primaryColor: primaryColor?.trim() || null,
        secondaryColor: secondaryColor?.trim() || null,
        thirdColor: thirdColor?.trim() || null,
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
        storeName: true,
        storeLogo: true,
        storeImage: true,
        storeAddress: true,
        storePhone: true,
        primaryColor: true,
        secondaryColor: true,
        thirdColor: true,
      }
    })

    return NextResponse.json({
      message: 'Profil toko berhasil diperbarui',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update store profile error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}