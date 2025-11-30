'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function KontenPage() {
  const [selectedType, setSelectedType] = useState('caption')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Konten</h1>
        <p className="text-gray-600">Buat konten marketing yang menarik dengan AI dalam hitungan detik</p>
      </div>

      {/* Content Type Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { type: 'caption', label: 'Caption Instagram', icon: '📝' },
          { type: 'blog', label: 'Blog Post', icon: '📄' },
          { type: 'email', label: 'Email Marketing', icon: '✉️' },
          { type: 'social', label: 'Social Media', icon: '💬' },
        ].map((item) => (
          <Card
            key={item.type}
            className={`cursor-pointer transition-all ${
              selectedType === item.type
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedType(item.type)}
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
            <CardTitle>Detail Konten</CardTitle>
            <CardDescription>
              Berikan informasi tentang produk/jasa yang ingin Anda promosikan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produk/Jasa
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Contoh: Gamis katun premium warna pastel untuk wanita muslimah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Wanita 20-35 tahun</option>
                <option>Pria 25-40 tahun</option>
                <option>Remaja 15-20 tahun</option>
                <option>Parents 30-45 tahun</option>
                <option>General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Professional</option>
                <option>Casual & Friendly</option>
                <option>Persuasive</option>
                <option>Educational</option>
                <option>Inspirational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Instagram', 'Facebook', 'Twitter', 'TikTok'].map((platform) => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="gamis, katun, modest fashion, muslimah"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800">
              🚀 Generate Konten
            </Button>
          </CardContent>
        </Card>

        {/* Output Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Hasil Generate</CardTitle>
            <CardDescription>
              Konten AI-generated akan muncul di sini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Sample Generated Content */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-blue-900">Caption Instagram</h3>
                  <Badge className="bg-blue-100 text-blue-800">New</Badge>
                </div>
                <div className="text-blue-800 space-y-2">
                  <p>✨ ELEGAN & NYAMAN HANYA DALAM SATU GAMIS! ✨</p>
                  <p>
                    Perkenalkan koleksi terbaru kami - Gamis Katun Premium dengan 5 warna pastel yang memikat:
                  </p>
                  <p>🌸 Baby Pink | 💙 Sky Blue | 💚 Mint Green | 💛 Butter | 🌼 Lavender</p>
                  <p>
                    Material 100% katun premium, adem, tidak mudah kusut, dan nyaman sehari-hari!
                  </p>
                  <p>#gamiskatun #gamispastel #fashionmuslim #ootdhijab #gamispremium</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">📋 Copy</Button>
                  <Button size="sm" variant="outline">❤️ Save</Button>
                  <Button size="sm" variant="outline">🔄 Regenerate</Button>
                </div>
              </div>

              {/* Template Suggestions */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Template Suggestions</h3>
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="text-sm font-medium">Behind the Scenes</div>
                    <div className="text-xs text-gray-500">Show production process</div>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="text-sm font-medium">Customer Testimonial</div>
                    <div className="text-xs text-gray-500">Share customer reviews</div>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="text-sm font-medium">Educational Content</div>
                    <div className="text-xs text-gray-500">Tips & tutorials</div>
                  </div>
                </div>
              </div>

              {/* Hashtags */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Trending Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {['#gamiskatun', '#ootdhijab', '#fashionmuslim', '#hijabstyle', '#muslimahfashion', '#gamissyari'].map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Generations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Konten Terbaru</CardTitle>
          <CardDescription>Histori konten yang Anda generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Caption #{i}</span>
                  <span className="text-xs text-gray-500">2 jam lalu</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor...
                </p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">Copy</Button>
                  <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}