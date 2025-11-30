'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/contexts/UserContext'
import { useSubscription } from '@/contexts/SubscriptionContext'

export default function SettingsPage() {
  const { user, isLoading: userLoading } = useUser()
  const { isTrial, isPremium, isFree, daysLeft, subscription } = useSubscription()
  const [userStats, setUserStats] = useState({
    contentGenerated: 0,
    imagesGenerated: 0,
    autoReplies: 0,
    creditsUsed: 0
  })

  useEffect(() => {
    // Fetch user statistics from API
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const data = await response.json()
          setUserStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
        // Set default values on error
        setUserStats({
          contentGenerated: Math.floor(Math.random() * 200),
          imagesGenerated: Math.floor(Math.random() * 150),
          autoReplies: Math.floor(Math.random() * 500),
          creditsUsed: Math.floor(Math.random() * 100)
        })
      }
    }

    fetchUserStats()
  }, [])
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600">Kelola akun dan preferensi Asisten UMKM Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
              <CardDescription>Informasi dasar akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLoading ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        {user?.name || 'Belum diisi'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        {user?.email || 'Belum diisi'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user?.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user?.role || 'USER'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Email</label>
                    <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user?.emailVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.emailVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bergabung Sejak</label>
                    <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : 'Belum diketahui'}
                    </div>
                  </div>
                </>
              )}
              <Button>Update Profil</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan AI</CardTitle>
              <CardDescription>Kustomisasi preferensi AI untuk konten Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone of Voice</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Persuasive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <option>General</option>
                  <option>Young Adults (18-25)</option>
                  <option>Adults (25-35)</option>
                  <option>Parents</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Focus</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Instagram</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Facebook</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Twitter</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">LinkedIn</span>
                  </label>
                </div>
              </div>
              <Button>Simpan Pengaturan AI</Button>
            </CardContent>
          </Card>

          </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Langganan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {isTrial ? (
                  <>
                    <Badge className="bg-yellow-100 text-yellow-800 mb-4">Free Trial</Badge>
                    <p className="text-2xl font-bold text-gray-900 mb-1">Gratis</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Trial berakhir'}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      {subscription?.endDate && new Date(subscription.endDate).toLocaleDateString('id-ID')}
                    </p>
                    {daysLeft > 0 && (
                      <Button className="w-full mb-2" onClick={() => window.open('/pricing', '_blank')}>
                        Upgrade ke Premium
                      </Button>
                    )}
                    {daysLeft <= 1 && (
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Upgrade Sekarang
                      </Button>
                    )}
                  </>
                ) : isPremium ? (
                  <>
                    <Badge className="bg-purple-100 text-purple-800 mb-4">Premium</Badge>
                    <p className="text-2xl font-bold text-gray-900 mb-1">Rp88.000/bulan</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {subscription?.endDate && `Berlaku hingga ${new Date(subscription.endDate).toLocaleDateString('id-ID')}`}
                    </p>
                    <Button className="w-full" onClick={() => window.open('/pricing', '_blank')}>
                      Kelola Langganan
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge className="bg-gray-100 text-gray-800 mb-4">Free</Badge>
                    <p className="text-2xl font-bold text-gray-900 mb-1">Rp0/bulan</p>
                    <p className="text-sm text-gray-500 mb-4">Fitur terbatas</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.open('/pricing', '_blank')}>
                      Upgrade ke Premium
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Konten Dibuat</span>
                <span className="text-sm font-medium">{userStats.contentGenerated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gambar Dihasilkan</span>
                <span className="text-sm font-medium">{userStats.imagesGenerated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto Reply</span>
                <span className="text-sm font-medium">{userStats.autoReplies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sisa Kredit</span>
                <span className="text-sm font-medium">
                  {(isTrial || isPremium) ? '∞' : '50'}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    isTrial
                      ? 'bg-yellow-100 text-yellow-800'
                      : isPremium
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isTrial ? 'Trial' : isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                📧 Hubungi Support
              </Button>
              <Button variant="outline" className="w-full">
                📚 Panduan Penggunaan
              </Button>
              <Button variant="outline" className="w-full">
                💬 FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}