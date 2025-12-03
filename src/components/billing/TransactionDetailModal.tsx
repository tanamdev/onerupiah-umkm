'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Package {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice?: number
  currency: string
  features: Record<string, unknown> | null
  duration?: number
  maxContentGenerations?: number
  maxImageGenerations?: number
}

interface Transaction {
  id: string
  amount: number
  currency: string
  status: string
  type: string
  period: string
  paymentMethod?: string
  paymentGateway?: string
  externalId?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
  metadata?: any
}

interface TransactionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  packageData: Package | null
  isLoading?: boolean
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  packageData,
  isLoading = false
}: TransactionDetailModalProps) {
  const formatCurrency = (amount: number, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method?: string) => {
    switch (method?.toUpperCase()) {
      case 'DUITKU':
        return '💳'
      case 'TRANSFER':
        return '🏦'
      case 'E-WALLET':
        return '📱'
      default:
        return '💰'
    }
  }

  const renderFeatures = (features: Record<string, unknown> | null) => {
    if (!features || typeof features !== 'object') return null

    return Object.entries(features).map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
      return (
        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <span className="text-sm text-gray-600">{formattedKey}</span>
          <span className="text-sm font-medium text-gray-900">
            {typeof value === 'boolean' ? (value ? '✅' : '❌') :
             typeof value === 'number' ? value.toString() :
             String(value)}
          </span>
        </div>
      )
    })
  }

  if (!transaction) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detail Transaksi</span>
            <Badge className={getStatusColor(transaction.status)}>
              {transaction.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang transaksi pembelian paket
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Memuat detail transaksi...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Transaksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ID Transaksi</span>
                  <span className="font-mono text-sm">{transaction.id}</span>
                </div>

                {transaction.externalId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID Eksternal</span>
                    <span className="font-mono text-sm">{transaction.externalId}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jumlah</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Metode Pembayaran</span>
                  <span className="flex items-center gap-2">
                    <span>{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                    <span>{transaction.paymentMethod || 'N/A'}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gateway</span>
                  <span>{transaction.paymentGateway || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tipe</span>
                  <span>{transaction.type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Periode</span>
                  <span>{transaction.period}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tanggal Dibuat</span>
                  <span className="text-sm">{formatDate(transaction.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Terakhir Update</span>
                  <span className="text-sm">{formatDate(transaction.updatedAt)}</span>
                </div>

                {transaction.failureReason && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <span>❌</span>
                      <span className="font-medium">Alasan Gagal:</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{transaction.failureReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Package Details */}
            {packageData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detail Paket</CardTitle>
                  <CardDescription>{packageData.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nama Paket</span>
                    <span className="font-bold">{packageData.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Harga Bulanan</span>
                    <span className="font-bold">
                      {formatCurrency(packageData.price, packageData.currency)}
                    </span>
                  </div>

                  {packageData.yearlyPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Harga Tahunan</span>
                      <span className="font-bold">
                        {formatCurrency(packageData.yearlyPrice, packageData.currency)}
                      </span>
                    </div>
                  )}

                  {packageData.duration && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Durasi</span>
                      <span>{packageData.duration} hari</span>
                    </div>
                  )}

                  {(packageData.maxContentGenerations !== undefined || packageData.maxImageGenerations !== undefined) && (
                    <div className="space-y-2">
                      {packageData.maxContentGenerations !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Maks. Generate Konten</span>
                          <span>{packageData.maxContentGenerations === -1 ? 'Tidak Terbatas' : packageData.maxContentGenerations}</span>
                        </div>
                      )}

                      {packageData.maxImageGenerations !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Maks. Generate Gambar</span>
                          <span>{packageData.maxImageGenerations === -1 ? 'Tidak Terbatas' : packageData.maxImageGenerations}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {packageData.features && Object.keys(packageData.features).length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Fitur Paket</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {renderFeatures(packageData.features)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metadata Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {Object.entries(transaction.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600 font-medium">{key}</span>
                        <span className="text-sm text-gray-900">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Tutup
              </Button>
              {transaction.status === 'FAILED' && packageData && (
                <Button
                  onClick={() => {
                    // Redirect to billing page for retry
                    window.location.href = '/dashboard/billing'
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Coba Lagi
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}