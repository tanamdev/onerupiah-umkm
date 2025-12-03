import { NextRequest, NextResponse } from 'next/server';
import { duitkuService } from '@/services/duitkuService';
import { BillingService } from '@/services/billingService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      packageId,
      billingPeriod,
      packageName,
      packagePrice,
      userEmail,
      userName,
      userPhone,
    } = body;

    // Validate required fields
    if (
      !userId ||
      !packageId ||
      !billingPeriod ||
      !packageName ||
      !packagePrice ||
      !userEmail ||
      !userName
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: userId, packageId, billingPeriod, packageName, packagePrice, userEmail, userName',
        },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const merchantOrderId = `INV-${Date.now()}-${userId.slice(-6)}`;

    console.log('🚀 Creating Duitku Payment:', {
      userId,
      packageId,
      billingPeriod,
      packageName,
      packagePrice,
      merchantOrderId,
    });

    try {
      // Use transactional approach - atomic operation between DB and external API
      const result = await BillingService.createTransactionWithPayment(
        {
          userId,
          packageId,
          amount: packagePrice,
          currency: 'IDR',
          paymentMethod: 'DUITKU',
          paymentGateway: 'DUITKU',
          type: 'SUBSCRIPTION',
          period: billingPeriod,
          metadata: {
            merchantOrderId,
            packageName,
            billingPeriod,
            userEmail,
            userName,
            packageId, // Tambahkan packageId ke metadata
          },
        },
        async () => {
          // Payment callback - executed within transaction context
          const duitkuResponse = await duitkuService.createInvoice(
            userId,
            userEmail,
            userName,
            userPhone || '',
            packageName,
            packagePrice,
            billingPeriod,
            merchantOrderId
          );

          return {
            reference: duitkuResponse.reference,
            paymentUrl: duitkuResponse.paymentUrl,
          };
        }
      );

      console.log('✅ Payment Invoice Created Successfully:', {
        transactionId: result.transaction.id,
        merchantOrderId,
        duitkuReference: result.paymentResult.reference,
        paymentUrl: result.paymentResult.paymentUrl,
      });

      return NextResponse.json({
        success: true,
        data: {
          transactionId: result.transaction.id,
          merchantOrderId,
          paymentUrl: result.paymentResult.paymentUrl,
          reference: result.paymentResult.reference,
          amount: packagePrice,
          expiryPeriod: 60,
        },
        message: 'Payment invoice created successfully',
      });
    } catch (duitkuError) {
      console.error('[!] Duitku Payment Error:', duitkuError);
      const errorMessage =
        duitkuError instanceof Error ? duitkuError.message : String(duitkuError);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create payment invoice',
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[!] Payment Processing Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

