import { NextRequest, NextResponse } from 'next/server'
import { BillingService } from '@/services/billingService'
import { authenticateUser } from '@/lib/auth/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user first
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: transactionId } = await params

    console.log('🔍 Fetching transaction details:', {
      transactionId,
      userId: user.id
    })

    // Get transaction details with full package info
    const transaction = await BillingService.getTransactionById(transactionId)

    if (!transaction) {
      console.log('❌ Transaction not found:', transactionId)
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Verify that this transaction belongs to the authenticated user
    if (transaction.userId !== user.id) {
      console.log('❌ Unauthorized access attempt:', {
        transactionId,
        transactionUserId: transaction.userId,
        requestUserId: user.id
      })
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    console.log('✅ Transaction details fetched:', {
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status,
      packageId: transaction.packageId,
      packageName: transaction.package?.name
    })

    return NextResponse.json({
      success: true,
      data: {
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          type: transaction.type,
          period: transaction.period,
          paymentMethod: transaction.paymentMethod,
          paymentGateway: transaction.paymentGateway,
          externalId: transaction.externalId,
          failureReason: transaction.failureReason,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          metadata: transaction.metadata
        },
        package: transaction.package ? {
          id: transaction.package.id,
          name: transaction.package.name,
          description: transaction.package.description,
          price: transaction.package.price,
          yearlyPrice: transaction.package.yearlyPrice,
          currency: transaction.package.currency,
          features: transaction.package.features,
          duration: transaction.package.duration,
          maxContentGenerations: transaction.package.maxContentGenerations,
          maxImageGenerations: transaction.package.maxImageGenerations
        } : null
      }
    })

  } catch (error) {
    console.error('❌ Transaction detail fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}