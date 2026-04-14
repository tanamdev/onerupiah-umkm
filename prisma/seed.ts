import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Tentukan kredensial admin
  const adminEmail = 'admin@onerupiah.com'
  const adminPassword = 'password123'
  
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(adminPassword, salt)

  // Gunakan upsert agar aman jika difetch berulang kali (tidak duplicate)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      emailVerified: true
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      emailVerified: true
    }
  })

  console.log(`✅ Admin user seeded berhasil!`)
  console.log(`-----------------------------------`)
  
  // SEED PACKAGES
  const freePackage = await prisma.package.upsert({
    where: { id: 'package-free' },
    update: {
      name: 'Free',
      description: 'Paket gratis dengan reset kuota setiap 7 hari',
      maxContentGenerations: 5,
      maxImageGenerations: 5,
      features: JSON.stringify([
        "5 Generate Gambar per 7 Hari",
        "5 Generate Konten per 7 Hari",
        "Akses Selamanya (kuota reset tiap 7 hari)"
      ]),
    },
    create: {
      id: 'package-free',
      name: 'Free',
      description: 'Paket gratis dengan reset kuota setiap 7 hari',
      price: 0,
      currency: 'IDR',
      duration: 7,
      maxContentGenerations: 5,
      maxImageGenerations: 5,
      features: JSON.stringify([
        "5 Generate Gambar per 7 Hari",
        "5 Generate Konten per 7 Hari",
        "Akses Selamanya (kuota reset tiap 7 hari)"
      ]),
      isActive: true,
    }
  })

  const proPackage = await prisma.package.upsert({
    where: { id: 'package-pro' },
    update: {},
    create: {
      id: 'package-pro',
      name: 'Pro',
      description: 'Paket profesional untuk bisnis Anda',
      price: 100000,
      currency: 'IDR',
      duration: 30,
      maxContentGenerations: 50,
      maxImageGenerations: 30,
      features: JSON.stringify([
        "30 Generate Gambar",
        "50 Generate Konten",
        "Akses 30 Hari",
        "Prioritas Support"
      ]),
      isActive: true,
    }
  })

  console.log(`✅ Packages seeded berhasil! (Free & Pro)`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
