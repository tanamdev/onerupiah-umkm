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
      // Create transaction in database first
      const transaction = await BillingService.createTransaction({
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
        },
      });

      // Create Duitku invoice
      const duitkuResponse = await duitkuService
        .createInvoice(
          userId,
          userEmail,
          userName,
          userPhone || '',
          packageName,
          packagePrice,
          billingPeriod,
          merchantOrderId
        )
        .catch((duitkuError) => {
          const errorMessage =
            duitkuError instanceof Error
              ? duitkuError.message
              : String(duitkuError);
          throw new Error(`Duitku API Error: ${errorMessage}`);
        });

      // Update transaction with external ID
      await BillingService.updateTransactionStatus(
        transaction.id,
        'PENDING',
        undefined,
        duitkuResponse.reference
      );

      console.log('✅ Payment Invoice Created Successfully:', {
        transactionId: transaction.id,
        merchantOrderId,
        duitkuReference: duitkuResponse.reference,
        paymentUrl: duitkuResponse.paymentUrl,
      });

      return NextResponse.json({
        success: true,
        data: {
          transactionId: transaction.id,
          merchantOrderId,
          paymentUrl: duitkuResponse.paymentUrl,
          reference: duitkuResponse.reference,
          amount: packagePrice,
          expiryPeriod: 60,
        },
        message: 'Payment invoice created successfully',
      });
    } catch (duitkuError) {
      console.error('[!] Duitku Payment Error:', duitkuError);
      const errorMessage =
        duitkuError instanceof Error ? duitkuError.message : String(duitkuError);

      // Update transaction status to FAILED
      try {
        const failedTransaction = await BillingService.createTransaction({
          userId,
          packageId,
          amount: packagePrice,
          currency: 'IDR',
          paymentMethod: 'DUITKU',
          paymentGateway: 'DUITKU',
          type: 'SUBSCRIPTION',
          period: billingPeriod,
          metadata: {
            packageName,
            billingPeriod,
            userEmail,
            userName,
            error: errorMessage,
          },
        });

        await BillingService.updateTransactionStatus(
          failedTransaction.id,
          'FAILED',
          errorMessage
        );
      } catch (dbError) {
        console.error('[!] Failed to update transaction status:', dbError);
      }

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

