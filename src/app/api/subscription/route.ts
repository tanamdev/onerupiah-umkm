import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subscriptionService } from '@/lib/subscription'
import { authenticateUser } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscription = await subscriptionService.getUserSubscription(user.id)

    return NextResponse.json({
      subscription,
      canGenerate: await subscriptionService.isSubscriptionActive(user.id),
      daysLeft: await subscriptionService.getSubscriptionDaysLeft(user.id)
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { plan } = await request.json()

    if (!plan || !['FREE', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY'].includes(plan)) {
      return NextResponse.json(
        { message: 'Invalid subscription plan' },
        { status: 400 }
      )
    }

    await subscriptionService.upgradeSubscription(user.id, plan as any)

    const updatedSubscription = await subscriptionService.getUserSubscription(user.id)

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: updatedSubscription
    })

  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await subscriptionService.cancelSubscription(user.id)

    return NextResponse.json({
      message: 'Subscription cancelled successfully'
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}