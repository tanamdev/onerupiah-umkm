'use client'

import { useSubscription } from '@/contexts/SubscriptionContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Zap, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export function SubscriptionBadge() {
  const { subscription, isLoading, isTrial, isPremium, daysLeft, canGenerate } = useSubscription()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <Badge variant="outline" className="border-gray-300 text-gray-600">
        Free Plan
      </Badge>
    )
  }

  if (isTrial) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Trial: {daysLeft} hari lagi
        </Badge>
        {daysLeft <= 3 && (
          <Badge variant="destructive" className="animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Upgrade segera
          </Badge>
        )}
      </div>
    )
  }

  if (isPremium) {
    return (
      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="border-gray-300 text-gray-600">
      Free Plan
    </Badge>
  )
}

export function SubscriptionStatusCard() {
  const { subscription, isLoading, isTrial, isPremium, daysLeft, canGenerate } = useSubscription()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (isTrial) {
    return (
      <div className={`rounded-lg border p-4 ${
        daysLeft <= 3 ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Free Trial Aktif</h3>
            <p className="text-sm text-blue-700">
              {daysLeft} hari tersisa
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-blue-900">{daysLeft}</span>
          </div>
        </div>

        {daysLeft <= 3 && (
          <div className="mt-3 pt-3 border-t border-orange-200">
            <p className="text-sm text-orange-700 mb-2">
              Trial Anda akan berakhir segera!
            </p>
            <Link href="/pricing">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Upgrade Sekarang
              </Button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-purple-900">Premium Aktif</h3>
            <p className="text-sm text-purple-700">
              Unlimited generation & features
            </p>
          </div>
          <Crown className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Free Plan</h3>
          <p className="text-sm text-gray-700">
            Limited features
          </p>
        </div>
        <div className="text-gray-500">
          <span className="text-sm">Free</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <Link href="/pricing">
          <Button size="sm" variant="outline" className="border-gray-300">
            Upgrade to Premium
          </Button>
        </Link>
      </div>
    </div>
  )
}