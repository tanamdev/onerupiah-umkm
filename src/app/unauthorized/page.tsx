'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/layout/auth-layout'

export default function UnauthorizedPage() {
  return (
    <AuthLayout
      title="Akses Ditolak"
      description="Anda harus login untuk mengakses halaman ini"
    >
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H8m13-6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Akses Ditolak
          </h2>
          <p className="text-gray-600">
            Halaman ini memerlukan autentikasi. Silakan login terlebih dahulu untuk melanjutkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/auth/login">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
              Masuk ke Akun
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}