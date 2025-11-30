import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  showBackToHome?: boolean
}

export function AuthLayout({ children, title, description, showBackToHome = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          {showBackToHome && (
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors">
              <span>←</span>
              <span className="text-sm">Kembali ke Beranda</span>
            </Link>
          )}

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🚀</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Asisten UMKM. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}