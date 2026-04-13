import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function authenticateUser(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return null;
    }

    const userEmail = token.email;
    if (!userEmail) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
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

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
