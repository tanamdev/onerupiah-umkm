import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

async function getSmtpConfig(): Promise<SmtpConfig> {
  // DB-first, fallback to env vars
  try {
    const row = await prisma.systemSettings.findUnique({
      where: { key: 'smtp' },
    });
    if (row) {
      const config = JSON.parse(row.value) as SmtpConfig;
      if (config.host && config.user && config.pass) return config;
    }
  } catch {
    // ignore DB errors, fallback to env
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'Konfigurasi SMTP tidak lengkap. Pastikan SMTP_HOST, SMTP_USER, dan SMTP_PASS sudah diset.',
    );
  }

  return {
    host,
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user,
    pass,
    fromName: process.env.SMTP_FROM_NAME ?? 'Asisten UMKM',
    fromEmail: process.env.SMTP_FROM_EMAIL ?? user,
  };
}

function createTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

// ─── Template helpers ────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function formatPlan(plan: string): string {
  const map: Record<string, string> = {
    PREMIUM_MONTHLY: 'Premium Bulanan',
    PREMIUM_YEARLY: 'Premium Tahunan',
    FREE: 'Gratis',
    TRIAL: 'Trial',
  };
  return map[plan] ?? plan;
}

function buildReminderEmail(params: {
  userName: string;
  planName: string;
  endDate: Date;
  daysLeft: number;
  renewUrl: string;
}): { subject: string; html: string } {
  const { userName, planName, endDate, daysLeft, renewUrl } = params;
  const isUrgent = daysLeft <= 1;

  const subject = isUrgent
    ? `⚠️ Langganan Asisten UMKM Anda berakhir BESOK!`
    : `Pengingat: Langganan Asisten UMKM Anda berakhir dalam ${daysLeft} hari`;

  const urgentBanner = isUrgent
    ? `<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;color:#DC2626;font-weight:700;font-size:15px;">
          ⚠️ Langganan Anda berakhir BESOK, ${formatDate(endDate)}
        </p>
      </div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:'Segoe UI','Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#E21B1B;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                Asisten UMKM
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:500;">
                AI Assistant 24/7 untuk UMKM Indonesia
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">

              ${urgentBanner}

              <p style="margin:0 0 12px;color:#111827;font-size:18px;font-weight:600;">
                Halo, ${userName}!
              </p>
              <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.7;">
                ${
                  isUrgent
                    ? 'Ini adalah pengingat terakhir bahwa langganan <strong>Asisten UMKM</strong> Anda akan berakhir <strong>besok</strong>. Perpanjang sekarang agar akses fitur AI Anda tetap aktif tanpa henti.'
                    : `Langganan <strong>Asisten UMKM</strong> Anda akan berakhir dalam <strong>${daysLeft} hari</strong>. Perpanjang sekarang untuk terus menikmati semua fitur cerdas tanpa gangguan.`
                }
              </p>

              <!-- Info card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#F3F4F6;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6B7280;font-size:14px;padding-bottom:12px;">Paket Aktif</td>
                        <td align="right" style="color:#111827;font-size:14px;font-weight:700;padding-bottom:12px;">
                          ${planName}
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#6B7280;font-size:14px;padding-bottom:12px;border-top:1px solid #E5E7EB;padding-top:12px;">
                          Berakhir Pada
                        </td>
                        <td align="right"
                          style="color:${isUrgent ? '#DC2626' : '#111827'};font-size:14px;font-weight:700;border-top:1px solid #E5E7EB;padding-top:12px;">
                          ${formatDate(endDate)}
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#6B7280;font-size:14px;padding-top:12px;border-top:1px solid #E5E7EB;">
                          Sisa Waktu
                        </td>
                        <td align="right"
                          style="color:${isUrgent ? '#DC2626' : '#E21B1B'};font-size:14px;font-weight:700;padding-top:12px;border-top:1px solid #E5E7EB;">
                          ${daysLeft <= 0 ? 'Berakhir hari ini' : daysLeft === 1 ? '1 hari lagi' : `${daysLeft} hari lagi`}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${renewUrl}"
                      style="display:inline-block;background:#E21B1B;color:#FFFFFF;font-size:16px;font-weight:700;
                             text-decoration:none;padding:16px 48px;border-radius:12px;box-shadow:0 4px 6px rgba(226, 27, 27, 0.2);">
                      Perpanjang Sekarang
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px;color:#9CA3AF;font-size:13px;text-align:center;">
                Atau kunjungi dashboard di
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard"
                  style="color:#E21B1B;text-decoration:none;font-weight:600;">
                  asistenumkm.id
                </a>
              </p>

              <hr style="border:none;border-top:1px solid #F3F4F6;margin:32px 0;" />

              <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.6;">
                Email ini dikirim otomatis. Jika Anda sudah memperpanjang, silakan abaikan pesan ini.<br/>
                &copy; ${new Date().getFullYear()} Asisten UMKM &mdash; AI All-in-One untuk UMKM Indonesia
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SendReminderParams {
  toEmail: string;
  userName: string;
  plan: string;
  endDate: Date;
  daysLeft: number;
}

export async function sendSubscriptionReminder(
  params: SendReminderParams,
): Promise<void> {
  const config = await getSmtpConfig();
  const transporter = createTransporter(config);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://asistenumkm.id';
  const renewUrl = `${baseUrl}/dashboard/subscription`;

  const { subject, html } = buildReminderEmail({
    userName: params.userName,
    planName: formatPlan(params.plan),
    endDate: params.endDate,
    daysLeft: params.daysLeft,
    renewUrl,
  });

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: params.toEmail,
    subject,
    html,
  });
}

/** Verifikasi koneksi SMTP (untuk health-check) */
export async function verifySmtpConnection(): Promise<void> {
  const config = await getSmtpConfig();
  const transporter = createTransporter(config);
  await transporter.verify();
}
