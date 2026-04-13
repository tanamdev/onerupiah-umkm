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
      role: UserRole.SUPER_ADMIN, // Pastikan menjadi SUPER_ADMIN
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
  console.log(`Email    : ${adminEmail}`)
  console.log(`Password : ${adminPassword}`)
  console.log(`Role     : ${admin.role}`)
  console.log(`-----------------------------------`)
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
