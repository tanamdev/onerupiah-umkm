'use client'

import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

export function AdminHeader() {
  const [adminUser, setAdminUser] = useState<{name: string, role: string} | null>(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
           const data = await response.json()
           if (data.user) {
             setAdminUser({ name: data.user.name, role: data.user.role })
           }
        }
      } catch (error) {
        console.error('Error fetching admin details', error)
      }
    }
    fetchAdminData()
  }, [])

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-gray-800 text-lg">Admin Control</h2>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-900">{adminUser?.name || 'Admin User'}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider">{adminUser?.role || 'ADMIN'}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
             {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  )
}
