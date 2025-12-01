import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { duitkuService } from '@/services/duitkuService'
import { BillingService } from '@/services/billingService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-duitku-signature')

    console.log('🔔 Duitku Callback Received:', body)

    // Validate signature
    if (!signature) {
      console.error('❌ Missing signature in callback')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    if (!duitkuService.validateCallbackSignature(body, signature)) {
      console.error('❌ Invalid signature in callback')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const {
      merchantCode,
      reference,
      merchantOrderId,
      amount,
      paymentStatus,
      paymentCode,
      paymentTime,
      signature: callbackSignature
    } = body

    // Find transaction by external ID (reference)
    try {
      // Get all transactions for this merchant order ID
      const transactions = await BillingService.getUserTransactions('', 100, 0)
      const transaction = transactions.find(t => t.externalId === reference)

      if (!transaction) {
        console.error('❌ Transaction not found for reference:', reference)
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }

      console.log('📋 Found Transaction:', {
        transactionId: transaction.id,
        userId: transaction.userId,
        currentStatus: transaction.status,
        paymentStatus
      })

      // Parse payment status
      const newStatus = duitkuService.parsePaymentStatus(paymentStatus)

      // Update transaction status based on payment status
      if (paymentStatus === 'SUCCESS' || paymentStatus === '00') {
        await BillingService.updateTransactionStatus(
          transaction.id,
          'COMPLETED',
          undefined,
          reference
        )

        // Create subscription for successful payment
        const { packageId, period, metadata } = parseTransactionMetadata(transaction.metadata)
        if (packageId && period) {
          try {
            const packageData = await BillingService.getPackageById(packageId)
            if (packageData) {
              const startDate = new Date()
              const endDate = new Date(startDate)
              endDate.setDate(endDate.getDate() + packageData.duration)

              console.log('✅ Creating Subscription:', {
                userId: transaction.userId,
                packageId,
                startDate,
                endDate,
                amount: transaction.amount,
                period
              })

              // Here you would create/update subscription
              // For now, we'll just log it
              console.log('📦 Subscription would be created:', {
                userId: transaction.userId,
                packageName: metadata?.packageName,
                billingPeriod: metadata?.billingPeriod,
                amount: transaction.amount
              })
            }
          } catch (subscriptionError) {
            console.error('❌ Failed to create subscription:', subscriptionError)
          }
        }

        console.log('✅ Payment Completed Successfully:', {
          transactionId: transaction.id,
          reference,
          amount,
          paymentTime
        })

      } else if (paymentStatus === 'FAILED' || paymentStatus === '01') {
        await BillingService.updateTransactionStatus(
          transaction.id,
          'FAILED',
          'Payment failed'
        )

        console.log('❌ Payment Failed:', {
          transactionId: transaction.id,
          reference,
          paymentCode
        })

      } else {
        await BillingService.updateTransactionStatus(
          transaction.id,
          newStatus,
          `Payment status: ${paymentStatus}`
        )

        console.log('📝 Payment Status Updated:', {
          transactionId: transaction.id,
          reference,
          status: newStatus,
          paymentStatus
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Callback processed successfully'
      })

    } catch (dbError) {
      console.error('❌ Database Error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Callback Processing Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

type TransactionMetadata = {
  packageId?: string
  period?: string
  metadata?: {
    packageName?: string
    billingPeriod?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

function parseTransactionMetadata(metadata: Prisma.JsonValue | null | undefined): TransactionMetadata {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata as TransactionMetadata
  }
  return {}
}
