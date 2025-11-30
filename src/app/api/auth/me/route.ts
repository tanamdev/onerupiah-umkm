import { NextRequest, NextResponse } from 'next/server'
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

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        phone: user.phone,
        avatar: user.avatar,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessDescription: user.businessDescription,
        businessAddress: user.businessAddress,
        businessPhone: user.businessPhone,
        businessWebsite: user.businessWebsite,
        storeName: user.storeName,
        storeLogo: user.storeLogo,
        storeImage: user.storeImage,
        storeAddress: user.storeAddress,
        storePhone: user.storePhone,
        primaryColor: user.primaryColor,
        secondaryColor: user.secondaryColor,
        thirdColor: user.thirdColor,
        aiProvider: user.aiProvider,
        aiModel: user.aiModel,
        aiApiKey: user.aiApiKey,
        aiTemperature: user.aiTemperature,
        aiMaxTokens: user.aiMaxTokens,
        aiToneOfVoice: user.aiToneOfVoice,
        aiTargetAudience: user.aiTargetAudience,
        aiPlatforms: user.aiPlatforms,
        aiCustomInstructions: user.aiCustomInstructions,
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}