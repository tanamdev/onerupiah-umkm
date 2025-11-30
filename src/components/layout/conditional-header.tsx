'use client'

import { useState, useEffect } from 'react'
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
  isAuthenticated = false,
  user,
  currentPath = '/'
}: ConditionalHeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated)
  const [userData, setUserData] = useState(user || {
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "premium" as const
  })

  // Check if current path is in dashboard
  const isDashboardPath = currentPath.startsWith('/dashboard')

  // Update auth state based on path (for demo purposes)
  useEffect(() => {
    if (isDashboardPath && !isLoggedIn) {
      setIsLoggedIn(true)
    }
  }, [isDashboardPath, isLoggedIn])

  // If it's a dashboard path, always show dashboard header
  if (isDashboardPath) {
    return <DashboardHeader
      userName={userData.name}
      userEmail={userData.email}
      userPlan={userData.plan}
    />
  }

  // If user is authenticated and not on dashboard, you could show dashboard header
  // or a modified version. For now, we'll keep landing page header for non-dashboard pages
  return <Header />
}