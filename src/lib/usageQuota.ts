import { prisma } from '@/lib/prisma'
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client'

export interface UsageInfo {
  contentUsed: number
  imageUsed: number
  contentLimit: number | null  // null = unlimited
  imageLimit: number | null    // null = unlimited
  canGenerateContent: boolean
  canGenerateImage: boolean
  resetAt: Date | null         // Kapan periode saat ini dimulai
  nextResetAt: Date | null     // Kapan periode berikutnya (untuk Free)
  periodDays: number           // Durasi satu periode dalam hari
  plan: SubscriptionPlan | null
}

/**
 * Ambil subscription aktif user beserta package-nya
 */
async function getActiveSubscriptionWithPackage(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      package: true,
    },
  })
}

/**
 * Tentukan apakah subscription Free perlu direset kuotanya.
 * Reset dilakukan jika sudah >= `duration` hari sejak `usageResetAt` (atau `startDate`).
 */
function shouldResetFreeQuota(
  usageResetAt: Date | null,
  startDate: Date,
  durationDays: number
): boolean {
  const referenceDate = usageResetAt ?? startDate
  const now = new Date()
  const diffMs = now.getTime() - referenceDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= durationDays
}

/**
 * Cek dan lakukan reset kuota jika sudah waktunya (khusus Free plan).
 * Untuk plan berbayar: reset kuota saat awal periode baru (saat subscription diperbarui).
 * Fungsi ini aman dipanggil berulang kali — hanya reset jika memang sudah waktunya.
 */
export async function maybeResetFreeQuota(userId: string): Promise<void> {
  const subscription = await getActiveSubscriptionWithPackage(userId)
  if (!subscription) return

  // Hanya reset otomatis untuk Free plan
  if (subscription.plan !== SubscriptionPlan.FREE) return

  const durationDays = subscription.package?.duration ?? 7
  const needsReset = shouldResetFreeQuota(
    subscription.usageResetAt,
    subscription.startDate,
    durationDays
  )

  if (needsReset) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        usageResetAt: new Date(),
      },
    })
  }
}

/**
 * Hitung penggunaan konten dan gambar user dalam periode aktif saat ini.
 * Periode dihitung dari `usageResetAt` (atau `startDate` jika belum pernah reset).
 */
async function countUsageInPeriod(
  userId: string,
  periodStart: Date
): Promise<{ contentUsed: number; imageUsed: number }> {
  const [contentUsed, imageUsed] = await Promise.all([
    prisma.contentGeneration.count({
      where: {
        userId,
        status: 'COMPLETED',
        createdAt: { gte: periodStart },
      },
    }),
    prisma.imageGeneration.count({
      where: {
        userId,
        status: 'COMPLETED',
        createdAt: { gte: periodStart },
      },
    }),
  ])

  return { contentUsed, imageUsed }
}

/**
 * Ambil info kuota lengkap untuk user.
 * Ini adalah fungsi utama yang dipakai oleh API endpoint.
 *
 * Flow:
 * 1. Jika tidak ada subscription aktif → tidak bisa generate
 * 2. Untuk FREE: cek & reset kuota jika sudah waktunya, lalu hitung pemakaian sejak reset
 * 3. Untuk berbayar: hitung pemakaian sejak `startDate` (reset saat paket diperbarui)
 * 4. Bandingkan pemakaian dengan limit dari package
 */
export async function checkUserQuota(userId: string): Promise<UsageInfo> {
  // Coba reset dulu (hanya efek jika sudah waktunya & Free plan)
  await maybeResetFreeQuota(userId)

  // Ambil subscription terbaru (setelah kemungkinan reset)
  const subscription = await getActiveSubscriptionWithPackage(userId)

  if (!subscription) {
    return {
      contentUsed: 0,
      imageUsed: 0,
      contentLimit: 0,
      imageLimit: 0,
      canGenerateContent: false,
      canGenerateImage: false,
      resetAt: null,
      nextResetAt: null,
      periodDays: 0,
      plan: null,
    }
  }

  const pkg = subscription.package
  const contentLimit = pkg?.maxContentGenerations ?? null
  const imageLimit = pkg?.maxImageGenerations ?? null
  const durationDays = pkg?.duration ?? 30

  // Tentukan awal periode untuk menghitung pemakaian
  const periodStart = subscription.usageResetAt ?? subscription.startDate

  const { contentUsed, imageUsed } = await countUsageInPeriod(userId, periodStart)

  // Hitung next reset (hanya relevan untuk Free plan)
  let nextResetAt: Date | null = null
  if (subscription.plan === SubscriptionPlan.FREE) {
    nextResetAt = new Date(periodStart.getTime() + durationDays * 24 * 60 * 60 * 1000)
  }

  const canGenerateContent = contentLimit === null ? true : contentUsed < contentLimit
  const canGenerateImage = imageLimit === null ? true : imageUsed < imageLimit

  return {
    contentUsed,
    imageUsed,
    contentLimit,
    imageLimit,
    canGenerateContent,
    canGenerateImage,
    resetAt: periodStart,
    nextResetAt,
    periodDays: durationDays,
    plan: subscription.plan,
  }
}
