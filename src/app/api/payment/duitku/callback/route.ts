import { NextRequest, NextResponse } from 'next/server'
import { duitkuService } from '@/services/duitkuService'
import { BillingService } from '@/services/billingService'
import { subscriptionService } from '@/lib/subscription'

// Callback interface according to Duitku documentation
interface DuitkuCallbackData {
  mtCode: string // merchant code
  amount: string
  merchantOrderId: string
  productDetail: string
  additionalParam: string
  paymentCode: string
  resultCode: string // SUCCESS or FAILED
  merchantUserId: string
  reference: string
  signature: string
  publisherOrderId: string
  spUserHash?: string
  settlementDate?: string // YYYY-MM-DD
  issuerCode?: string
  bankAppCode?: string
  bankOrderId?: string
  bankRespCode?: string
  bankRespMsg?: string
  cardName?: string
  cardType?: string
  maskedNumber?: string
  tokenId?: string
  transactionState?: string
  transactionStateStatus?: string // Success or Failed
  merchantCustomerId?: string
  expiryDate?: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse x-www-form-urlencoded data
    const formData = await request.formData()
    const formDataObj = Object.fromEntries(formData.entries())

    // Convert all values to strings (FormDataEntryValue -> string)
    const body: DuitkuCallbackData = Object.keys(formDataObj).reduce((acc, key) => {
      acc[key as keyof DuitkuCallbackData] = String(formDataObj[key])
      return acc
    }, {} as DuitkuCallbackData)

    console.log('🔔 Duitku Callback Received:', {
      merchantOrderId: body.merchantOrderId,
      reference: body.reference,
      amount: body.amount,
      resultCode: body.resultCode,
      paymentCode: body.paymentCode
    })

    // Validate required fields
    const requiredFields = ['mtCode', 'amount', 'merchantOrderId', 'reference', 'signature']
    const missingFields = requiredFields.filter(field => !body[field as keyof DuitkuCallbackData])

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields)
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Validate signature according to new documentation
    // Formula: MD5(merchantcode + amount + merchantOrderId + merchantKey)
    if (!duitkuService.validateNewCallbackSignature(body, body.signature)) {
      console.error('❌ Invalid signature in callback')
      console.error('Expected signature format: MD5(merchantcode + amount + merchantOrderId + merchantKey)')
      console.error('Received data:', {
        mtCode: body.mtCode,
        amount: body.amount,
        merchantOrderId: body.merchantOrderId,
        signature: body.signature
      })
      return NextResponse.json({
        success: false,
        error: 'Invalid signature'
      }, { status: 401 })
    }

    // Find transaction by external ID (reference)
    const transaction = await BillingService.getUserTransactions('', 1000, 0)
      .then(transactions => transactions.find(t => t.externalId === body.reference))

    if (!transaction) {
      console.error('❌ Transaction not found for reference:', body.reference)
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 })
    }

    console.log('📋 Found Transaction:', {
      transactionId: transaction.id,
      userId: transaction.userId,
      currentStatus: transaction.status,
      amount: transaction.amount,
      callbackAmount: body.amount
    })

    // Verify amounts match
    if (parseInt(body.amount) !== transaction.amount) {
      console.error('❌ Amount mismatch:', {
        transactionAmount: transaction.amount,
        callbackAmount: body.amount
      })
      return NextResponse.json({
        success: false,
        error: 'Amount mismatch'
      }, { status: 400 })
    }

    // Parse payment status based on resultCode
    const isSuccess = body.resultCode === 'SUCCESS' || body.resultCode === '00'
    const isFailed = body.resultCode === 'FAILED' || body.resultCode === '01'

    if (isSuccess) {
      try {
        // Update transaction to COMPLETED
        await BillingService.updateTransactionStatus(
          transaction.id,
          'COMPLETED',
          undefined,
          body.reference
        )

        // Process subscription (renewal or new)
        const { packageId, period, metadata } = parseTransactionMetadata(transaction.metadata)

        if (packageId && period) {
          console.log('🔄 Processing Subscription for Successful Payment:', {
            userId: transaction.userId,
            packageId,
            billingPeriod: period,
            amount: transaction.amount
          })

          await subscriptionService.createOrUpdateSubscriptionFromPackage(
            transaction.userId,
            packageId,
            period as 'MONTHLY' | 'YEARLY'
          )
        }

        console.log('✅ Payment Completed Successfully:', {
          transactionId: transaction.id,
          reference: body.reference,
          amount: body.amount,
          paymentCode: body.paymentCode,
          settlementDate: body.settlementDate
        })

      } catch (subscriptionError) {
        console.error('❌ Failed to process subscription:', subscriptionError)
        // Don't fail the callback if subscription processing fails
        // Transaction is already completed
      }

    } else if (isFailed) {
      await BillingService.updateTransactionStatus(
        transaction.id,
        'FAILED',
        `Payment failed: ${body.resultCode}`
      )

      console.log('❌ Payment Failed:', {
        transactionId: transaction.id,
        reference: body.reference,
        resultCode: body.resultCode,
        paymentCode: body.paymentCode,
        bankRespCode: body.bankRespCode,
        bankRespMsg: body.bankRespMsg
      })

    } else {
      // Handle other status codes
      const newStatus = duitkuService.parsePaymentStatus(body.resultCode)
      await BillingService.updateTransactionStatus(
        transaction.id,
        newStatus,
        `Payment status: ${body.resultCode}`
      )

      console.log('📝 Payment Status Updated:', {
        transactionId: transaction.id,
        reference: body.reference,
        status: newStatus,
        resultCode: body.resultCode
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully'
    })

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

function parseTransactionMetadata(metadata: unknown): TransactionMetadata {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata as TransactionMetadata
  }
  return {}
}
