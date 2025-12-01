import { NextRequest, NextResponse } from 'next/server'
import { BillingService } from '@/services/billingService'

export async function GET(request: NextRequest) {
  try {
    const packages = await BillingService.getActivePackages()

    return NextResponse.json({
      success: true,
      data: packages
    })
  } catch (error) {
    console.error('❌ Error fetching packages:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      yearlyPrice,
      currency = 'USD',
      features,
      maxContentGenerations,
      maxImageGenerations,
      duration = 30
    } = body

    // Validate required fields
    if (!name || !description || !price || !features) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, description, price, features'
        },
        { status: 400 }
      )
    }

    const newPackage = await BillingService.createPackage({
      name,
      description,
      price,
      yearlyPrice,
      currency,
      features,
      maxContentGenerations,
      maxImageGenerations,
      duration
    })

    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Package created successfully'
    })
  } catch (error) {
    console.error('❌ Error creating package:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create package'
      },
      { status: 500 }
    )
  }
}