'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface PaymentStatus {
  success: boolean
  message: string
  reference?: string
  amount?: number
  merchantOrderId?: string
  paymentStatus?: string
  paymentTime?: string
}

function PaymentStatusContent() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const status = searchParams.get('status')
    const reference = searchParams.get('reference')
    const amount = searchParams.get('amount')
    const merchantOrderId = searchParams.get('merchantOrderId')
    const message = searchParams.get('message')

    // Simulate checking payment status
    setTimeout(() => {
      setPaymentStatus({
        success: status === 'success',
        message: message || (status === 'success' ? 'Pembayaran berhasil!' : 'Pembayaran gagal atau dibatalkan.'),
        reference: reference || undefined,
        amount: amount ? parseInt(amount) : undefined,
        merchantOrderId: merchantOrderId || undefined,
        paymentStatus: status || 'unknown'
      })
      setIsLoading(false)
    }, 1000)
  }, [searchParams])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
      case 'cancel':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memeriksa status pembayaran...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              {paymentStatus?.success ? (
                <span className="text-3xl">✅</span>
              ) : (
                <span className="text-3xl">❌</span>
              )}
            </div>
            <CardTitle className="text-2xl">
              {paymentStatus?.success ? 'Pembayaran Berhasil!' : 'Pembayaran Gagal'}
            </CardTitle>
            <CardDescription>
              {paymentStatus?.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            {paymentStatus && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">Detail Pembayaran</h3>

                {paymentStatus.reference && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Referensi:</span>
                    <span className="font-mono text-sm">{paymentStatus.reference}</span>
                  </div>
                )}

                {paymentStatus.merchantOrderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{paymentStatus.merchantOrderId}</span>
                  </div>
                )}

                {paymentStatus.amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Jumlah:</span>
                    <span className="font-semibold">{formatCurrency(paymentStatus.amount)}</span>
                  </div>
                )}

                {paymentStatus.paymentStatus && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(paymentStatus.paymentStatus)}>
                      {paymentStatus.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {paymentStatus?.success ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-blue-800 text-sm">
                      🎉 Terima kasih! Pembayaran Anda telah berhasil diproses.
                      Paket Anda akan segera aktif.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/dashboard/billing" className="flex-1">
                      <Button className="w-full" variant="outline">
                        Kembali ke Billing
                      </Button>
                    </Link>

                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-red-800 text-sm">
                      😔 Mohon maaf, pembayaran Anda tidak dapat diproses.
                      Silakan coba lagi atau hubungi support jika masalah berlanjut.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/dashboard/billing" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Coba Lagi
                      </Button>
                    </Link>

                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full" variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Help Section */}
            <div className="border-t pt-6">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">Butuh Bantuan?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Jika Anda memiliki pertanyaan tentang pembayaran, jangan ragu untuk menghubungi tim support kami.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    📧 support@onerupiah.com
                  </Button>
                  <Button variant="outline" size="sm">
                    💬 Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat status pembayaran...</p>
          </div>
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  )
}
