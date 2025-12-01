import crypto from 'crypto';

interface DuitkuCreateInvoiceRequest {
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  additionalParam: string;
  merchantUserInfo: string;
  customerVaName: string;
  email: string;
  phoneNumber: string;
  itemDetails: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  customerDetail: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    billingAddress: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      countryCode: string;
    };
    shippingAddress: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      countryCode: string;
    };
    merchantCustomerId: string;
  };
  creditCardDetail?: {
    saveCardToken: number;
  };
  callbackUrl: string;
  returnUrl: string;
  expiryPeriod: number;
  paymentMethod?: string;
}

interface DuitkuCreateInvoiceResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  statusCode: string;
  statusMessage: string;
}

interface DuitkuTransactionStatusResponse {
  merchantCode: string;
  reference: string;
  amount: number;
  merchantOrderId: string;
  productDetail: string;
  additionalParam: string;
  paymentMethod: string;
  resultCode: string;
  merchantCustomerId: string;
  customerDetail: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  customerVaName: string;
  amountReceived: number;
  paymentTime: string;
  reference: string;
  paymentStatus: number;
  paymentCode: string;
  settlementStatus: number;
  signature: string;
}

class DuitkuService {
  private merchantCode: string;
  private apiKey: string;
  private apiUrl: string;
  private callbackUrl: string;
  private returnUrl: string;

  constructor() {
    this.merchantCode = process.env.DUITKU_MERCHANT_CODE || 'DXXXX';
    this.apiKey = process.env.DUITKU_API_KEY || 'your_api_key_here';
    this.apiUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://api-prod.duitku.com/api/merchant/createInvoice'
        : 'https://api-sandbox.duitku.com/api/merchant/createInvoice';
    this.callbackUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }/api/payment/duitku/callback`;
    this.returnUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }/dashboard/billing/payment-status`;
  }

  private generateSignature(
    merchantCode: string,
    timestamp: number,
    apiKey: string
  ): string {
    const data = `${merchantCode}-${timestamp}-${apiKey}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private getCurrentTimestamp(): number {
    // return Date.now();

    const jakartaNow = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jakarta',
    });
    console.log('Jam Jakarta sekarang:', jakartaNow);

    // convert to milliseconds
    const jakartaDate = new Date(jakartaNow);
    const jakartaTimestamp = jakartaDate.getTime();
    console.log('Timestamp Jakarta (ms):', jakartaTimestamp);

    return jakartaTimestamp;
  }

  private validateEnvironment(): void {
    if (!this.merchantCode || this.merchantCode === 'DXXXX') {
      throw new Error('DUITKU_MERCHANT_CODE environment variable is required');
    }
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      throw new Error('DUITKU_API_KEY environment variable is required');
    }
  }

  async createInvoice(
    userId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    packageName: string,
    packagePrice: number,
    billingPeriod: 'MONTHLY' | 'YEARLY',
    transactionId: string
  ): Promise<DuitkuCreateInvoiceResponse> {
    this.validateEnvironment();

    console.log('🔑 Duitku Config:');
    console.log(this.merchantCode, this.apiKey);

    const timestamp = this.getCurrentTimestamp();

    console.log('⏱️ Timestamp:', timestamp);
    // check apakah sudah sesuai dengan TimeStamp jakarta

    // buat timestamp jakarta <TIMESTAMP_JAKARTA>(Milliseconds)

    const signature = this.generateSignature(
      this.merchantCode,
      timestamp,
      this.apiKey
    );

    const itemDetails = [
      {
        name: `${packageName} - ${
          billingPeriod === 'MONTHLY' ? 'Bulanan' : 'Tahunan'
        }`,
        price: packagePrice,
        quantity: 1,
      },
    ];

    const customerDetail = {
      firstName: userName.split(' ')[0] || userName,
      lastName: userName.split(' ').slice(1).join(' ') || 'User',
      email: userEmail,
      phoneNumber: userPhone || '0000000000',
      billingAddress: {
        firstName: userName.split(' ')[0] || userName,
        lastName: userName.split(' ').slice(1).join(' ') || 'User',
        address: 'Alamat Pelanggan',
        city: 'Jakarta',
        postalCode: '12345',
        phone: userPhone || '0000000000',
        countryCode: 'ID',
      },
      shippingAddress: {
        firstName: userName.split(' ')[0] || userName,
        lastName: userName.split(' ').slice(1).join(' ') || 'User',
        address: 'Alamat Pelanggan',
        city: 'Jakarta',
        postalCode: '12345',
        phone: userPhone || '0000000000',
        countryCode: 'ID',
      },
      merchantCustomerId: userId,
    };

    const requestBody: DuitkuCreateInvoiceRequest = {
      paymentAmount: packagePrice,
      merchantOrderId: transactionId,
      productDetails: `Pembayaran paket ${packageName} - ${
        billingPeriod === 'MONTHLY' ? 'Bulanan' : 'Tahunan'
      }`,
      additionalParam: '',
      merchantUserInfo: userEmail,
      customerVaName: userName,
      email: userEmail,
      phoneNumber: userPhone || '0000000000',
      itemDetails,
      customerDetail,
      callbackUrl: this.callbackUrl,
      returnUrl: this.returnUrl,
      expiryPeriod: 60, // 60 minutes
    };

    console.log('📤 Creating Duitku Invoice with Request:', requestBody);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-duitku-signature': signature,
          'x-duitku-timestamp': timestamp.toString(),
          'x-duitku-merchantcode': this.merchantCode,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Duitku API Error:', result);
        throw new Error(
          result.statusMessage || 'Failed to create payment invoice'
        );
      }

      if (result.statusCode !== '00') {
        console.error('Duitku Payment Error1:', result);
        throw new Error(result.statusMessage || 'Payment creation failed');
      }

      console.log('✅ Duitku Invoice Created:', {
        reference: result.reference,
        merchantOrderId: transactionId,
        paymentUrl: result.paymentUrl,
        statusCode: result.statusCode,
      });

      return result;
    } catch (error) {
      console.error('❌ Duitku Create Invoice Error:', error);
      throw error;
    }
  }

  async getTransactionStatus(
    reference: string
  ): Promise<DuitkuTransactionStatusResponse> {
    this.validateEnvironment();

    const timestamp = this.getCurrentTimestamp();
    const signature = this.generateSignature(
      this.merchantCode,
      timestamp,
      this.apiKey
    );

    const statusUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://api-prod.duitku.com/api/merchant/transactionStatus'
        : 'https://api-sandbox.duitku.com/api/merchant/transactionStatus';

    const requestBody = {
      merchantCode: this.merchantCode,
      reference,
    };

    try {
      const response = await fetch(statusUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-duitku-signature': signature,
          'x-duitku-timestamp': timestamp.toString(),
          'x-duitku-merchantcode': this.merchantCode,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Duitku Status API Error:', result);
        throw new Error(
          result.statusMessage || 'Failed to get transaction status'
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Duitku Get Transaction Status Error:', error);
      throw error;
    }
  }

  validateCallbackSignature(payload: any, signature: string): boolean {
    const computedSignature = this.generateSignature(
      payload.merchantCode,
      parseInt(payload.timestamp),
      this.apiKey
    );
    return computedSignature === signature;
  }

  parsePaymentStatus(statusCode: string): string {
    switch (statusCode) {
      case '00':
        return 'SUCCESS';
      case '01':
        return 'FAILED';
      case '02':
        return 'PENDING';
      default:
        return 'UNKNOWN';
    }
  }
}

export const duitkuService = new DuitkuService();
export default DuitkuService;
