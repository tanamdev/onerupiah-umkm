import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

const smtpSchema = z.object({
  provider: z.enum(['google', 'outlook', 'yahoo', 'custom']),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  secure: z.boolean(),
  user: z.string().min(1),
  pass: z.string().optional(),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
});

export async function GET(request: NextRequest) {
  try {
    const row = await prisma.systemSettings.findUnique({
      where: { key: 'smtp' },
    });

    if (!row) {
      return NextResponse.json({ success: true, data: null });
    }

    const config = JSON.parse(row.value);
    // Mask password
    if (config.pass) config.pass = '••••••••';

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('❌ Error fetching SMTP settings:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil konfigurasi SMTP' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const body = await request.json();

    const parsed = smtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Remove ID if exists to prevent Prisma error on upsert mapping
    const { id, ...configToSave } = body;

    // Validate again without ID
    const validatedData = smtpSchema.parse(configToSave);

    // If pass is masked (unchanged), keep existing password
    if (!validatedData.pass || validatedData.pass === '••••••••') {
      const existing = await prisma.systemSettings.findUnique({
        where: { key: 'smtp' },
      });
      if (existing) {
        const existingConfig = JSON.parse(existing.value);
        validatedData.pass = existingConfig.pass;
      } else {
        return NextResponse.json(
          { success: false, error: 'Password SMTP wajib diisi' },
          { status: 400 },
        );
      }
    }

    await prisma.systemSettings.upsert({
      where: { key: 'smtp' },
      create: {
        key: 'smtp',
        value: JSON.stringify(validatedData),
        updatedBy: (token as any)?.email || (token as any)?.name || 'admin',
      },
      update: {
        value: JSON.stringify(validatedData),
        updatedBy: (token as any)?.email || (token as any)?.name || 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Konfigurasi SMTP berhasil disimpan',
    });
  } catch (error) {
    console.error('❌ Error saving SMTP settings:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan konfigurasi SMTP' },
      { status: 500 },
    );
  }
}
