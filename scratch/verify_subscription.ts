import { subscriptionService } from '@/lib/subscription';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('Testing Free Subscription Creation...');

  // 1. Create a dummy user
  const email = `test-${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Test User',
      password: 'hashedpassword',
      isActive: true,
      role: 'USER',
    }
  });
  console.log(`User created: ${user.id} (${user.email})`);

  // 2. Create default subscription
  await subscriptionService.createDefaultSubscription(user.id);
  console.log('Default subscription created.');

  // 3. Verify in DB
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    include: { package: true }
  });

  if (subscription) {
    console.log('Subscription found:');
    console.log(`- Plan: ${subscription.plan}`);
    console.log(`- Status: ${subscription.status}`);
    console.log(`- Package ID: ${subscription.packageId}`);
    console.log(`- Package Name: ${subscription.package?.name}`);
    console.log(`- Usage Reset At: ${subscription.usageResetAt}`);

    if (subscription.plan === 'FREE' && subscription.packageId === 'package-free') {
      console.log('✅ TEST PASSED: Free subscription correctly created.');
    } else {
      console.log('❌ TEST FAILED: Subscription logic incorrect.');
    }
  } else {
    console.log('❌ TEST FAILED: Subscription not created.');
  }

  // Cleanup
  await prisma.subscription.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Cleanup done.');
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
