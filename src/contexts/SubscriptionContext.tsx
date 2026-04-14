'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface SubscriptionData {
  id: string
  plan: string
  status: string
  startDate: Date
  endDate: Date
  monthlyPrice: number
  yearlyPrice?: number
  daysLeft: number
  isExpired: boolean
  nextResetAt?: Date | null
}

export interface QuotaData {
  contentUsed: number
  imageUsed: number
  contentLimit: number | null
  imageLimit: number | null
  canGenerateContent: boolean
  canGenerateImage: boolean
  resetAt: Date | null
  nextResetAt: Date | null
  periodDays: number
  plan: string | null
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null
  quota: QuotaData | null
  isLoading: boolean
  isTrial: boolean
  isPremium: boolean
  isFree: boolean
  daysLeft: number
  canGenerate: boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

interface SubscriptionProviderProps {
  children: ReactNode
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscription = async () => {
    try {
      const [subResponse, quotaResponse] = await Promise.all([
        fetch('/api/subscription'),
        fetch('/api/subscription/quota'),
      ])

      if (subResponse.ok) {
        const data = await subResponse.json()
        setSubscription(data.subscription)
      }

      if (quotaResponse.ok) {
        const data = await quotaResponse.json()
        setQuota(data.quota)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSubscription = async () => {
    setIsLoading(true)
    await fetchSubscription()
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  const isTrial = subscription?.plan === 'TRIAL'
  const isPremium = subscription?.plan === 'PREMIUM_MONTHLY' || subscription?.plan === 'PREMIUM_YEARLY'
  const isFree = subscription?.plan === 'FREE'
  const daysLeft = subscription?.daysLeft || 0
  // Free plan: selalu bisa generate selama kuota tersedia (quota check dilakukan di API)
  const canGenerate = subscription?.status === 'ACTIVE' && !subscription?.isExpired

  const value: SubscriptionContextType = {
    subscription,
    quota,
    isLoading,
    isTrial,
    isPremium,
    isFree,
    daysLeft,
    canGenerate,
    refreshSubscription
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}