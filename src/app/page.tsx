'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const [isYearly, setIsYearly] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🚀 AI Assistant All-in-One untuk UMKM Indonesia
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Asisten UMKM:
              <span className="block text-blue-200">Wujudkan Bisnis Impian Anda</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto">
              AI yang membantu Anda membuat konten, gambar, caption, copywriting, desain,
              ide bisnis, laporan, dan strategi marketing otomatis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl mb-2">📝</div>
                <div className="font-semibold">Konten Otomatis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-semibold">Generate Gambar</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl mb-2">📈</div>
                <div className="font-semibold">Marketing AI</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-blue-50 text-blue-600 text-lg px-8 py-4 rounded-xl font-bold">
                Coba Gratis Sekarang →
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white text-lg px-8 py-4 rounded-xl font-bold">
                Lihat Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Visual Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-xl"></div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tertinggal di Era Digital?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              UMKM seringkali kesulitan bersaing dengan brand besar karena keterbatasan resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-red-500">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">😰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Susah Bikin Konten</h3>
                <p className="text-gray-600">Ide konten habis, bingung mau posting apa setiap hari</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🤔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tidak Ada Ide Marketing</h3>
                <p className="text-gray-600">Strategi marketing monoton, penjualan stagnan</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Konten Kurang Menarik</h3>
                <p className="text-gray-600">Visual dan caption tidak profesional, engagement rendah</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Copywriting Biasa Saja</h3>
                <p className="text-gray-600">Kata-kata tidak menarik, tidak ada daya jual</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tidak Punya Tim Desain</h3>
                <p className="text-gray-600">Visual produk tidak menarik, brand terlihat murahan</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Laporan Rumit</h3>
                <p className="text-gray-600">Data bisnis berantakan, tidak tahu performa toko</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">SOLUSI KOMPLIT</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Asisten UMKM Solusinya
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Semua yang Anda butuhkan untuk sukses di dunia digital dalam satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Konten</h3>
                <p className="text-gray-600">Bikin caption, postingan blog, email marketing otomatis</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Konten</h3>
                <p className="text-gray-600">Bikin caption, postingan blog, email marketing otomatis</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Gambar</h3>
                <p className="text-gray-600">Desain produk, logo, postingan sosmed hanya dengan deskripsi</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">#️⃣</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Auto Caption</h3>
                <p className="text-gray-600">Caption menarik + hashtag trending untuk semua platform</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ide Bisnis</h3>
                <p className="text-gray-600">Dapatkan ide produk baru dan insight pasar yang profitable</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Strategi Marketing</h3>
                <p className="text-gray-600">Ide marketing harian yang sudah dipersonalisasi untuk bisnis Anda</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Riset Kompetitor</h3>
                <p className="text-gray-600">Analisis kompetitor, trend pasar, dan peluang bisnis</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Laporan Bisnis</h3>
                <p className="text-gray-600">Dashboard real-time sales, customer, dan performa bisnis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Manfaat Luar Biasa untuk UMKM Anda
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transformasi bisnis dari traditional menjadi digital powerhouse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-2xl font-bold mb-3">Hemat 90% Waktu</h3>
              <p className="text-blue-100">Tugas yang biasanya 5 jam sekarang cuma 30 menit dengan AI</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Hemat 80% Biaya</h3>
              <p className="text-blue-100">Tidak perlu bayar tim social media, desainer, copywriter</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3">Konten Setiap Hari</h3>
              <p className="text-blue-100">Tidak pernah kehabisan ide konten untuk 30 hari ke depan</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-3">Omset Naik 3x</h3>
              <p className="text-blue-100">Marketing yang efektif, closing rate meningkat drastis</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3">Brand Profesional</h3>
              <p className="text-blue-100">Visual dan konten berkualitas tinggi setiap saat</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-5xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold mb-3">Competitive Edge</h3>
              <p className="text-blue-100">Lebih advanced dari kompetitor yang masih manual</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Lihat Bagaimana Asisten UMKM Bekerja
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Demo nyata fitur-fitur andalan yang akan revolusion bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span>🎯</span> Generate Konten Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="font-semibold text-gray-900">Input:</p>
                    <p className="text-gray-700">Bikin content marketing untuk coffee shop</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="font-semibold text-blue-900">Hasil:</p>
                    <p className="text-blue-800">📅 Marketing Content Plan - Coffee Shop:</p>
                    <ul className="mt-2 space-y-1 text-blue-700">
                      <li>• Senin: "Monday Coffee Motivation" quotes</li>
                      <li>• Rabu: "Behind the Bar" barista spotlight</li>
                      <li>• Jumat: "Coffee Pairing Friday" with snacks</li>
                      <li>• Weekend: "Weekend Vibes" cozy ambiance</li>
                      <li>• Monthly: Customer testimonials & reviews</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span>✍️</span> Generate Caption Instagram
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="font-semibold text-gray-900">Input:</p>
                    <p className="text-gray-700">Jual gamis katun premium warna pastel</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="font-semibold text-blue-900">Hasil:</p>
                    <p className="text-blue-800">✨ ELEGAN & NYAMAN HANYA DALAM SATU GAMIS! ✨</p>
                    <p className="text-blue-700 mt-2">
                      Perkenalkan koleksi terbaru kami - Gamis Katun Premium dengan 5 warna pastel yang memikat:
                    </p>
                    <p className="text-blue-700 mt-2">🌸 Baby Pink | 💙 Sky Blue | 💚 Mint Green | 💛 Butter | 🌼 Lavender</p>
                    <p className="text-blue-700 mt-2">Material 100% katun premium, adem, tidak mudah kusut, dan nyaman sehari-hari!</p>
                    <p className="text-blue-600 mt-2">#gamiskatun #gamispastel #fashionmuslim #ootdhijab #gamispremium</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span>🎨</span> Generate Gambar Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="font-semibold text-gray-900">Prompt:</p>
                    <p className="text-gray-700">"Coffee shop aesthetic, minimalist interior, morning light"</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8 text-center">
                    <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">☕</div>
                        <p className="text-blue-700 font-semibold">Premium AI Generated Image</p>
                        <p className="text-blue-600 text-sm">Coffee shop aesthetic dalam 5 detik</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span>📈</span> Strategi Marketing Harian
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="font-semibold text-blue-900 mb-3">📅 Marketing Plan - Hari Ini:</p>
                    <div className="space-y-2 text-blue-800">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">▸</span>
                        <div>
                          <strong>09:00</strong> - Post product showcase dengan caption storytelling
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">▸</span>
                        <div>
                          <strong>12:00</strong> - Update engagement content
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">▸</span>
                        <div>
                          <strong>15:00</strong> - Instagram Stories: behind the scene
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">▸</span>
                        <div>
                          <strong>18:00</strong> - Facebook Live Q&A session
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">▸</span>
                        <div>
                          <strong>20:00</strong> - Analyze daily performance & plan tomorrow
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section id="testimoni" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Apa Kata Mereka
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ribuan UMKM sudah transformasi bisnisnya dengan Asisten UMKM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-8">
                <div className="absolute top-4 right-4 text-4xl">❤️</div>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500">⭐</span>)}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Dulu saya capek setiap hari harus mikir mau posting apa. Sekarang tinggal klik-klik,
                  konten ready sebulan penuh! Penjualan naik 300% dalam 2 bulan."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Siti Nurhaliza</p>
                    <p className="text-sm text-gray-600">Owner HijabStyle</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8">
                <div className="absolute top-4 right-4 text-4xl">🚀</div>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500">⭐</span>)}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Chat auto-reply nya mantap! Customer jadi puas karena cepat direspon.
                  Rating toko saya dari 4.2 jadi 4.8, orderan makin banyak."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Budi Santoso</p>
                    <p className="text-sm text-gray-600">Owner TokoKu Elektronik</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8">
                <div className="absolute top-4 right-4 text-4xl">💎</div>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500">⭐</span>)}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Hemat banget! Dulu harus bayar admin sosmed 2jt/bulan, sekarang dengan Asisten UMKM
                  cuma 300rb/bulan. Hasilnya jauh lebih bagus lagi!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Maya Putri</p>
                    <p className="text-sm text-gray-600">Owner Bakery Artisan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="harga" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">HARGA TERJANGKAU</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Satu Paket Lengkap untuk Semua Kebutuhan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan semua fitur premium Asisten UMKM dengan harga yang terjangkau
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="relative hover:shadow-2xl transition-shadow border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1">
                  PAKET LENGKAP ⭐
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Asisten UMKM Premium</h3>
                  <p className="text-gray-600 text-lg">Akses semua fitur tanpa batas</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                    <button
                      className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                        !isYearly
                          ? 'text-white bg-blue-600'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                      onClick={() => setIsYearly(false)}
                    >
                      Bulanan
                    </button>
                    <button
                      className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                        isYearly
                          ? 'text-white bg-blue-600'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                      onClick={() => setIsYearly(true)}
                    >
                      Tahunan <span className="text-green-600 font-bold">(Hemat 20%)</span>
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {isYearly ? 'Rp70.400' : 'Rp88.000'}
                    <span className="text-xl text-gray-600 font-normal">/bulan</span>
                  </div>
                  <p className="text-gray-600">
                    {isYearly
                      ? 'Rp844.800/tahun (dari Rp1.056.000)'
                      : 'Rp70.400/bulan jika bayar tahunan'
                    }
                  </p>
                  {isYearly && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Hemat Rp211.200/tahun
                    </Badge>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Unlimited konten generation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Unlimited gambar AI generation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Unlimited caption & hashtag templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Analytics dashboard lengkap</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Strategi marketing personal</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Ide bisnis & riset kompetitor</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Laporan bisnis real-time</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Support 24/7</span>
                  </li>
                </ul>

                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg py-4 font-semibold">
                    Coba Gratis 7 Hari
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      <strong>✨ Tidak perlu kartu kredit</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Cancel kapan saja • Full refund 30 hari
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white text-blue-600">LIMITED OFFER</Badge>
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">
            Ubah Bisnis Anda Hari Ini
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            Asisten UMKM siap membantu 24/7 untuk tingkatkan penjualan, hemat waktu,
            dan bawa bisnis Anda ke level selanjutnya.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button size="lg" className="bg-white hover:bg-blue-50 text-blue-600 text-xl px-12 py-6 rounded-2xl font-bold text-lg">
              Coba Gratis Sekarang →
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white text-xl px-12 py-6 rounded-2xl font-bold text-lg">
              Jadwalkan Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">🚀</span>
              <span className="font-semibold">Setup 5 Menit</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">💳</span>
              <span className="font-semibold">Tanpa Kartu Kredit</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">🏆</span>
              <span className="font-semibold">Garansi 30 Hari</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
      </section>
    </div>
  )
}