import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const testSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  secure: z.boolean(),
  user: z.string().min(1),
  pass: z.string().min(1),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  toEmail: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = testSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { host, port, secure, user, pass, fromName, fromEmail, toEmail } = parsed.data;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: 'Test Email dari Picapik Admin',
      html: `<p>Konfigurasi SMTP berhasil! Email ini dikirim dari pengaturan admin Picapik.</p>`,
    });

    return NextResponse.json({ success: true, message: 'Test email berhasil dikirim' });
  } catch (error: any) {
    console.error('❌ SMTP test failed:', error);
    return NextResponse.json(
      { success: false, error: error.message ?? 'Koneksi SMTP gagal' },
      { status: 400 },
    );
  }
}
