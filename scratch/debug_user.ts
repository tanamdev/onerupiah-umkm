import { checkUserQuota } from '@/lib/usageQuota';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugUser(userId: string) {
  console.log(`Debugging user: ${userId}`);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        include: { package: true }
      }
    }
  });

  if (!user) {
    console.log('User not found.');
    return;
  }

  console.log('User Subscriptions:');
  user.subscriptions.forEach(sub => {
    console.log(`- ID: ${sub.id}`);
    console.log(`  Plan: ${sub.plan}`);
    console.log(`  Status: ${sub.status}`);
    console.log(`  Package ID: ${sub.packageId}`);
    console.log(`  Package Name: ${sub.package?.name}`);
    console.log(`  Usage Reset At: ${sub.usageResetAt}`);
    console.log(`  Start Date: ${sub.startDate}`);
    console.log(`  End Date: ${sub.endDate}`);
  });

  const quota = await checkUserQuota(userId);
  console.log('\nQuota Info:');
  console.log(JSON.stringify(quota, null, 2));

  const contentCount = await prisma.contentGeneration.count({
    where: { userId }
  });
  console.log(`\nTotal Content Generations in DB: ${contentCount}`);
}

const targetUserId = 'cmny4fgha002e314nu0rgx8fq';
debugUser(targetUserId)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
