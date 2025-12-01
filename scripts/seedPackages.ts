import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPackages() {
  try {
    console.log('🌱 Seeding packages...')

    // Check if packages already exist
    const existingPackageCount = await prisma.package.count()

    if (existingPackageCount > 0) {
      console.log('✅ Packages already exist, skipping seed')
      return
    }

    const packages = [
      {
        name: 'UMKM Professional',
        description: 'Paket lengkap untuk bisnis UMKM yang ingin berkembang dengan bantuan AI',
        price: 290000, // Rp 290.000 per month (in cents for IDR)
        yearlyPrice: 2900000, // Rp 2.900.000 per year (10% discount)
        currency: 'IDR',
        features: {
          contentGenerations: '500 generasi konten per bulan',
          imageGenerations: '200 generasi gambar per bulan',
          aiAssistant: 'Asisten AI 24/7 untuk konsultasi bisnis',
          prioritySupport: 'Support prioritas 24 jam',
          customTemplates: 'Template konten kustom bisnis Anda',
          analytics: 'Analitik dan laporan performa konten',
          bulkGeneration: 'Generate 30 konten sekaligus',
          multiPlatform: 'Support semua platform media sosial',
          competitorAnalysis: 'Analisis kompetitor',
          hashtagOptimization: 'Optimasi hashtag otomatis',
          contentCalendar: 'Kalender konten terintegrasi'
        },
        maxContentGenerations: 500,
        maxImageGenerations: 200,
        duration: 30
      }
    ]

    for (const pkg of packages) {
      await prisma.package.create({
        data: pkg
      })
    }

    console.log(`✅ Created ${packages.length} packages`)
  } catch (error) {
    console.error('❌ Error seeding packages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedPackages()
}

export default seedPackages