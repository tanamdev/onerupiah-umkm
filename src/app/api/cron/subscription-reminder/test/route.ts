import { NextRequest, NextResponse } from 'next/server';
import { verifySmtpConnection, sendSubscriptionReminder } from '@/services/emailService';
import { getToken } from 'next-auth/jwt';

/**
 * POST /api/cron/subscription-reminder/test
 * Body: { "email": "target@example.com" }
 *
 * Kirim contoh email reminder ke alamat tertentu untuk memverifikasi konfigurasi SMTP.
 * Hanya bisa diakses oleh ADMIN / SUPER_ADMIN.
 */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !['ADMIN', 'SUPER_ADMIN'].includes((token as any).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email } = await request.json().catch(() => ({}));
  if (!email || typeof email !== 'string') {
    return NextResponse.json(
      { error: 'Body harus berisi field "email"' },
      { status: 400 },
    );
  }

  try {
    await verifySmtpConnection();
  } catch (err) {
    return NextResponse.json(
      { error: 'Koneksi SMTP gagal', detail: (err as Error).message },
      { status: 500 },
    );
  }

  try {
    await sendSubscriptionReminder({
      toEmail: email,
      userName: 'Pengguna Test',
      plan: 'PREMIUM_MONTHLY',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      daysLeft: 7,
    });

    return NextResponse.json({
      ok: true,
      message: `Email test berhasil dikirim ke ${email}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Gagal mengirim email', detail: (err as Error).message },
      { status: 500 },
    );
  }
}
