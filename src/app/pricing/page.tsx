'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Crown, Zap, Star } from 'lucide-react'
import Link from 'next/link'
import { useSubscription } from '@/contexts/SubscriptionContext'

export default function PricingPage() {
  const { isTrial, isPremium, daysLeft, refreshSubscription } = useSubscription()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: 'Gratis',
      description: 'Coba fitur dasar kami',
      icon: '🎯',
      features: [
        '5 konten/hari',
        '3 gambar/hari',
        'Template dasar',
        'Support email'
      ],
      excluded: [
        'AI enhancement',
        'Template premium',
        'Export HD',
        'Priority support'
      ],
      color: 'border-gray-300 bg-white',
      buttonColor: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      planValue: 'FREE'
    },
    {
      name: 'Trial',
      price: '7 Hari Gratis',
      description: 'Coba semua fitur premium',
      icon: '⚡',
      features: [
        'Unlimited konten',
        'Unlimited gambar',
        'Semua template',
        'AI enhancement',
        'Export HD',
        'Support email'
      ],
      excluded: [
        'Priority support'
      ],
      color: 'border-blue-500 bg-blue-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      planValue: 'TRIAL',
      isPopular: isTrial && daysLeft > 0
    },
    {
      name: 'Premium Monthly',
      price: 'Rp 99.000/bulan',
      description: 'Untuk bisnis yang sedang berkembang',
      icon: '👑',
      features: [
        'Unlimited konten',
        'Unlimited gambar',
        'Semua template',
        'AI enhancement',
        'Export HD',
        'Priority support',
        'Custom branding'
      ],
      excluded: [],
      color: 'border-purple-500 bg-purple-50',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      planValue: 'PREMIUM_MONTHLY',
      isPopular: !isTrial && !isPremium
    },
    {
      name: 'Premium Yearly',
      price: 'Rp 708.000/tahun',
      originalPrice: 'Rp 1.188.000',
      description: 'Hemat 40% dengan pembayaran tahunan',
      icon: '💎',
      features: [
        'Unlimited konten',
        'Unlimited gambar',
        'Semua template',
        'AI enhancement',
        'Export HD',
        'Priority support',
        'Custom branding',
        'API access',
        'Advanced analytics'
      ],
      excluded: [],
      color: 'border-green-500 bg-green-50',
      buttonColor: 'bg-green-600 hover:bg-green-700 text-white',
      planValue: 'PREMIUM_YEARLY',
      badge: 'HEMAT 40%'
    }
  ]

  const handleUpgrade = async (plan: string) => {
    setIsUpgrading(true)
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan })
      })

      if (response.ok) {
        await refreshSubscription()
        // Redirect ke dashboard atau halaman sukses
        window.location.href = '/dashboard?upgraded=true'
      } else {
        alert('Gagal upgrade subscription')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Terjadi kesalahan saat upgrade')
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Kembali ke Dashboard
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Tepat untuk Bisnis Anda
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan akses ke semua fitur AI-powered untuk meningkatkan produktivitas dan penjualan bisnis Anda
            </p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      {isTrial && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-900 font-medium">
              🎉 Trial Anda aktif! {daysLeft} hari tersisa untuk mencoba semua fitur premium
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan =
              (plan.planValue === 'TRIAL' && isTrial) ||
              (plan.planValue === 'PREMIUM_MONTHLY' && isPremium) ||
              (plan.planValue === 'PREMIUM_YEARLY' && isPremium)

            return (
              <Card key={plan.name} className={`relative ${plan.color} ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      {plan.badge || 'POPULER'}
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aktif
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-2">{plan.icon}</div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {plan.originalPrice}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    className={`w-full mb-6 ${isCurrentPlan ? 'bg-green-600 hover:bg-green-700' : plan.buttonColor}`}
                    disabled={isCurrentPlan || isUpgrading}
                    onClick={() => !isCurrentPlan && handleUpgrade(plan.planValue)}
                  >
                    {isCurrentPlan ? 'Paket Aktif' : isUpgrading ? 'Processing...' : plan.planValue === 'FREE' ? 'Gunakan Gratis' : 'Upgrade Sekarang'}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}

                    {plan.excluded.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 opacity-50">
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
                        <span className="text-sm text-gray-500 line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Pertanyaan yang Sering Diajukan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Bisakah saya berhenti berlangganan kapan saja?</h3>
              <p className="text-gray-600 text-sm">Ya, Anda dapat berhenti berlangganan kapan saja. Paket akan aktif sampai akhir periode penagihan.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Apakah ada biaya setup?</h3>
              <p className="text-gray-600 text-sm">Tidak, tidak ada biaya setup tersembunyi. Anda hanya membayar biaya langganan.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bagaimana dengan pembayaran?</h3>
              <p className="text-gray-600 text-sm">Kami menerima transfer bank, e-wallet, dan kartu kredit untuk pembayaran di Indonesia.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Apakah data saya aman?</h3>
              <p className="text-gray-600 text-sm">Ya, kami menggunakan enkripsi end-to-end dan tidak membagikan data Anda dengan pihak ketiga.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}