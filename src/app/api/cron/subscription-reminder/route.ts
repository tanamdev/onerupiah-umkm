import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionReminder } from '@/services/emailService';

/**
 * GET /api/cron/subscription-reminder
 *
 * Endpoint ini dipanggil secara berkala (cron) untuk mengirim email notifikasi
 * kepada user yang langganannya akan berakhir dalam 7 hari atau 1 hari.
 *
 * Proteksi: header Authorization: Bearer <CRON_SECRET>
 *
 * Logika de-duplikasi:
 *   Sebelum kirim, cek apakah ActivityLog dengan action yang sama sudah ada
 *   dalam 24 jam terakhir untuk userId tersebut. Jika sudah, skip.
 */
export async function GET(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET belum dikonfigurasi di environment.' },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : request.nextUrl.searchParams.get('secret');

  if (token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Ambil subscription yang akan berakhir ─────────────────────────────────
  const now = new Date();

  // Window 7-hari: 6 hari 0 jam s/d 7 hari 23:59 dari sekarang
  const window7Start = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  const window7End = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);

  // Window 1-hari: 0 jam s/d 2 hari dari sekarang
  const window1Start = now;
  const window1End = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const [expiring7, expiring1] = await Promise.all([
    prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: { in: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY'] },
        endDate: { gte: window7Start, lt: window7End },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: { in: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY'] },
        endDate: { gte: window1Start, lt: window1End },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  const results = {
    reminder7d: { sent: 0, skipped: 0, failed: 0 },
    reminder1d: { sent: 0, skipped: 0, failed: 0 },
  };

  // ── Helper: cek apakah reminder sudah terkirim hari ini ───────────────────
  async function alreadySentToday(userId: string, action: string): Promise<boolean> {
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const existing = await prisma.activityLog.findFirst({
      where: {
        userId,
        activityType: 'SUBSCRIPTION_CHANGE',
        action,
        timestamp: { gte: since },
      },
    });
    return existing !== null;
  }

  // ── Helper: catat ke ActivityLog ──────────────────────────────────────────
  async function logReminderSent(
    userId: string,
    action: string,
    daysLeft: number,
  ) {
    await prisma.activityLog.create({
      data: {
        userId,
        activityType: 'SUBSCRIPTION_CHANGE',
        action,
        description: `Email reminder langganan berhasil dikirim (${daysLeft} hari tersisa)`,
        metadata: { daysLeft, sentAt: now.toISOString() },
        success: true,
      },
    });
  }

  // ── Proses 7-hari reminder ────────────────────────────────────────────────
  for (const sub of expiring7) {
    const { user, plan, endDate } = sub;
    const action = 'email_reminder_7d';
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    try {
      if (await alreadySentToday(user.id, action)) {
        results.reminder7d.skipped++;
        continue;
      }

      await sendSubscriptionReminder({
        toEmail: user.email,
        userName: user.name,
        plan,
        endDate,
        daysLeft,
      });

      await logReminderSent(user.id, action, daysLeft);
      results.reminder7d.sent++;
    } catch (err) {
      console.error(`[cron] Gagal kirim 7d reminder ke ${user.email}:`, err);
      results.reminder7d.failed++;
    }
  }

  // ── Proses 1-hari reminder ────────────────────────────────────────────────
  for (const sub of expiring1) {
    const { user, plan, endDate } = sub;
    const action = 'email_reminder_1d';
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    try {
      if (await alreadySentToday(user.id, action)) {
        results.reminder1d.skipped++;
        continue;
      }

      await sendSubscriptionReminder({
        toEmail: user.email,
        userName: user.name,
        plan,
        endDate,
        daysLeft,
      });

      await logReminderSent(user.id, action, daysLeft);
      results.reminder1d.sent++;
    } catch (err) {
      console.error(`[cron] Gagal kirim 1d reminder ke ${user.email}:`, err);
      results.reminder1d.failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    runAt: now.toISOString(),
    results,
  });
}
