'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/layout/auth-layout'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap harus diisi'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal')
      }

      // Redirect to login page
      window.location.href = '/auth/login?message=registration_success'

    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Terjadi kesalahan saat registrasi' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Buat Akun Baru"
      description="Daftar untuk mulai menggunakan Asisten UMKM dan tingkatkan bisnis Anda dengan AI Assistant"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

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
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Ulangi password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                errors.agreeTerms ? 'border-red-500' : ''
              }`}
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
              Saya menyetujui{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-500">
                Syarat dan Ketentuan
              </Link>{' '}
              serta{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-500">
                Kebijakan Privasi
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-sm text-red-600">{errors.agreeTerms}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          disabled={isLoading}
        >
          {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Masuk di sini
            </Link>
          </span>
        </div>

          </form>
    </AuthLayout>
  )
}