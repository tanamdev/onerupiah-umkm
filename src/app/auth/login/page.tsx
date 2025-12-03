'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/layout/auth-layout'

const layoutCopy = {
  title: 'Masuk ke Akun Anda',
  description: 'Masuk ke akun Asisten UMKM Anda untuk mulai menggunakan fitur AI Assistant'
}

function LoginContent() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Get redirect parameter from URL
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  // Debug: Log redirect parameter
  useEffect(() => {
    console.log('🔍 Login page redirect info:', {
      redirectTo,
      searchParams: Object.fromEntries(searchParams.entries()),
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A'
    })
  }, [redirectTo, searchParams])

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          // User is already logged in, redirect to intended page
          window.location.href = redirectTo
        }
      } catch (error) {
        // User is not logged in, stay on login page
        console.log('User not authenticated')
      }
    }

    checkAuth()
  }, [redirectTo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal')
      }

      // Redirect to the intended page or dashboard
      window.location.href = redirectTo

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title={layoutCopy.title} description={layoutCopy.description}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Ingat saya
            </label>
          </div>

          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Daftar sekarang
            </Link>
          </span>
        </div>

      </form>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title={layoutCopy.title} description={layoutCopy.description}>
          <div className="text-center text-sm text-gray-500 py-8">Memuat formulir login...</div>
        </AuthLayout>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
