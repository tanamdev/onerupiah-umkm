import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    void request;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        phone: true,
        avatar: true,
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
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    const response = NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 },
    );

    const nextAuthCookies = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
    ];

    for (const cookieName of nextAuthCookies) {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
    }

    return response;
  }
}
