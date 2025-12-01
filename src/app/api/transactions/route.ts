import { NextRequest, NextResponse } from 'next/server'
import { BillingService } from '@/services/billingService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId is required'
        },
        { status: 400 }
      )
    }

    const transactions = await BillingService.getUserTransactions(userId, limit, offset)

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        limit,
        offset,
        hasMore: transactions.length === limit
      }
    })
  } catch (error) {
    console.error('❌ Error fetching transactions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      packageId,
      amount,
      currency = 'USD',
      paymentMethod,
      paymentGateway,
      externalId,
      type = 'SUBSCRIPTION',
      period = 'MONTHLY',
      metadata
    } = body

    // Validate required fields
    if (!userId || !packageId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, packageId, amount'
        },
        { status: 400 }
      )
    }

    const transaction = await BillingService.createTransaction({
      userId,
      packageId,
      amount,
      currency,
      paymentMethod,
      paymentGateway,
      externalId,
      type,
      period,
      metadata
    })

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    })
  } catch (error) {
    console.error('❌ Error creating transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create transaction'
      },
      { status: 500 }
    )
  }
}