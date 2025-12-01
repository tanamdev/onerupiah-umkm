'use client'

import { Header } from './header'
import { DashboardHeader } from './dashboard-header'

interface ConditionalHeaderProps {
  isAuthenticated?: boolean
  user?: {
    name?: string
    email?: string
    plan?: 'free' | 'premium' | 'enterprise'
  }
  currentPath?: string
}

export function ConditionalHeader({
  currentPath = '/'
}: ConditionalHeaderProps) {
  const isDashboardPath = currentPath.startsWith('/dashboard')

  if (isDashboardPath) {
    return <DashboardHeader />
  }

  return <Header />
}
