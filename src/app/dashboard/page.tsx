'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SubscriptionStatusCard } from '@/components/subscription/SubscriptionBadge'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang di Dashboard! 👋
        </h1>
        <p className="text-gray-600">
          Asisten UMKM siap membantu mengembangkan bisnis Anda dengan AI teknologi terkini.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-gray-300 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Konten Dibuat</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
                <p className="text-sm text-green-600">+12% bulan ini</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gambar Dihasilkan</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-green-600">+8% bulan ini</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <SubscriptionStatusCard />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-300 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/konten">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">✍️</span>
                </div>
                <CardTitle className="text-blue-600">Generate Konten</CardTitle>
                <CardDescription>
                  Buat caption, postingan blog, email marketing otomatis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Mulai Generate
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-gray-300 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/gambar">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <CardTitle className="text-purple-600">Generate Gambar</CardTitle>
                <CardDescription>
                  Desain produk, logo, postingan sosmed dengan AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Buat Gambar
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-gray-300 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/caption">
              <CardHeader>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">#️⃣</span>
                </div>
                <CardTitle className="text-green-600">Auto Caption</CardTitle>
                <CardDescription>
                  Caption menarik + hashtag trending untuk semua platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Generate Caption
                </Button>
              </CardContent>
            </Link>
          </Card>

          </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-gray-300 shadow-md">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Konten dan gambar yang baru saja Anda buat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span>📝</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Caption Instagram Fashion</p>
                  <p className="text-sm text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span>🎨</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Logo Coffee Shop</p>
                  <p className="text-sm text-gray-500">5 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span>💬</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Auto Reply Customer</p>
                  <p className="text-sm text-gray-500">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-md">
          <CardHeader>
            <CardTitle>Tips & Saran</CardTitle>
            <CardDescription>Panduan untuk memaksimalkan Asisten UMKM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">💡 Tips Minggu Ini</h4>
                <p className="text-sm text-blue-700">
                  Gunakan fitur "Batch Generate" untuk membuat 30 konten sekaligus dalam 1 klik!
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">🎯 Fitur Baru</h4>
                <p className="text-sm text-purple-700">
                  Sekarang bisa generate video pendek dengan AI untuk TikTok dan Reels!
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">📈 Statistik</h4>
                <p className="text-sm text-green-700">
                  Engagement Anda naik 45% bulan ini dengan konten AI-generated!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}