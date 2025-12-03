import {
  PrismaClient,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

export interface SubscriptionService {
  createTrialSubscription(userId: string): Promise<void>;
  getUserSubscription(userId: string): Promise<any>;
  isSubscriptionActive(userId: string): Promise<boolean>;
  getSubscriptionDaysLeft(userId: string): Promise<number>;
  upgradeSubscription(userId: string, plan: SubscriptionPlan): Promise<void>;
  cancelSubscription(userId: string): Promise<void>;
  checkAndExpireSubscriptions(): Promise<void>;
}

class SubscriptionServiceImpl implements SubscriptionService {
  async createTrialSubscription(userId: string): Promise<void> {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (existingSubscription) {
      throw new Error('User already has a subscription');
    }

    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days trial

    await prisma.subscription.create({
      data: {
        userId,
        plan: SubscriptionPlan.TRIAL,
        status: SubscriptionStatus.ACTIVE,
        startDate: trialStartDate,
        endDate: trialEndDate,
        monthlyPrice: 0,
        autoRenew: false,
      },
    });
  }

  async getUserSubscription(userId: string): Promise<any> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return null;
    }

    const daysLeft = Math.ceil(
      (new Date(subscription.endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      ...subscription,
      daysLeft: Math.max(0, daysLeft),
      isExpired: daysLeft <= 0,
    };
  }

  async isSubscriptionActive(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      return false;
    }

    return (
      subscription.status === SubscriptionStatus.ACTIVE &&
      !subscription.isExpired
    );
  }

  async getSubscriptionDaysLeft(userId: string): Promise<number> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      return 0;
    }

    return subscription.daysLeft;
  }

  async upgradeSubscription(
    userId: string,
    plan: SubscriptionPlan
  ): Promise<void> {
    const currentSubscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    const startDate = new Date();
    const endDate = new Date(startDate);

    // Calculate pricing and duration based on plan
    let monthlyPrice = 0;
    let yearlyPrice: number | undefined = undefined;

    switch (plan) {
      case SubscriptionPlan.PREMIUM_MONTHLY:
        monthlyPrice = 99000; // Rp 99,000 per month
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case SubscriptionPlan.PREMIUM_YEARLY:
        monthlyPrice = 59000; // Rp 59,000 per month (billed annually)
        yearlyPrice = 708000; // Rp 708,000 per year
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case SubscriptionPlan.FREE:
        endDate.setFullYear(endDate.getFullYear() + 10); // Long expiry for free plan
        break;
      default:
        throw new Error('Invalid subscription plan');
    }

    if (currentSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { id: currentSubscription.id },
        data: {
          plan,
          status: SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
          monthlyPrice,
          yearlyPrice,
          autoRenew: plan !== SubscriptionPlan.FREE,
        },
      });
    } else {
      // Create new subscription
      await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
          monthlyPrice,
          yearlyPrice,
          autoRenew: plan !== SubscriptionPlan.FREE,
        },
      });
    }
  }

  async createOrUpdateSubscriptionFromPackage(
    userId: string,
    packageId: string,
    billingPeriod: 'MONTHLY' | 'YEARLY'
  ): Promise<void> {
    console.log('🔧 Starting subscription processing:', { userId, packageId, billingPeriod });

    // Use transaction for atomic operation
    await prisma.$transaction(async (tx) => {
      const currentActiveSubscription = await tx.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      const packageData = await tx.package.findUnique({
        where: { id: packageId },
      });

      if (!packageData) {
        console.error('❌ Package not found:', packageId);
        throw new Error(`Package not found: ${packageId}`);
      }

      console.log('📦 Found package data:', {
        id: packageData.id,
        name: packageData.name,
        price: packageData.price,
        duration: packageData.duration
      });

    const startDate = new Date();
      const endDate = new Date(startDate);

      // Calculate duration based on billing period or package duration
      if (packageData.duration) {
        // Use package duration if available
        endDate.setDate(endDate.getDate() + packageData.duration);
        console.log('📅 Using package duration:', packageData.duration, 'days');
      } else {
        // Fallback to billing period
        if (billingPeriod === 'YEARLY') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }
        console.log('📅 Using billing period:', billingPeriod);
      }

      // Determine subscription plan based on package
      let subscriptionPlan: SubscriptionPlan;
      if (
        packageData.name.toLowerCase().includes('premium') ||
        packageData.price > 0
      ) {
        subscriptionPlan =
          billingPeriod === 'YEARLY'
            ? SubscriptionPlan.PREMIUM_YEARLY
            : SubscriptionPlan.PREMIUM_MONTHLY;
      } else {
        subscriptionPlan = SubscriptionPlan.FREE;
      }

      if (currentActiveSubscription) {
        // RENEWAL: Extend existing subscription
        const currentEndDate = new Date(currentActiveSubscription.endDate);
        const now = new Date();

        console.log('🔄 Current subscription found:', {
          subscriptionId: currentActiveSubscription.id,
          currentEndDate,
          now,
          isStillValid: currentEndDate > now
        });

        // If current subscription is still valid, extend from current end date
        // Otherwise, start from today
        const extensionStartDate = currentEndDate > now ? currentEndDate : startDate;
        const newEndDate = new Date(extensionStartDate);

        if (packageData.duration) {
          newEndDate.setDate(newEndDate.getDate() + packageData.duration);
        } else {
          if (billingPeriod === 'YEARLY') {
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
          } else {
            newEndDate.setMonth(newEndDate.getMonth() + 1);
          }
        }

        await tx.subscription.update({
          where: { id: currentActiveSubscription.id },
          data: {
            plan: subscriptionPlan,
            status: SubscriptionStatus.ACTIVE,
            startDate: extensionStartDate,
            endDate: newEndDate,
            monthlyPrice: packageData.price,
            yearlyPrice: packageData.yearlyPrice,
            autoRenew: true,
            packageId: packageId,
          },
        });

        console.log('🔄 Subscription Renewed:', {
          userId,
          subscriptionId: currentActiveSubscription.id,
          packageId,
          oldEndDate: currentEndDate,
          newEndDate,
          billingPeriod,
          extensionStartDate,
        });
      } else {
        // NEW: Create new subscription
        console.log('✨ No active subscription found, creating new one');

        const newSubscription = await tx.subscription.create({
          data: {
            userId,
            plan: subscriptionPlan,
            status: SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
            monthlyPrice: packageData.price,
            yearlyPrice: packageData.yearlyPrice,
            autoRenew: true,
            packageId: packageId,
          },
        });

        console.log('✅ New Subscription Created:', {
          subscriptionId: newSubscription.id,
          userId,
          packageId,
          startDate,
          endDate,
          billingPeriod,
          plan: subscriptionPlan,
        });
      }
    });

    console.log('✅ Subscription processing completed successfully');
  }

  async cancelSubscription(userId: string): Promise<void> {
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      data: {
        status: SubscriptionStatus.CANCELLED,
        autoRenew: false,
      },
    });
  }

  async checkAndExpireSubscriptions(): Promise<void> {
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          lt: new Date(),
        },
      },
    });

    for (const subscription of expiredSubscriptions) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });
    }
  }
}

export const subscriptionService = new SubscriptionServiceImpl();
