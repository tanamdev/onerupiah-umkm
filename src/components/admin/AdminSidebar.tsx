'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen fixed inset-y-0 left-0 bg-white/80 backdrop-blur-xl border-r border-gray-200 z-30 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-1.5 rounded-lg shadow-sm shadow-blue-500/20">
             <Settings className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Admin Portal
          </span>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu Utama</div>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 relative',
                isActive 
                  ? 'text-blue-700 bg-blue-50/80 shadow-sm shadow-blue-100/50' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              )} />
              {item.name}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-md"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          Logout
        </button>
      </div>
    </aside>
  )
}
