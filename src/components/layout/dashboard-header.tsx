'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DashboardHeaderProps {
  userName?: string
  userEmail?: string
  userPlan?: 'free' | 'premium' | 'enterprise'
}

export function DashboardHeader({
  userName = "User",
  userEmail = "user@example.com",
  userPlan = "free"
}: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()

  const planColors = {
    free: 'bg-gray-100 text-gray-800',
    premium: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800'
  }

  const planLabels = {
    free: 'Gratis',
    premium: 'Premium',
    enterprise: 'Enterprise'
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Generate Konten', href: '/dashboard/konten', icon: '✍️' },
    { name: 'Generate Gambar', href: '/dashboard/gambar', icon: '🎨' },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: '⚙️' },
  ]

  // Determine current page
  const getCurrentPage = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname.startsWith('/dashboard/konten')) return 'Generate Konten'
    if (pathname.startsWith('/dashboard/gambar')) return 'Generate Gambar'
    if (pathname.startsWith('/dashboard/settings')) return 'Pengaturan'
    return 'Dashboard'
  }

  const currentPageName = getCurrentPage()

  return (
    <header className="bg-white border-b fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-lg font-bold">🚀</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Asisten UMKM</span>
                <div className="text-xs text-gray-500">Dashboard</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.name === currentPageName
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.name === currentPageName && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Credits - Desktop Only */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-lg">🪙</span>
              <div>
                <span className="text-sm font-semibold text-gray-800">
                  {userPlan === 'free' ? '50' : '∞'}
                </span>
                <span className="text-xs text-gray-600 ml-1">Kredit</span>
              </div>
            </div>

            {/* Plan Badge */}
            <Badge className={`${planColors[userPlan]} border-0 px-3 py-1 text-sm font-medium`}>
              {planLabels[userPlan]}
            </Badge>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  <span className="text-white text-sm font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-32">{userEmail}</p>
                </div>
                <span className="text-gray-400 text-sm">
                  {isDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                    <div className="mt-2">
                      <Badge className={`${planColors[userPlan]} border-0 text-xs`}>
                        {planLabels[userPlan]} Plan
                      </Badge>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-base">👤</span>
                      Profil Saya
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-base">⚙️</span>
                      Pengaturan
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-base">💳</span>
                      Tagihan & Langganan
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        // Handle logout logic here
                        setIsDropdownOpen(false)
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span className="text-base">🚪</span>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-1 py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-2 text-xs rounded-lg transition-colors ${
                  item.name === currentPageName
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-medium truncate">{item.name.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}