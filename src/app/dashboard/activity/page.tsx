'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  mostUsedContentType?: string
  mostUsedImageMode?: string
  mostUsedPlatform?: string
  mostUsedImageSize?: string
}

interface DailyStats {
  date: string
  contentCount: number
  imageCount: number
  totalTokensUsed: number
  averageGenerationTime: number
}

interface RecentActivity {
  id: string
  activityType: string
  action: string
  description: string
  timestamp: string
  metadata?: any
}

export default function ActivityDashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all')

  const fetchActivityStats = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/activity/stats?userId=${user.id}&period=${selectedPeriod}`)

      if (response.ok) {
        const data = await response.json()
        setStats(data.data.stats)
        setDailyStats(data.data.dailyStats)
        setRecentActivities(data.data.recentActivities)
      } else {
        console.error('Failed to fetch activity stats')
      }
    } catch (error) {
      console.error('Error fetching activity stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivityStats()
  }, [user, selectedPeriod])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

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

  const getActivityColor = (activityType: string): string => {
    switch (activityType) {
      case 'CONTENT_GENERATION':
        return 'bg-blue-100 text-blue-800'
      case 'IMAGE_GENERATION':
        return 'bg-green-100 text-green-800'
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800'
      case 'LOGOUT':
        return 'bg-red-100 text-red-800'
      case 'PROFILE_UPDATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'SETTINGS_UPDATE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Aktivitas</h1>
          <p className="text-gray-600">Silakan login untuk melihat aktivitas Anda</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aktivitas Saya</h1>
            <p className="text-gray-600">Monitor penggunaan dan statistik generasi konten dan gambar</p>
          </div>

          {/* Filter Buttons - Mobile Optimized */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {(['all', 'today', 'week', 'month'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="flex-1 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm"
              >
                {period === 'all' ? 'Semua' : period === 'today' ? 'Hari Ini' : period === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse border-gray-200">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Konten</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalContentGenerations}</p>
                  </div>
                  <div className="text-3xl">📝</div>
                </div>
                <div className="mt-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    +{stats.todayContentGenerations} hari ini
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gambar</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalImageGenerations}</p>
                  </div>
                  <div className="text-3xl">🎨</div>
                </div>
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-800">
                    +{stats.todayImageGenerations} hari ini
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Minggu Ini</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.weeklyContentGenerations + stats.weeklyImageGenerations}
                    </p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div>📝 {stats.weeklyContentGenerations} konten</div>
                  <div>🎨 {stats.weeklyImageGenerations} gambar</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.monthlyContentGenerations + stats.monthlyImageGenerations}
                    </p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div>📝 {stats.monthlyContentGenerations} konten</div>
                  <div>🎨 {stats.monthlyImageGenerations} gambar</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <CardTitle>Insights Penggunaan</CardTitle>
                <CardDescription>Pola penggunaan yang paling sering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.mostUsedContentType && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Konten Terpopuler</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats.mostUsedContentType}
                      </Badge>
                    </div>
                  )}
                  {stats.mostUsedImageMode && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mode Gambar Terpopuler</span>
                      <Badge className="bg-green-100 text-green-800">
                        {stats.mostUsedImageMode}
                      </Badge>
                    </div>
                  )}
                  {stats.mostUsedPlatform && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Platform Terpopuler</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {stats.mostUsedPlatform}
                      </Badge>
                    </div>
                  )}
                  {stats.mostUsedImageSize && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ukuran Gambar Terpopuler</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {stats.mostUsedImageSize}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Daily Activity Chart */}
            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <CardTitle>Aktivitas Harian (7 Hari Terakhir)</CardTitle>
                <CardDescription>Grafik aktivitas generasi minggu ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyStats.map((day, index) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="text-sm text-gray-600 w-20">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                            <div
                              className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{
                                width: `${(day.contentCount / Math.max(...dailyStats.map(d => d.contentCount), 1)) * 100}%`,
                                minWidth: day.contentCount > 0 ? '40px' : '0'
                              }}
                            >
                              <span className="text-xs text-white font-medium">
                                {day.contentCount}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                            <div
                              className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{
                                width: `${(day.imageCount / Math.max(...dailyStats.map(d => d.imageCount), 1)) * 100}%`,
                                minWidth: day.imageCount > 0 ? '40px' : '0'
                              }}
                            >
                              <span className="text-xs text-white font-medium">
                                {day.imageCount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Konten</span>
                          <span>Gambar</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-200">
            <CardHeader>
              <CardTitle>Aktivitas Terkini</CardTitle>
              <CardDescription>10 aktivitas terakhir Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Belum ada aktivitas yang tercatat</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getActivityIcon(activity.activityType)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getActivityColor(activity.activityType)}>
                        {activity.activityType.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Tidak ada data aktivitas yang tersedia</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}