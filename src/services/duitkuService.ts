import crypto from 'crypto';
import type { TransactionStatus } from '@prisma/client';
import moment from 'moment-timezone';

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
    this.merchantCode = process.env.DUITKU_MERCHANT_CODE || '';
    this.apiKey = process.env.DUITKU_API_KEY || '';
    this.callbackUrl =
      process.env.DUITKU_CALLBACK_URL ||
      `${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/api/payment/duitku/callback`;
    this.returnUrl =
      process.env.DUITKU_RETURN_URL ||
      `${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/dashboard/billing/payment-status`;
    this.apiUrl =
      process.env.DUITKU_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://api-prod.duitku.com/api/merchant/createInvoice'
        : 'https://api-sandbox.duitku.com/api/merchant/createInvoice');

    // Debug environment variables
    console.log('🔧 Duitku Environment Variables:');
    console.log('- MERCHANT_CODE:', this.merchantCode);
    console.log(
      '- API_KEY:',
      this.apiKey ? '***' + this.apiKey.slice(-4) : 'NOT_SET'
    );
    console.log('- CALLBACK_URL:', this.callbackUrl);
    console.log('- RETURN_URL:', this.returnUrl);
    console.log('- API_URL:', this.apiUrl);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
  }

  private generateSignature(
    merchantCode: string,
    timestamp: number,
    apiKey: string
  ): string {
    const data = `${merchantCode}${timestamp}${apiKey}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private getCurrentTimestamp(): number {
    const timestamp = moment().tz('Asia/Jakarta').valueOf();

    return timestamp;
  }

  private validateEnvironment(): void {
    if (!this.merchantCode) {
      console.error('Duitku environment variables are not set');
      throw new Error(
        'Konfigurasi payment gateway tidak lengkap: DUITKU_MERCHANT_CODE tidak ditemukan.'
      );
    }
    if (!this.apiKey) {
      console.error('Duitku environment variables are not set');
      throw new Error(
        'Konfigurasi payment gateway tidak lengkap: DUITKU_API_KEY tidak ditemukan.'
      );
    }
    if (!this.callbackUrl) {
      console.error('Duitku environment variables are not set');
      throw new Error(
        'Konfigurasi payment gateway tidak lengkap: DUITKU_CALLBACK_URL tidak ditemukan.'
      );
    }
    if (!this.returnUrl) {
      console.error('Duitku environment variables are not set');
      throw new Error(
        'Konfigurasi payment gateway tidak lengkap: DUITKU_RETURN_URL tidak ditemukan.'
      );
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

    const timestamp = this.getCurrentTimestamp();
    const signature = this.generateSignature(
      this.merchantCode,
      timestamp,
      this.apiKey
    );

    console.log('signature ', signature);
    console.log('Merchant Code:', this.merchantCode);
    console.log('Timestamp:', timestamp);
    console.log('API URL:', this.apiUrl);

    const headers = {
      'Content-Type': 'application/json',
      'x-duitku-signature': signature,
      'x-duitku-timestamp': timestamp.toString(), // pastikan ini `Date.now()` (miliseconds)
      'x-duitku-merchantcode': this.merchantCode,
    };

    console.log('Duitku headers:', headers);

    // Test signature calculation
    const signatureTest = this.generateSignature(
      this.merchantCode,
      timestamp,
      this.apiKey
    );
    console.log(
      'Signature verification:',
      signature === signatureTest ? '✅ Valid' : '❌ Invalid'
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

    const duitkuPayload = {
      paymentAmount: packagePrice,
      merchantOrderId: transactionId,
      productDetails: `Pembayaran paket ${packageName} - ${
        billingPeriod === 'MONTHLY' ? 'Bulanan' : 'Tahunan'
      }`,
      customerVaName: userName,
      email: userEmail,
      phoneNumber: userPhone || '081234567890',
      itemDetails,
      callbackUrl: this.callbackUrl,
      returnUrl: this.returnUrl,
      expiryPeriod: 60, // dalam menit
    };

    console.log('Duitku payload:', duitkuPayload);

    console.log('🚀 Making Duitku API Call...');
    console.log('API URL:', this.apiUrl);
    console.log('Headers:', headers);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(duitkuPayload),
      });

      console.log('📨 Duitku API Response Status:', response.status);
      console.log('📨 Duitku API Response Headers:', response.headers);

      let result;
      let responseText;
      try {
        console.log('📄 Parsing Duitku API Response as JSON...');
        console.log('Response object:', response);
        responseText = await response.json();
        console.log('📄 Duitku API Raw Response Text:', responseText);

        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from Duitku API');
        }

        result = JSON.parse(responseText);
        console.log('✅ Duitku API Parsed Response:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse Duitku response:', parseError);
        console.error(
          '❌ Raw response that failed to parse:',
          responseText || 'No response text available'
        );

        throw new Error(
          `Invalid JSON response from Duitku API: ${
            responseText
              ? `"${responseText.substring(0, 100)}${
                  responseText.length > 100 ? '...' : ''
                }"`
              : 'Empty response'
          }`
        );
      }

      if (!response.ok) {
        console.error('❌ Duitku API HTTP Error:', response.status);
        console.error('❌ Duitku API Error Details:', result);

        // Handle specific HTTP errors with more context
        if (response.status === 401) {
          console.error('🔑 Authentication Failed - Check:');
          console.error('  - MERCHANT_CODE:', this.merchantCode);
          console.error(
            '  - API_KEY:',
            this.apiKey
              ? `${this.apiKey.slice(0, 4)}...${this.apiKey.slice(-4)}`
              : 'NOT_SET'
          );
          console.error('  - Signature:', signature);
          console.error('  - Timestamp:', timestamp);
          throw new Error(
            'Duitku API Unauthorized: Periksa kembali MERCHANT_CODE dan API_KEY Anda di Duitku Merchant Portal'
          );
        } else if (response.status === 400) {
          console.error('📋 Bad Request - Check payload:', duitkuPayload);
          throw new Error(
            `Duitku API Bad Request: ${
              result.message || 'Invalid request parameters'
            }`
          );
        } else if (response.status === 403) {
          throw new Error(
            'Duitku API Forbidden: Merchant account may be inactive'
          );
        } else if (response.status === 500) {
          throw new Error(
            'Duitku API Server Error: Silakan coba lagi beberapa saat'
          );
        } else if (response.status === 429) {
          throw new Error(
            'Duitku API Rate Limit: Terlalu banyak permintaan, coba lagi nanti'
          );
        } else {
          throw new Error(
            `Duitku API Error (${response.status}): ${
              result.message || response.statusText
            }`
          );
        }
      }

      if (!result || typeof result !== 'object') {
        console.error('Invalid response format:', result);
        throw new Error('Invalid response format from Duitku API');
      }

      if (result.statusCode !== '00') {
        console.error('Duitku Payment Error:', result);
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

  parsePaymentStatus(statusCode: string): TransactionStatus {
    switch (statusCode.toUpperCase()) {
      case '00':
      case 'SUCCESS':
        return 'COMPLETED';
      case '01':
      case 'FAILED':
        return 'FAILED';
      case '02':
      case 'PENDING':
        return 'PENDING';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'REFUNDED':
        return 'REFUNDED';
      default:
        return 'PENDING';
    }
  }
}

export const duitkuService = new DuitkuService();
export default DuitkuService;
