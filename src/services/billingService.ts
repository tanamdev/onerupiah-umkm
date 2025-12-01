import { PrismaClient, Package, Transaction, TransactionStatus, BillingPeriod, TransactionType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export interface PackageWithStats extends Package {
  userSubscriptions?: number
  totalTransactions?: number
}

export type TransactionWithPackage = Prisma.TransactionGetPayload<{
  include: { package: true }
}>

export const BillingService = {
  // Package Management
  async getActivePackages(): Promise<Package[]> {
    return await prisma.package.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  },

  async getPackageById(id: string): Promise<Package | null> {
    return await prisma.package.findUnique({
      where: { id },
      include: {
        transactions: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
  },

  async createPackage(data: {
    name: string
    description: string
    price: number
    yearlyPrice?: number
    currency?: string
    features: any
    maxContentGenerations?: number
    maxImageGenerations?: number
    duration?: number
  }): Promise<Package> {
    return await prisma.package.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        yearlyPrice: data.yearlyPrice,
        currency: data.currency || 'USD',
        features: data.features,
        maxContentGenerations: data.maxContentGenerations,
        maxImageGenerations: data.maxImageGenerations,
        duration: data.duration || 30
      }
    })
  },

  // Transaction Management
  async createTransaction(data: {
    userId: string
    packageId: string
    amount: number
    currency?: string
    paymentMethod?: string
    paymentGateway?: string
    externalId?: string
    type?: TransactionType
    period?: BillingPeriod
    metadata?: any
  }): Promise<Transaction> {
    return await prisma.transaction.create({
      data: {
        userId: data.userId,
        packageId: data.packageId,
        amount: data.amount,
        currency: data.currency || 'IDR',
        paymentMethod: data.paymentMethod,
        paymentGateway: data.paymentGateway,
        externalId: data.externalId,
        type: data.type || 'SUBSCRIPTION',
        period: data.period || 'MONTHLY',
        metadata: data.metadata
      },
      include: {
        package: true
      }
    })
  },

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
    failureReason?: string,
    externalId?: string
  ): Promise<Transaction> {
    return await prisma.transaction.update({
      where: { id },
      data: {
        status,
        failureReason,
        externalId: externalId
      },
      include: {
        package: true
      }
    })
  },

  async getUserTransactions(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<TransactionWithPackage[]> {
    return await prisma.transaction.findMany({
      where: { userId },
      include: {
        package: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })
  },

  async getTransactionById(id: string): Promise<TransactionWithPackage | null> {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        package: true
      }
    })
  },

  async getUserTransactionSummary(userId: string): Promise<{
    totalTransactions: number
    totalSpent: number
    successfulTransactions: number
    failedTransactions: number
    monthlySpending: number
    yearlySpending: number
  }> {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        amount: true,
        status: true,
        createdAt: true,
        period: true
      }
    })

    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentYear = new Date(now.getFullYear(), 0, 1)

    const summary = {
      totalTransactions: transactions.length,
      totalSpent: transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0),
      successfulTransactions: transactions.filter(t => t.status === 'COMPLETED').length,
      failedTransactions: transactions.filter(t => t.status === 'FAILED').length,
      monthlySpending: transactions
        .filter(t => t.status === 'COMPLETED' && t.createdAt >= currentMonth)
        .reduce((sum, t) => sum + t.amount, 0),
      yearlySpending: transactions
        .filter(t => t.status === 'COMPLETED' && t.createdAt >= currentYear)
        .reduce((sum, t) => sum + t.amount, 0)
    }

    return summary
  },

  // User Billing Info
  async getUserBillingInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            endDate: 'desc'
          },
          take: 1,
          include: {
            package: true
          }
        },
        transactions: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            package: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const transactionSummary = await this.getUserTransactionSummary(userId)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      currentSubscription: user.subscriptions[0] || null,
      recentTransactions: user.transactions,
      transactionSummary
    }
  },

  // Check if user needs renewal (within 7 days)
  async checkUserNeedsRenewal(userId: string): Promise<{
    needsRenewal: boolean
    subscription: any
    daysRemaining: number
  }> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date()
        }
      },
      include: {
        package: true
      },
      orderBy: {
        endDate: 'desc'
      }
    })

    if (!subscription) {
      return {
        needsRenewal: true,
        subscription: null,
        daysRemaining: 0
      }
    }

    const now = new Date()
    const endDate = new Date(subscription.endDate)
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      needsRenewal: daysRemaining <= 7,
      subscription,
      daysRemaining: Math.max(0, daysRemaining)
    }
  }
}

export default BillingService
