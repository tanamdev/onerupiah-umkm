# Duitku Payment Gateway Setup

## Persiapan

1. **Daftar Akun Duitku**
   - Kunjungi [Duitku Merchant Portal](https://merchant.duitku.com)
   - Daftar akun merchant Anda
   - Verifikasi akun dan lengkapi dokumen yang dibutuhkan

2. **Dapatkan Kredensial**
   - Login ke Duitku Merchant Portal
   - Navigate ke **Settings** → **API Configuration**
   - Catat **Merchant Code** dan **API Key** Anda

## Konfigurasi Environment

Update file `.env` dengan kredensial Duitku Anda:

```env
# Duitku Payment Gateway Configuration
DUITKU_MERCHANT_CODE="YOUR_MERCHANT_CODE_HERE"
DUITKU_API_KEY="YOUR_API_KEY_HERE"

# Base URL untuk callback dan redirect
# Untuk development:
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# Untuk production:
# NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

## Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DUITKU_MERCHANT_CODE` | Kode merchant Duitku Anda | `DS12345` |
| `DUITKU_API_KEY` | API key Duitku Anda | `abc123def456ghi789` |
| `NEXT_PUBLIC_BASE_URL` | Base URL aplikasi | `http://localhost:3000` |

## API Endpoint

### Create Invoice
- **URL**: `/api/payment/duitku/create`
- **Method**: `POST`
- **Deskripsi**: Membuat invoice pembayaran baru

### Callback URL
- **URL**: `/api/payment/duitku/callback`
- **Method**: `POST`
- **Deskripsi**: Menerima callback dari Duitku setelah pembayaran

## Cara Kerja Integration

1. **User klik "Perpanjang Bulanan/Tahunan"**
2. **Frontend** mengirim request ke `/api/payment/duitku/create`
3. **Backend**:
   - Membuat transaksi di database
   - Memanggil Duitku API untuk membuat invoice
   - Mengembalikan payment URL
4. **Frontend** redirect user ke payment URL Duitku
5. **User** menyelesaikan pembayaran di halaman Duitku
6. **Duitku** mengirim callback ke `/api/payment/duitku/callback`
7. **Backend** memproses callback dan update status transaksi
8. **User** redirect ke halaman status pembayaran

## Testing

### Sandbox Mode
- Environment default akan menggunakan Duitku Sandbox
- Gunakan data testing untuk pembayaran:
  - Virtual Account: BCA, BNI, BRI, Mandiri
  - E-Wallet: GoPay, OVO, Dana
  - Credit Card: VISA, MasterCard

### Production Mode
- Update environment variable:
  ```env
  NODE_ENV=production
  ```
- Server akan otomatis menggunakan production API Duitku

## Payment Methods yang Didukung

- **Virtual Account**: BCA, BNI, BRI, Mandiri, Permata, etc.
- **E-Wallet**: GoPay, OVO, Dana, LinkAja, ShopeePay
- **Credit Card**: VISA, MasterCard
- **Convenience Store**: Alfamart, Indomaret
- **QR Code**: QRIS

## Security Features

- **SHA256 Signature**: Validasi callback dari Duitku
- **Timestamp Validation**: Mencegah replay attack
- **Reference Tracking**: Match callback dengan transaksi

## Monitoring

Monitor logs untuk:
- ✅ Payment invoice created
- ✅ Callback received
- ✅ Transaction status updated
- ❌ Payment failures
- ❌ API errors

## Troubleshooting

### Common Issues

1. **"Invalid signature"**
   - Pastikan `DUITKU_MERCHANT_CODE` dan `DUITKU_API_KEY` benar
   - Check timestamp synchronization

2. **"Transaction not found"**
   - Pastikan `externalId` tersimpan dengan benar di database
   - Check mapping antara reference dan transaction

3. **"Payment failed"**
   - Check user payment details
   - Verify package availability
   - Check network connectivity

### Debug Mode

Enable debug logging di console untuk development:
```javascript
console.log('🚀 Payment Process Started:', data)
console.log('✅ Duitku Response:', response)
console.log('❌ Error Details:', error)
```

## Support

Untuk bantuan lebih lanjut:
- Duitku Documentation: https://docs.duitku.com
- Duitku Support: support@duitku.com
- Application Support: support@onerupiah.com