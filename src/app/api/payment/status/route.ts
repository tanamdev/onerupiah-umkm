import { NextRequest, NextResponse } from 'next/server'
import { BillingService } from '@/services/billingService'
import { duitkuService } from '@/services/duitkuService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const merchantOrderId = searchParams.get('merchantOrderId')

    if (!reference && !merchantOrderId) {
      // Try to get user ID from request and look for recent transactions
      const authHeader = request.headers.get('authorization')
      const token = request.cookies.get('auth_token')?.value

      console.log('🔍 No parameters provided, trying fallback methods:', {
        hasAuthHeader: !!authHeader,
        hasToken: !!token
      })

      if (token) {
        try {
          // Import authentication function
          const { authenticateUser } = await import('@/lib/auth/middleware')
          const user = await authenticateUser(request)

          if (user) {
            console.log('🔍 Found authenticated user:', user.id)

            // Look for recent transactions for this user
            const recentTransactions = await BillingService.getUserTransactions(user.id, 5, 0)

            if (recentTransactions.length > 0) {
              console.log('🔍 Found recent transactions:', recentTransactions.map(t => ({
                id: t.id,
                externalId: t.externalId,
                status: t.status,
                createdAt: t.createdAt
              })))

              // Return the most recent transaction
              const latestTransaction = recentTransactions[0]
              return NextResponse.json({
                success: true,
                fallback: true,
                message: 'Using recent transaction as fallback (URL parameters were missing)',
                data: {
                  transactionId: latestTransaction.id,
                  merchantOrderId: (latestTransaction.metadata as any)?.merchantOrderId,
                  reference: latestTransaction.externalId,
                  amount: latestTransaction.amount,
                  status: latestTransaction.status === 'COMPLETED' ? 'success' :
                         latestTransaction.status === 'FAILED' ? 'failed' : 'pending',
                  paymentStatus: latestTransaction.status,
                  message: `Status: ${latestTransaction.status}`,
                  paymentTime: latestTransaction.updatedAt
                }
              })
            }
          }
        } catch (authError) {
          console.error('❌ Auth fallback failed:', authError)
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Missing reference or merchantOrderId parameter. Please provide either reference or merchantOrderId from the payment URL.',
          help: 'URL should contain either ?reference=XXX or ?merchantOrderId=XXX parameter. You may need to check your browser URL or complete the payment again.'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Checking payment status:', { reference, merchantOrderId })

    let transaction

    // Try to find by reference first, then by merchantOrderId
    if (reference) {
      transaction = await BillingService.findTransactionByExternalId(reference)
    } else if (merchantOrderId) {
      const transactions = await BillingService.getUserTransactions('', 1000, 0)
      transaction = transactions.find(t => {
        const metadata = t.metadata as any
        return metadata?.merchantOrderId === merchantOrderId
      })
    }

    if (!transaction) {
      console.log('❌ Transaction not found:', { reference, merchantOrderId })
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction not found',
          paymentStatus: 'unknown'
        },
        { status: 404 }
      )
    }

    console.log('📋 Found transaction:', {
      id: transaction.id,
      status: transaction.status,
      externalId: transaction.externalId,
      amount: transaction.amount
    })

    // If transaction is completed, no need to check external API
    if (transaction.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        data: {
          transactionId: transaction.id,
          merchantOrderId: (transaction.metadata as any)?.merchantOrderId,
          reference: transaction.externalId,
          amount: transaction.amount,
          status: 'success',
          paymentStatus: 'COMPLETED',
          message: 'Pembayaran berhasil!',
          paymentTime: transaction.updatedAt
        }
      })
    }

    // If transaction is failed, return failed status
    if (transaction.status === 'FAILED') {
      return NextResponse.json({
        success: false,
        data: {
          transactionId: transaction.id,
          merchantOrderId: (transaction.metadata as any)?.merchantOrderId,
          reference: transaction.externalId,
          amount: transaction.amount,
          status: 'failed',
          paymentStatus: 'FAILED',
          message: transaction.failureReason || 'Pembayaran gagal',
          paymentTime: transaction.updatedAt
        }
      })
    }

    // For pending transactions, check with Duitku API
    if (transaction.externalId) {
      try {
        console.log('🔍 Checking status with Duitku API for reference:', transaction.externalId)
        const duitkuStatus = await duitkuService.getTransactionStatus(transaction.externalId)

        console.log('📊 Duitku API Response:', {
          paymentStatus: duitkuStatus.paymentStatus,
          paymentTime: duitkuStatus.paymentTime,
          statusCode: duitkuStatus.resultCode
        })

        // Update our database based on Duitku response
        const newStatus = duitkuService.parsePaymentStatus(duitkuStatus.resultCode.toString())

        if (newStatus !== transaction.status) {
          await BillingService.updateTransactionStatus(
            transaction.id,
            newStatus,
            `Updated from Duitku API: ${duitkuStatus.resultCode}`,
            transaction.externalId
          )

          console.log('📝 Transaction status updated:', {
            oldStatus: transaction.status,
            newStatus,
            reference: transaction.externalId
          })
        }

        const isSuccess = duitkuStatus.paymentStatus === 1 && duitkuStatus.resultCode === '00'
        const isFailed = duitkuStatus.paymentStatus === 2

        return NextResponse.json({
          success: isSuccess,
          data: {
            transactionId: transaction.id,
            merchantOrderId: (transaction.metadata as any)?.merchantOrderId,
            reference: transaction.externalId,
            amount: transaction.amount,
            status: isSuccess ? 'success' : (isFailed ? 'failed' : 'pending'),
            paymentStatus: newStatus,
            message: isSuccess ? 'Pembayaran berhasil!' :
                   (isFailed ? 'Pembayaran gagal' : 'Pembayaran sedang diproses'),
            paymentTime: duitkuStatus.paymentTime || transaction.updatedAt,
            paymentMethod: duitkuStatus.paymentMethod,
            paymentCode: duitkuStatus.paymentCode
          }
        })

      } catch (duitkuError) {
        console.error('❌ Duitku API Error:', duitkuError)

        // Return current database status if API fails
        return NextResponse.json({
          success: false,
          data: {
            transactionId: transaction.id,
            merchantOrderId: (transaction.metadata as any)?.merchantOrderId,
            reference: transaction.externalId,
            amount: transaction.amount,
            status: 'pending',
            paymentStatus: transaction.status,
            message: 'Tidak dapat memeriksa status pembayaran saat ini',
            paymentTime: transaction.updatedAt
          }
        })
      }
    }

    // Default response for transactions without externalId
    return NextResponse.json({
      success: false,
      data: {
        transactionId: transaction.id,
        merchantOrderId: (transaction.metadata as any)?.merchantOrderId,
        reference: transaction.externalId,
        amount: transaction.amount,
        status: 'pending',
        paymentStatus: transaction.status,
        message: 'Pembayaran sedang diproses',
        paymentTime: transaction.updatedAt
      }
    })

  } catch (error) {
    console.error('❌ Payment Status Check Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        paymentStatus: 'unknown'
      },
      { status: 500 }
    )
  }
}