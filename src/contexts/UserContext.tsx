'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { activityLogger } from '@/services/activityLogger'

export interface UserData {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  isActive: boolean
  createdAt: Date
  phone?: string
  avatar?: string
  businessName?: string
  businessCategory?: string
  businessDescription?: string
  businessAddress?: string
  businessPhone?: string
  businessWebsite?: string
  storeName?: string
  storeLogo?: string
  storeImage?: string
  storeAddress?: string
  storePhone?: string
  primaryColor?: string
  secondaryColor?: string
  thirdColor?: string
  aiProvider?: string
  aiModel?: string
  aiApiKey?: string
  aiTemperature?: number
  aiMaxTokens?: number
  aiToneOfVoice?: string
  aiTargetAudience?: string
  aiPlatforms?: string[]
  aiCustomInstructions?: string
}

interface UserContextType {
  user: UserData | null
  isLoading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)

        // Log login activity and set user info in activity logger
        await activityLogger.logLogin()
        activityLogger.setUserInfo(data.user.id, data.user.email)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    setIsLoading(true)
    await fetchUser()
  }

  const logout = async () => {
    try {
      // Log logout activity before clearing user state
      if (user) {
        await activityLogger.logLogout()
      }

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setUser(null)
        // Redirect to login page
        window.location.href = '/auth/login'
      } else {
        // If API fails, still clear user state and redirect
        setUser(null)
        console.error('Logout failed')
        window.location.href = '/auth/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if there's an error, clear user state and redirect
      setUser(null)
      window.location.href = '/auth/login'
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // Update activity logger with user info when user changes
  useEffect(() => {
    if (user) {
      activityLogger.setUserInfo(user.id, user.email)
    }
  }, [user])

  const value: UserContextType = {
    user,
    isLoading,
    refreshUser,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
