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
      aiProvider,
      aiModel,
      aiApiKey,
      aiTemperature,
      aiMaxTokens
    } = body

    // Validate input
    if (aiProvider && (typeof aiProvider !== 'string' || !['gemini', 'openai'].includes(aiProvider))) {
      return NextResponse.json(
        { message: 'AI provider tidak valid' },
        { status: 400 }
      )
    }

    if (aiTemperature && (typeof aiTemperature !== 'number' || aiTemperature < 0 || aiTemperature > 2)) {
      return NextResponse.json(
        { message: 'Temperature harus antara 0 dan 2' },
        { status: 400 }
      )
    }

    if (aiMaxTokens && (typeof aiMaxTokens !== 'number' || aiMaxTokens < 1 || aiMaxTokens > 100000)) {
      return NextResponse.json(
        { message: 'Max tokens harus antara 1 dan 100000' },
        { status: 400 }
      )
    }

    // Update AI settings
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        aiProvider: aiProvider?.trim() || null,
        aiModel: aiModel?.trim() || null,
        aiApiKey: aiApiKey?.trim() || null,
        aiTemperature: aiTemperature || null,
        aiMaxTokens: aiMaxTokens || null,
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
        aiProvider: true,
        aiModel: true,
        aiApiKey: true,
        aiTemperature: true,
        aiMaxTokens: true,
        aiToneOfVoice: true,
        aiTargetAudience: true,
        aiPlatforms: true,
        aiCustomInstructions: true,
      }
    })

    return NextResponse.json({
      message: 'Pengaturan AI berhasil diperbarui',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update AI settings error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}