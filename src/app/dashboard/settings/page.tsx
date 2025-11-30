'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    John Doe
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    john.doe@example.com
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Bisnis</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  Toko Sample
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Bisnis</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  Fashion & Aksesoris
                </div>
              </div>
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
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Persuasive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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

          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Atur preferensi notifikasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Marketing</p>
                  <p className="text-sm text-gray-500">Tips dan strategi marketing terbaru</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Updates Produk</p>
                  <p className="text-sm text-gray-500">Fitur baru dan peningkatan layanan</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Report Mingguan</p>
                  <p className="text-sm text-gray-500">Ringkasan performa bisnis Anda</p>
                </div>
                <input type="checkbox" className="rounded" />
              </label>
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
                <Badge className="bg-blue-100 text-blue-800 mb-4">Premium</Badge>
                <p className="text-2xl font-bold text-gray-900 mb-1">Rp88.000/bulan</p>
                <p className="text-sm text-gray-500 mb-4">Berlaku hingga 31 Des 2024</p>
                <Button className="w-full">Upgrade Langganan</Button>
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
                <span className="text-sm font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gambar Dihasilkan</span>
                <span className="text-sm font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto Reply</span>
                <span className="text-sm font-medium">342</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sisa Kredit</span>
                <span className="text-sm font-medium">∞</span>
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