'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/contexts/UserContext'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Package {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice?: number
  currency: string
  features: Record<string, unknown> | null
  isActive: boolean
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
  createdAt: string
  package: Package
  metadata?: any
}

interface BillingInfo {
  user: {
    id: string
    name: string
    email: string
  }
  currentSubscription: any
  recentTransactions: Transaction[]
  transactionSummary: {
    totalTransactions: number
    totalSpent: number
    successfulTransactions: number
    failedTransactions: number
    monthlySpending: number
    yearlySpending: number
  }
  renewalInfo: {
    needsRenewal: boolean
    subscription: any
    daysRemaining: number
  }
}

export default function BillingPage() {
  const { user } = useUser()
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const fetchBillingInfo = async () => {
    if (!user?.id) return

    try {
      setBillingLoading(true)
      const response = await fetch(`/api/billing?userId=${user.id}`)

      if (response.ok) {
        const data = await response.json()
        setBillingInfo(data.data)
      } else {
        console.error('Failed to fetch billing info')
      }
    } catch (error) {
      console.error('Error fetching billing info:', error)
    } finally {
      setBillingLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.data)
      } else {
        console.error('Failed to fetch packages')
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchBillingInfo()
    }
    fetchPackages()
  }, [user])

  const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
    if (currency === 'IDR') {
      return `Rp ${amount.toLocaleString('id-ID')}`
    }
    return `$${(amount / 100).toFixed(2)}`
  }

  const formatFeatureValue = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return value.toString()
    if (Array.isArray(value) || (value && typeof value === 'object')) {
      try {
        return JSON.stringify(value)
      } catch {
        return ''
      }
    }
    return ''
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRenewal = async (packageId: string, period: 'monthly' | 'yearly') => {
    if (!user?.id) return

    try {
      const packageData = packages.find(p => p.id === packageId)
      if (!packageData) return

      const amount = period === 'monthly' ? packageData.price : packageData.yearlyPrice || packageData.price

      console.log('🚀 Starting Payment Process:', {
        userId: user.id,
        packageId,
        packageName: packageData.name,
        amount,
        period: period.toUpperCase()
      })

      const response = await fetch('/api/payment/duitku/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          packageId,
          billingPeriod: period.toUpperCase(),
          packageName: packageData.name,
          packagePrice: amount,
          userEmail: user.email,
          userName: user.name,
          userPhone: user.phone
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Payment Invoice Created:', data.data)

        // Redirect to Duitku payment page
        if (data.data.paymentUrl) {
          window.location.href = data.data.paymentUrl
        } else {
          alert('URL pembayaran tidak tersedia. Silakan coba lagi.')
        }
      } else {
        const errorData = await response.json()
        console.error('❌ Payment Creation Failed:', errorData)
        alert(`Gagal membuat pembayaran: ${errorData.error || 'Silakan coba lagi.'}`)
      }
    } catch (error) {
      console.error('❌ Payment Processing Error:', error)
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.')
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Billing</h1>
          <p className="text-gray-600">Silakan login untuk melihat halaman billing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Paket</h1>
        <p className="text-gray-600">Kelola paket berlangganan dan lihat riwayat transaksi Anda</p>
      </div>

      {billingLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : billingInfo ? (
        <>
  
          {/* Main Grid Layout: Transaction History (2) + Package Column (1) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transaction History - 2/3 width */}
            <div className="lg:col-span-2">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200 h-full">
                <CardHeader>
                  <CardTitle>Riwayat Transaksi</CardTitle>
                  <CardDescription>Semua transaksi pembelian Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  {billingInfo.recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Belum ada riwayat transaksi</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {billingInfo.recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-gray-900 text-lg">
                                {transaction.package?.name || 'Unknown Package'}
                              </p>
                              <Badge className={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(transaction.createdAt)} • {transaction.type.toLowerCase()} • {transaction.period.toLowerCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-lg">
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Package Column - 1/3 width */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Package Section */}
              {billingInfo.currentSubscription && (
                <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Paket Saat Ini</span>
                      {billingInfo.renewalInfo.needsRenewal && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          ⚠️ Perlu Perpanjang
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {billingInfo.currentSubscription.plan === 'FREE' ? 'Paket Gratis' :
                           billingInfo.currentSubscription.plan === 'TRIAL' ? 'Paket Trial' :
                           billingInfo.currentSubscription.package?.name || 'UMKM Professional'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Berlaku hingga: {formatDate(billingInfo.currentSubscription.endDate)}
                        </p>
                      </div>

                      {billingInfo.renewalInfo.needsRenewal && (
                        <Alert className="text-xs">
                          <AlertDescription>
                            ⏰ Berakhir {billingInfo.renewalInfo.daysRemaining} hari lagi
                          </AlertDescription>
                        </Alert>
                      )}

                      {billingInfo.renewalInfo.needsRenewal && (
                        <div className="space-y-2">
                          <Button
                            onClick={() => handleRenewal(packages[0]?.id || '', 'monthly')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                            size="sm"
                          >
                            Perpanjang Bulanan
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRenewal(packages[0]?.id || '', 'yearly')}
                            className="w-full text-sm"
                            size="sm"
                          >
                            Perpanjang Tahunan
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Available Package */}
              {isLoading ? (
                <Card className="animate-pulse border-gray-200 shadow-md">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ) : packages.length === 0 ? (
                <Card className="shadow-md">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">Tidak ada paket yang tersedia</p>
                  </CardContent>
                </Card>
              ) : (
                packages.map((pkg) => (
                  <Card key={pkg.id} className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription className="text-sm">{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(pkg.price)}
                        </div>
                        <span className="text-sm text-gray-500">per bulan</span>
                        {pkg.yearlyPrice && (
                          <div className="mt-1">
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(pkg.yearlyPrice)} per tahun
                            </span>
                            <p className="text-xs text-green-600">Hemat 20%</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {pkg.features && typeof pkg.features === 'object' && Object.entries(pkg.features).slice(0, 5).map(([key, value]) => (
                          <div key={key} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5 text-xs">✓</span>
                            <span className="text-xs text-gray-700">{formatFeatureValue(value)}</span>
                          </div>
                        ))}
                        {pkg.features && typeof pkg.features === 'object' && Object.keys(pkg.features).length > 5 && (
                          <p className="text-xs text-gray-500 italic">...dan {Object.keys(pkg.features).length - 5} fitur lainnya</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Tidak dapat memuat informasi billing</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
