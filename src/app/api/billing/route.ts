import { NextRequest, NextResponse } from 'next/server'
import { BillingService } from '@/services/billingService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId is required'
        },
        { status: 400 }
      )
    }

    const billingInfo = await BillingService.getUserBillingInfo(userId)
    const renewalInfo = await BillingService.checkUserNeedsRenewal(userId)

    return NextResponse.json({
      success: true,
      data: {
        ...billingInfo,
        renewalInfo
      }
    })
  } catch (error) {
    console.error('❌ Error fetching billing info:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch billing info'
      },
      { status: 500 }
    )
  }
}