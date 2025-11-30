'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GambarPage() {
  const [selectedStyle, setSelectedStyle] = useState('realistic')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Gambar</h1>
        <p className="text-gray-600">Buat gambar produk dan konten visual yang menarik dengan AI</p>
      </div>

      {/* Style Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { style: 'realistic', label: 'Realistic', icon: '📸' },
          { style: 'cartoon', label: 'Cartoon', icon: '🎨' },
          { style: 'minimalist', label: 'Minimalist', icon: '◻️' },
          { style: 'vintage', label: 'Vintage', icon: '📷' },
        ].map((item) => (
          <Card
            key={item.style}
            className={`cursor-pointer transition-all ${
              selectedStyle === item.style
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedStyle(item.style)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Gambar</CardTitle>
            <CardDescription>
              Deskripsikan gambar yang ingin Anda buat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Contoh: Coffee shop dengan interior minimalis, cahaya pagi yang hangat, tanaman hijau di sudut ruangan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Produk
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Fashion & Pakaian</option>
                <option>Kuliner & Makanan</option>
                <option>Elektronik</option>
                <option>Kecantikan</option>
                <option>Peralatan Rumah</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warna Tema
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Merah', 'Biru', 'Hijau', 'Kuning', 'Ungu', 'Pink', 'Hitam', 'Putih'].map((color) => (
                  <label key={color} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukuran
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Square (1:1) - Instagram Post</option>
                <option>Portrait (4:5) - Instagram Post</option>
                <option>Landscape (16:9) - Facebook/YouTube</option>
                <option>Story (9:16) - Instagram Story</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Gambar
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>1 gambar</option>
                <option>4 variasi</option>
                <option>8 variasi</option>
              </select>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800">
              🎨 Generate Gambar
            </Button>
          </CardContent>
        </Card>

        {/* Output Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Hasil Generate</CardTitle>
            <CardDescription>
              Gambar AI-generated akan muncul di sini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Sample Generated Images */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2].map((i) => (
                <div key={i} className="relative group">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">☕</div>
                      <p className="text-sm text-purple-700 font-medium">Premium AI Image #{i}</p>
                      <p className="text-xs text-purple-600">Coffee shop aesthetic</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                        ⬇️
                      </Button>
                      <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                        🔄
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" className="flex-1">
                📥 Download All
              </Button>
              <Button variant="outline" className="flex-1">
                🔄 Regenerate
              </Button>
              <Button variant="outline" className="flex-1">
                ❤️ Save
              </Button>
            </div>

            {/* Style Variations */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Style Variations</h3>
              <div className="grid grid-cols-3 gap-2">
                {['Bright', 'Dark', 'Warm', 'Cool', 'Vintage', 'Modern'].map((style) => (
                  <Button key={style} size="sm" variant="outline" className="text-xs">
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Generations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Gambar Terbaru</CardTitle>
          <CardDescription>Histori gambar yang Anda generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative group">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎨</div>
                    <p className="text-xs text-gray-600">Image #{i}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 p-2">
                      📥
                    </Button>
                    <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 p-2">
                      👁️
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips & Tricks */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tips & Tricks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Deskripsi Detail</h4>
              <p className="text-sm text-blue-700">
                Semakin detail deskripsi Anda, semakin baik hasil gambar yang dihasilkan.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🎨 Konsistensi Style</h4>
              <p className="text-sm text-purple-700">
                Gunakan style yang sama untuk produk serupa agar branding konsisten.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🔄 Generate Berulang</h4>
              <p className="text-sm text-green-700">
                Jangan ragu untuk regenerate beberapa kali dapatkan hasil terbaik.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}