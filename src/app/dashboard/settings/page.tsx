'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@/contexts/UserContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { AI_PROVIDERS, AIProvider, AISettings } from '@/types/ai'

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

export default function SettingsPage() {
  const { user, isLoading: userLoading } = useUser()
  const { isTrial, isPremium, isFree, daysLeft, subscription } = useSubscription()
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    avatar: ''
  })

  // Business profile state
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    businessAddress: '',
    businessPhone: '',
    businessWebsite: ''
  })

  // Store profile state
  const [storeData, setStoreData] = useState({
    storeName: '',
    storeLogo: '',
    storeImage: '',
    storeAddress: '',
    storePhone: '',
    primaryColor: '#000000',
    secondaryColor: '#666666',
    thirdColor: '#999999'
  })

  // Loading states
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingBusiness, setUpdatingBusiness] = useState(false)
  const [updatingAISettings, setUpdatingAISettings] = useState(false)
  const [updatingStore, setUpdatingStore] = useState(false)

  // AI Settings state
  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: 'gemini',
    model: 'gemini-3-pro',
    temperature: 0.7,
    maxTokens: 1000,
    toneOfVoice: 'professional',
    targetAudience: 'general',
    platforms: ['instagram', 'facebook'],
    customInstructions: ''
  })

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      })
      setBusinessData({
        businessName: user.businessName || '',
        businessCategory: user.businessCategory || '',
        businessDescription: user.businessDescription || '',
        businessAddress: user.businessAddress || '',
        businessPhone: user.businessPhone || '',
        businessWebsite: user.businessWebsite || ''
      })
      setStoreData({
        storeName: user.storeName || '',
        storeLogo: user.storeLogo || '',
        storeImage: user.storeImage || '',
        storeAddress: user.storeAddress || '',
        storePhone: user.storePhone || '',
        primaryColor: user.primaryColor || '#000000',
        secondaryColor: user.secondaryColor || '#666666',
        thirdColor: user.thirdColor || '#999999'
      })

      // Load AI settings from user data
      if (user.aiProvider || user.aiModel) {
        setAiSettings({
          ...aiSettings,
          provider: (user.aiProvider as any) || 'gemini',
          model: user.aiModel || 'gemini-3-pro',
          temperature: user.aiTemperature || 0.7,
          maxTokens: user.aiMaxTokens || 1000
        })
      }
    }
  }, [user])

  const fetchActivityStats = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/activity/stats?userId=${user.id}&period=all`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching activity stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivityStats()
  }, [user])

  
  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!profileData.name.trim()) {
      alert('Nama harus diisi')
      return
    }

    setUpdatingProfile(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        // Refresh user context
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      alert('Terjadi kesalahan saat memperbarui profil')
    } finally {
      setUpdatingProfile(false)
    }
  }

  // Handle business profile update
  const handleUpdateBusiness = async () => {
    if (businessData.businessName && !businessData.businessName.trim()) {
      alert('Nama bisnis tidak valid')
      return
    }

    setUpdatingBusiness(true)
    try {
      const response = await fetch('/api/user/business', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        // Refresh user context
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Gagal memperbarui profil bisnis')
      }
    } catch (error) {
      console.error('Update business profile error:', error)
      alert('Terjadi kesalahan saat memperbarui profil bisnis')
    } finally {
      setUpdatingBusiness(false)
    }
  }

  // Handle AI settings update
  const handleUpdateAISettings = async () => {
    setUpdatingAISettings(true)
    try {
      const response = await fetch('/api/user/ai-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aiProvider: aiSettings.provider,
          aiModel: aiSettings.model,
          aiApiKey: aiSettings.apiKey,
          aiTemperature: aiSettings.temperature,
          aiMaxTokens: aiSettings.maxTokens
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Pengaturan AI berhasil disimpan')
        // Refresh user data to get updated AI settings
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Gagal menyimpan pengaturan AI')
      }
    } catch (error) {
      console.error('Update AI settings error:', error)
      alert('Terjadi kesalahan saat menyimpan pengaturan AI')
    } finally {
      setUpdatingAISettings(false)
    }
  }

  // Handle store profile update
  const handleUpdateStore = async () => {
    if (storeData.storeName && !storeData.storeName.trim()) {
      alert('Nama toko tidak valid')
      return
    }

    setUpdatingStore(true)
    try {
      const response = await fetch('/api/user/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Profil toko berhasil diperbarui')
        // Refresh user context
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Gagal memperbarui profil toko')
      }
    } catch (error) {
      console.error('Update store profile error:', error)
      alert('Terjadi kesalahan saat memperbarui profil toko')
    } finally {
      setUpdatingStore(false)
    }
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600">Kelola akun dan preferensi Asisten UMKM Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-300 shadow-md">
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
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        {user?.email || 'Belum diisi'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan nomor telepon"
                    />
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
              <Button
                onClick={handleUpdateProfile}
                disabled={updatingProfile}
                className="w-full"
              >
                {updatingProfile ? 'Menyimpan...' : 'Update Profil'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-300 shadow-md">
            <CardHeader>
              <CardTitle>Pengaturan AI</CardTitle>
              <CardDescription>Konfigurasikan provider dan model AI untuk konten yang dihasilkan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider AI</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                    <div
                      key={key}
                      className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                        provider.isComingSoon
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
                          : aiSettings.provider === key
                          ? `border-${provider.color}-500 bg-${provider.color}-50`
                          : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!provider.isComingSoon) {
                          const firstModel = provider.models.find(m => m.isAvailable)
                          if (firstModel) {
                            setAiSettings({
                              ...aiSettings,
                              provider: key as AIProvider,
                              model: firstModel.id
                            })
                          }
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                              {provider.isComingSoon && (
                                <Badge className="bg-yellow-500 text-white text-xs">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{provider.description}</p>
                          </div>
                        </div>
                        {aiSettings.provider === key && !provider.isComingSoon && (
                          <Badge className="bg-green-500 text-white">
                            ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model AI</label>
                <select
                  value={aiSettings.model}
                  onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!AI_PROVIDERS[aiSettings.provider]}
                >
                  {AI_PROVIDERS[aiSettings.provider].models
                    .filter(model => model.isAvailable)
                    .map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Model yang dipilih: {AI_PROVIDERS[aiSettings.provider].models.find(m => m.id === aiSettings.model)?.description}
                </p>
              </div>

              {/* Model Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                  <select
                    value={aiSettings.temperature}
                    onChange={(e) => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0.1}>Konservatif (0.1)</option>
                    <option value={0.3}>Balanced (0.3)</option>
                    <option value={0.7}>Kreatif (0.7)</option>
                    <option value={1.0}>Kontemporer (1.0)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                  <input
                    type="number"
                    min="128"
                    max="350000"
                    step="1000"
                    value={aiSettings.maxTokens || 1000}
                    onChange={(e) => setAiSettings({ ...aiSettings, maxTokens: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jumlah maksimum kata yang dapat dihasilkan AI (128-350000 tokens)
                  </p>
                </div>
              </div>

              <Button
                onClick={handleUpdateAISettings}
                disabled={updatingAISettings}
                className="w-full"
              >
                {updatingAISettings ? 'Menyimpan...' : 'Simpan Pengaturan AI'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-300 shadow-md">
            <CardHeader>
              <CardTitle>Profil Bisnis</CardTitle>
              <CardDescription>Informasi lengkap tentang bisnis Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Bisnis</label>
                <input
                  type="text"
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama bisnis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Bisnis</label>
                <input
                  type="text"
                  value={businessData.businessCategory}
                  onChange={(e) => setBusinessData({ ...businessData, businessCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kategori bisnis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Bisnis</label>
                <Textarea
                  value={businessData.businessDescription}
                  onChange={(e) => setBusinessData({ ...businessData, businessDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Masukkan deskripsi bisnis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Bisnis</label>
                <Textarea
                  value={businessData.businessAddress}
                  onChange={(e) => setBusinessData({ ...businessData, businessAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat bisnis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Bisnis</label>
                <input
                  type="tel"
                  value={businessData.businessPhone}
                  onChange={(e) => setBusinessData({ ...businessData, businessPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon bisnis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={businessData.businessWebsite}
                  onChange={(e) => setBusinessData({ ...businessData, businessWebsite: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan website bisnis"
                />
              </div>
              <Button
                onClick={handleUpdateBusiness}
                disabled={updatingBusiness}
                className="w-full"
              >
                {updatingBusiness ? 'Menyimpan...' : 'Update Profil Bisnis'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-300 shadow-md">
            <CardHeader>
              <CardTitle>Profil Toko</CardTitle>
              <CardDescription>Kelola informasi dan tampilan toko online Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Toko</label>
                <input
                  type="text"
                  value={storeData.storeName}
                  onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama toko"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Toko</label>
                  <input
                    type="url"
                    value={storeData.storeLogo}
                    onChange={(e) => setStoreData({ ...storeData, storeLogo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Toko</label>
                  <input
                    type="url"
                    value={storeData.storeImage}
                    onChange={(e) => setStoreData({ ...storeData, storeImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/store.jpg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Toko</label>
                <Textarea
                  value={storeData.storeAddress}
                  onChange={(e) => setStoreData({ ...storeData, storeAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap toko"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Toko</label>
                <input
                  type="tel"
                  value={storeData.storePhone}
                  onChange={(e) => setStoreData({ ...storeData, storePhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon toko"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema Warna Toko</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Warna Utama</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={storeData.primaryColor}
                        onChange={(e) => setStoreData({ ...storeData, primaryColor: e.target.value })}
                        className="h-10 w-20 border border-gray-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={storeData.primaryColor}
                        onChange={(e) => setStoreData({ ...storeData, primaryColor: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Warna Sekunder</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={storeData.secondaryColor}
                        onChange={(e) => setStoreData({ ...storeData, secondaryColor: e.target.value })}
                        className="h-10 w-20 border border-gray-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={storeData.secondaryColor}
                        onChange={(e) => setStoreData({ ...storeData, secondaryColor: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                        placeholder="#666666"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Warna Ketiga</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={storeData.thirdColor}
                        onChange={(e) => setStoreData({ ...storeData, thirdColor: e.target.value })}
                        className="h-10 w-20 border border-gray-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={storeData.thirdColor}
                        onChange={(e) => setStoreData({ ...storeData, thirdColor: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                        placeholder="#999999"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleUpdateStore}
                disabled={updatingStore}
                className="w-full"
              >
                {updatingStore ? 'Menyimpan...' : 'Update Profil Toko'}
              </Button>
            </CardContent>
          </Card>

          </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-gray-300 shadow-md">
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

          <Card className="border-gray-300 shadow-md">
            <CardHeader>
              <CardTitle>Statistik Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : stats ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Konten</span>
                    <span className="text-sm font-medium">{stats.totalContentGenerations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Gambar</span>
                    <span className="text-sm font-medium">{stats.totalImageGenerations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hari Ini</span>
                    <span className="text-sm font-medium">
                      📝 {stats.todayContentGenerations} • 🎨 {stats.todayImageGenerations}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Minggu Ini</span>
                    <span className="text-sm font-medium">
                      📝 {stats.weeklyContentGenerations} • 🎨 {stats.weeklyImageGenerations}
                    </span>
                  </div>
                  {stats.mostUsedContentType && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Konten Populer</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {stats.mostUsedContentType}
                      </Badge>
                    </div>
                  )}
                  {stats.mostUsedImageMode && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mode Gambar</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {stats.mostUsedImageMode}
                      </Badge>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>Belum ada data statistik</p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status Akun</span>
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

          <Card className="border-gray-300 shadow-md">
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