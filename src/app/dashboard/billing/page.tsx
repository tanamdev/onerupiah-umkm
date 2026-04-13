'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/contexts/UserContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TransactionDetailModal } from '@/components/billing/TransactionDetailModal'

interface Package {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice?: number
  currency: string
  features: string[] | Record<string, unknown> | any // Adjusted for JSON arrays
  isActive: boolean
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
  createdAt: string
  updatedAt: string
  package: Package
  packageId: string
  paymentMethod?: string
  paymentGateway?: string
  externalId?: string
  failureReason?: string
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

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

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

      // If price is 0 (Free Trial), we can directly claim it or tell user to contact admin for now
      if (amount === 0) {
        alert('Mengaktifkan langganan gratis (Trial). Fitur aktivasi otomatis dapat ditambahkan oleh admin.')
        return
      }

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

  const handleTransactionClick = async (transaction: Transaction) => {
    try {
      setModalLoading(true)
      setSelectedTransaction(transaction)
      setSelectedPackage(transaction.package)
      setIsModalOpen(true)

      // Fetch detailed package info if not available
      if (!transaction.package && transaction.packageId) {
        const response = await fetch(`/api/transactions/${transaction.id}`)
        if (response.ok) {
          const data = await response.json()
          setSelectedPackage(data.data.package)
        }
      }
    } catch (error) {
      console.error('❌ Error fetching transaction details:', error)
      alert('Gagal memuat detail transaksi. Silakan coba lagi.')
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
    setSelectedPackage(null)
    setModalLoading(false)
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
        <div className="space-y-12">
          
          {/* Top Section: User's Current Subscription */}
          {billingInfo.currentSubscription && (
            <Card className="shadow-md border-l-4 border-l-blue-500 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">Paket Saat Ini</h2>
                    {billingInfo.renewalInfo.needsRenewal && (
                      <Badge className="bg-orange-100 text-orange-800 border-none">⚠️ Perlu Perpanjang</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {billingInfo.currentSubscription.plan === 'FREE' ? 'Paket Gratis' :
                     billingInfo.currentSubscription.plan === 'TRIAL' ? 'Paket Trial' :
                     billingInfo.currentSubscription.package?.name || 'UMKM Professional'}
                    {' • '} Berlaku hingga: <span className="font-semibold text-gray-900">{formatDate(billingInfo.currentSubscription.endDate)}</span>
                  </p>
                </div>
                
                {billingInfo.renewalInfo.needsRenewal && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Button onClick={() => handleRenewal(packages[0]?.id || '', 'monthly')} className="bg-blue-600 hover:bg-blue-700">
                      Perpanjang Bulanan
                    </Button>
                    <Button variant="outline" onClick={() => handleRenewal(packages[0]?.id || '', 'yearly')} className="bg-white">
                      Tahunan (Hemat 20%)
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Middle Section: Available Packages */}
          <div>
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Pilih Paket Langganan</h2>
              <p className="text-gray-500 mt-1">Tingkatkan limit generasi AI Anda sesuai dengan kebutuhan bisnis.</p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
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
            ) : packages.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Tidak ada paket yang tersedia</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => {
                  let featuresList: any[] = [];
                  if (typeof pkg.features === 'string') {
                    try { featuresList = JSON.parse(pkg.features); } catch (e) { featuresList = []; }
                  } else if (Array.isArray(pkg.features)) {
                    featuresList = pkg.features;
                  } else if (pkg.features && typeof pkg.features === 'object') {
                    featuresList = Object.entries(pkg.features).map(([k, v]) => formatFeatureValue(v));
                  }

                  const isPro = pkg.price > 0;
                  const isCurrentPackage = billingInfo?.currentSubscription?.package?.id === pkg.id || billingInfo?.currentSubscription?.packageId === pkg.id;

                  return (
                    <Card key={pkg.id} className={`shadow-lg hover:shadow-xl transition-all border-2 flex flex-col h-full transform hover:-translate-y-1 ${isPro ? 'border-blue-500 relative' : 'border-gray-200'}`}>
                      {isPro && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <Badge className="bg-blue-600 text-white px-3 py-1 font-bold tracking-wide uppercase text-xs">Paling Diminati</Badge>
                        </div>
                      )}
                      <CardHeader className={`pb-4 border-b ${isPro ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-100'} rounded-t-lg text-center pt-8`}>
                        <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                          {pkg.name}
                        </CardTitle>
                        <CardDescription className="text-gray-500 mt-2">{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 pt-6 pb-6 px-6 flex flex-col justify-between bg-white relative">
                        <div>
                          <div className="mb-8 text-center">
                            <div className="flex items-end justify-center gap-1">
                              {pkg.price === 0 ? (
                                <span className="text-4xl font-extrabold text-gray-900">GRATIS</span>
                              ) : (
                                <>
                                  <span className="text-4xl font-extrabold text-gray-900">{formatCurrency(pkg.price)}</span>
                                  <span className="text-gray-500 font-medium mb-1 z-10">/{pkg.duration} Hari</span>
                                </>
                              )}
                            </div>
                            {pkg.yearlyPrice && (
                              <div className="mt-2 inline-block bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                <span className="text-xs font-semibold text-green-700">
                                  {formatCurrency(pkg.yearlyPrice)} / tahun
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 mb-8">
                            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 text-center">Apa yang Anda dapatkan</p>
                            {featuresList.length > 0 ? (
                              featuresList.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className={`rounded-full p-1 flex-shrink-0 ${isPro ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  </div>
                                  <span className="text-sm text-gray-700 font-medium leading-tight">{formatFeatureValue(feature)}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 italic text-center">Belum ada fitur detail.</p>
                            )}
                          </div>
                        </div>

                        <Button 
                          size="lg"
                          disabled={isCurrentPackage}
                          onClick={() => handleRenewal(pkg.id, 'monthly')} 
                          className={`w-full font-semibold tracking-wide shadow-sm mt-4 ${
                            isCurrentPackage
                            ? 'bg-gray-100 text-gray-500 border-2 border-gray-200 cursor-not-allowed hover:bg-gray-100'
                            : pkg.price === 0 
                            ? 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                          }`}
                        >
                          {isCurrentPackage ? 'Paket Saat Ini' : pkg.price === 0 ? 'Klaim Gratis' : 'Pilih Paket Pro'}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom Section: Transaction History */}
          <div className="pt-4 border-t border-gray-100">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Riwayat Transaksi</h2>
                <p className="text-sm text-gray-500">Pantau semua transaksi Anda terkait paket langganan.</p>
              </div>
            </div>
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-0">
                {billingInfo.recentTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada riwayat transaksi</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {billingInfo.recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        onClick={() => handleTransactionClick(transaction)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">
                              {transaction.package?.name || 'Unknown Package'}
                            </p>
                            <Badge className={`${getStatusColor(transaction.status)} border-none text-xs`}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{formatDate(transaction.createdAt)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{transaction.type.toLowerCase()}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{transaction.paymentMethod || 'Metode TBA'}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                          <p className="font-bold text-gray-900 text-lg">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </p>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md hidden sm:block mt-1">
                            Lihat Detail →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Tidak dapat memuat informasi billing</p>
          </CardContent>
        </Card>
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transaction={selectedTransaction}
        packageData={selectedPackage}
        isLoading={modalLoading}
      />
    </div>
  )
}
