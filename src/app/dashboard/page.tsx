'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SubscriptionStatusCard } from '@/components/subscription/SubscriptionBadge'
import { useUser } from '@/contexts/UserContext'

interface ActivityStats {
  totalContentGenerations: number
  totalImageGenerations: number
  todayContentGenerations: number
  todayImageGenerations: number
  weeklyContentGenerations: number
  weeklyImageGenerations: number
  monthlyContentGenerations: number
  monthlyImageGenerations: number
}

interface RecentActivity {
  id: string
  activityType: string
  action: string
  description: string
  timestamp: string
  metadata?: any
}

export default function DashboardPage() {
  const { user } = useUser()
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchActivityData = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/activity/stats?userId=${user.id}&period=all`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.data.stats)
        setRecentActivities(data.data.recentActivities.slice(0, 5)) // Show only 5 recent activities
      }
    } catch (error) {
      console.error('Error fetching activity data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivityData()
  }, [user])

  const getActivityIcon = (activityType: string): string => {
    switch (activityType) {
      case 'CONTENT_GENERATION':
        return '📝'
      case 'IMAGE_GENERATION':
        return '🎨'
      case 'LOGIN':
        return '🔑'
      case 'LOGOUT':
        return '🚪'
      case 'PROFILE_UPDATE':
        return '👤'
      case 'SETTINGS_UPDATE':
        return '⚙️'
      default:
        return '📊'
    }
  }

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    return `${diffDays} hari lalu`
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600">Silakan login untuk melihat dashboard Anda</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang kembali, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Asisten UMKM siap membantu mengembangkan bisnis Anda dengan AI teknologi terkini.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-gray-300 shadow-md">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="border-gray-300 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Konten</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalContentGenerations || 0}</p>
                    <p className="text-sm text-green-600">+{stats?.todayContentGenerations || 0} hari ini</p>
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
                    <p className="text-sm text-gray-600 mb-1">Total Gambar</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalImageGenerations || 0}</p>
                    <p className="text-sm text-green-600">+{stats?.todayImageGenerations || 0} hari ini</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-300 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Minggu Ini</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(stats?.weeklyContentGenerations || 0) + (stats?.weeklyImageGenerations || 0)}
                    </p>
                    <p className="text-sm text-gray-600">
                      📝 {stats?.weeklyContentGenerations || 0} • 🎨 {stats?.weeklyImageGenerations || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SubscriptionStatusCard />
          </>
        )}
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
            <CardDescription>5 aktivitas terakhir Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada aktivitas yang tercatat</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getActivityIcon(activity.activityType)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/dashboard/activity">
                <Button variant="outline" className="w-full">
                  Lihat Semua Aktivitas
                </Button>
              </Link>
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