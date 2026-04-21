import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { subscriptionService } from '@/lib/subscription';
import { registerSchema } from '@/lib/validations/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstIssue.message, field: firstIssue.path[0] },
        { status: 400 },
      );
    }

    const { name, email, password, phone } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone?.trim() || null,
        isActive: true,
        emailVerified: false,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Create default free subscription
    await subscriptionService.createDefaultSubscription(newUser.id);

    return NextResponse.json({
      message: 'Registrasi berhasil! Anda mendapatkan akses paket Free selamanya (kuota reset tiap 7 hari).',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Check for Prisma unique constraint error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}
