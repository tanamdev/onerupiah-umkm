import { prisma } from '@/lib/prisma'
import {
  Sparkles,
  Bot,
  FileEdit,
  Megaphone,
  LineChart,
  ArrowRight,
  BarChart,
  PlayCircle,
  Send,
  CheckCircle,
  Star
} from 'lucide-react'

export default async function Home() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  })

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-surface inter text-on-surface selection:bg-secondary-fixed pb-12 md:pb-20">
      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20"></div>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center gap-10 md:gap-12">
          <div className="flex-1 text-center lg:text-left z-10">
            <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 inline-block">Masa Depan UMKM Indonesia</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl plus-jakarta-sans font-extrabold text-primary leading-tight mb-4 md:mb-6 tracking-tight">
              Asisten UMKM: Wujudkan <span className="text-secondary">Bisnis Impian</span> Anda
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tingkatkan skala bisnis Anda dengan kecerdasan buatan. Buat konten, kelola marketing, dan optimalkan operasional hanya dalam hitungan detik.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="bg-gradient-primary text-on-primary px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-xl shadow-primary/10 transition-transform active:scale-95 w-full sm:w-auto">
                Coba Gratis Sekarang
              </button>
              <button className="bg-surface-container-highest text-primary px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg transition-transform active:scale-95 w-full sm:w-auto">
                Lihat Demo
              </button>
            </div>
          </div>
          <div className="flex-1 relative w-full group mt-6 lg:mt-0">
            <div className="absolute -top-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-secondary-fixed/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 md:w-64 md:h-64 bg-tertiary-fixed/30 rounded-full blur-3xl"></div>
            {/* Floating Dashboard Mockup */}
            <div className="glass-card p-3 md:p-4 rounded-2xl shadow-2xl border border-white/50 relative overflow-hidden transition-transform duration-500 hover:rotate-1">
              <div className="flex items-center gap-2 mb-3 md:mb-4 border-b border-outline-variant/15 pb-3 md:pb-4">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-error"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-secondary-fixed"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-secondary"></div>
                <div className="ml-2 md:ml-4 h-3 md:h-4 w-24 md:w-32 bg-surface-container-high rounded-full"></div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex gap-3 md:gap-4">
                  <div className="w-1/3 aspect-square bg-secondary-container/10 rounded-xl flex items-center justify-center text-secondary">
                    <Sparkles className="w-8 h-8 md:w-9 md:h-9" />
                  </div>
                  <div className="flex-1 space-y-1.5 md:space-y-2">
                    <div className="h-3 md:h-4 bg-surface-container-high rounded-full w-full"></div>
                    <div className="h-3 md:h-4 bg-surface-container-high rounded-full w-5/6"></div>
                    <div className="h-3 md:h-4 bg-surface-container-high rounded-full w-4/6"></div>
                  </div>
                </div>
                <div className="bg-primary-container p-3 md:p-4 rounded-xl">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-secondary-fixed-dim" />
                    <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">AI Generating...</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-secondary rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
                <img className="rounded-xl w-full h-32 md:h-48 object-cover shadow-inner" alt="close-up of digital interface with glowing blue particles and data visualizations in a dark premium office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN8EdBKjgLUQ8ehm4osjpeSW6Z5ifCJtuPkZmPEcx1UzkJiahzynwrLtXEY22aH4tLAxCzjP4qbEMavs3Gkv0E8u3LLrfUsIV_17vAAB0vzSRpRFswCJDelt1xLNrASetn0jzNng-dG-z6q-qLPjR-H0zlBmHMwPz8RZMTYBVxEWJ1FyhgO4TYsBhCnVxUszbj1w42k5AUfSE1-XKtcHSQ2Pq1KCjADsj7iGzRBMLwzAUqMIX9O3JSbDkbFA7p81YaFOA_KDPNnEc" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section id="solusi" className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto shrink-0">
            <h2 className="text-3xl md:text-4xl plus-jakarta-sans font-extrabold text-primary mb-3 md:mb-4 tracking-tight">Solusi untuk Kendala Anda</h2>
            <p className="text-on-surface-variant text-base md:text-lg">Hapus hambatan yang menghalangi pertumbuhan bisnis Anda dengan bantuan asisten digital pintar.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 group shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-5 md:mb-6 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                <FileEdit className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 plus-jakarta-sans">Sulit Bikin Konten</h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">Jangan biarkan kebuntuan kreatif menghambat media sosial Anda. AI kami membuat tulisan dan visual memukau dalam sekejap.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 group shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-5 md:mb-6 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                <Megaphone className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 plus-jakarta-sans">Marketing Manual</h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">Habis waktu untuk posting satu per satu? Automasi kampanye marketing Anda ke berbagai channel secara terintegrasi.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 group shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-5 md:mb-6 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                <LineChart className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 plus-jakarta-sans">Data Tercecer</h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">Kelola semua performa bisnis dalam satu dashboard elegan. Pahami apa yang laku dan apa yang perlu ditingkatkan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl plus-jakarta-sans font-extrabold text-primary mb-3 md:mb-4 tracking-tight">Fitur Cerdas untuk Anda</h2>
              <p className="text-on-surface-variant text-base md:text-lg">Teknologi mutakhir yang dirancang khusus untuk kemudahan operasional UMKM.</p>
            </div>
            <div className="pb-2 hidden md:block">
              <a className="text-secondary font-bold flex items-center gap-2 group" href="#">
                Lihat Semua Fitur
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-8 bg-surface-container-low rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-10 overflow-hidden relative group">
              <div className="flex-1">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-3 md:mb-4 block">Visual Magic</span>
                <h3 className="text-2xl md:text-3xl plus-jakarta-sans font-extrabold mb-3 md:mb-4">AI Image Generation</h3>
                <p className="text-on-surface-variant text-sm md:text-base mb-6 md:mb-8 leading-relaxed">Tulis ide Anda, biarkan AI kami menciptakan foto produk atau ilustrasi promosi berkualitas studio secara instan.</p>
                <button className="bg-white text-primary px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold shadow-sm transition-all hover:shadow-lg text-sm md:text-base">Mulai Desain</button>
              </div>
              <div className="flex-1 relative w-full">
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <img className="rounded-xl aspect-square object-cover shadow-lg transition-transform group-hover:scale-105" alt="minimalist aesthetic product photography of a premium watch on a light grey textured surface with soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg8DhcDICljHdFIehBcAqLhjXlbpBfCTwtFWkZPfEJfOZzW3PWZl4ErSE2M1catnTnaEPjYd_3ixdgI_qH-MYAS6ZEw3Y2V0_vbStHFDn9vBwrGkAJlEr2JiO9mUcoViNIsEDWPFxwVvyXIoAALJlAJRJJWoz13Apnak5fntT9DudeeR8hJArqMCToUoGCnXiMNid5Oqn-b1yy7tMZxh_DVegEOk-ocUxzOM1HGC6T5lo7cw_Dzf1wdYKOwtbavwun0A7zFcVVepw" />
                  <img className="rounded-xl aspect-square object-cover translate-y-3 md:translate-y-4 shadow-lg transition-transform group-hover:scale-105" alt="sleek modern headphones on a wooden table with warm ambient backlighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4PAC0dzOhWKpIcSJqW9ANRyGkSkz9wUKWNg-AvlYo127QxrYd9eVvNj4oexucXs6XXOJe1fXuqJmDRTeyyc20xj3zNUvlWXc8F2lBGjl6X_d9Gr1O9NnDZ_SD0TrIZYRuukFWd3g-nPF49riFjmmCNji8-TuAQPeiEzQ5qZoMrkaTvbTNrsD0d5sw3ElJDPa7ZFCBhDr7_c7aMCK8k_CMwgWy3hl4AAhKxoh5OLRuvDlMM1LpmREBbxqYj3t6FYucBZc5fkA728I" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-primary text-white rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 md:mb-6">
                  <BarChart className="w-5 h-5 md:w-6 md:h-6 text-secondary-fixed" />
                </div>
                <h3 className="text-xl md:text-2xl plus-jakarta-sans font-bold mb-3 md:mb-4">Automated Marketing</h3>
                <p className="text-on-primary-container text-sm md:text-base leading-relaxed">Jadwalkan kampanye iklan dan email marketing secara otomatis berdasarkan perilaku konsumen.</p>
              </div>
              <div className="mt-6 md:mt-8 flex justify-center">
                <div className="bg-white/5 p-3 md:p-4 rounded-xl w-full border border-white/10">
                  <div className="flex items-end gap-1.5 md:gap-2 h-16 md:h-20">
                    <div className="flex-1 bg-secondary rounded-t-sm h-1/2"></div>
                    <div className="flex-1 bg-secondary rounded-t-sm h-3/4"></div>
                    <div className="flex-1 bg-white rounded-t-sm h-full"></div>
                    <div className="flex-1 bg-secondary rounded-t-sm h-2/3"></div>
                    <div className="flex-1 bg-secondary rounded-t-sm h-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-secondary-container text-on-secondary-container rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5 md:mb-6">
                  <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl plus-jakarta-sans font-bold mb-3 md:mb-4">Auto-Captions</h3>
                <p className="opacity-80 text-sm md:text-base leading-relaxed">Buat teks menarik untuk video Reels atau TikTok Anda dalam hitungan detik tanpa pusing mencari hashtag.</p>
              </div>
              <div className="mt-6 md:mt-8">
                <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-white/20"></div>
                  <div className="h-1.5 md:h-2 bg-white/30 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-surface-container-low rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
                <div className="flex-1 order-2 md:order-1 w-full relative z-10">
                  <div className="bg-surface-container-lowest p-5 md:p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 md:h-2 w-16 md:w-20 bg-slate-200 rounded-full"></div>
                        <div className="h-1.5 md:h-2 w-10 md:w-12 bg-slate-100 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm italic text-on-surface-variant border-l-4 border-secondary pl-3 md:pl-4">"Penjualan saya naik 300% sejak pakai Asisten UMKM untuk kelola chat customer!"</p>
                  </div>
                </div>
                <div className="flex-1 order-1 md:order-2">
                  <h3 className="text-2xl md:text-3xl plus-jakarta-sans font-extrabold mb-3 md:mb-4">Smart CRM integration</h3>
                  <p className="text-on-surface-variant text-sm md:text-base leading-relaxed md:mb-6">Satukan semua percakapan dari WhatsApp, DM, dan e-commerce dalam satu pintu dengan asisten balasan otomatis.</p>
                </div>
              </div>
            </div>
            {/* Mobile-only Lihat Semua Fitur button */}
            <div className="md:hidden flex justify-center mt-4">
              <button className="text-secondary font-bold flex items-center gap-2 group border border-secondary px-6 py-2.5 rounded-xl">
                Semua Fitur KAMI
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Demo */}
      <section id="demo" className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl plus-jakarta-sans font-extrabold mb-3 md:mb-4 tracking-tight">Lihat AI Beraksi</h2>
            <p className="text-on-primary-container text-base md:text-lg">Hanya butuh satu prompt sederhana untuk mendapatkan hasil profesional.</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
            <div className="flex-1 w-full">
              <div className="bg-primary-container p-6 md:p-8 rounded-3xl border border-white/5">
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary-fixed-dim mb-3 md:mb-4">Tulis Perintah Anda</label>
                <div className="relative">
                  <textarea className="w-full bg-primary/30 border-outline-variant/15 rounded-2xl p-4 md:p-6 text-base md:text-lg focus:ring-secondary focus:border-secondary transition-all resize-none min-h-[150px] md:min-h-[200px]" placeholder="Buat caption Instagram untuk sepatu kulit handmade baru kami yang bergaya klasik..." defaultValue="Buat caption Instagram untuk sepatu kulit handmade baru kami yang bergaya klasik..."></textarea>
                  <button className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-secondary text-white p-2.5 md:p-3 rounded-xl shadow-lg transition-transform active:scale-90">
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] md:text-xs text-white/60">#FashionSustain</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] md:text-xs text-white/60">#LocalBrandIndo</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] md:text-xs text-white/60">#HandmadeQuality</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-surface-container-lowest text-on-surface p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 md:p-4 bg-secondary-container text-on-secondary-container rounded-bl-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest">Post Preview</div>
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <img className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" alt="professional portrait of a young entrepreneur in a modern studio environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtlrz6XyVGZ7GAGJUf3xILFPt4wWHTH-nrEO_2zEIaTIffC4N0xIzu6iOXvkkOMetupSg_2coDpitmwpeCqxSKa7cvavyC54-BT9TabuHEAPhkyWWuyIiHPiz_kQyZNhRedJ493tsxNBIfSb9xkdSTqvmLotKfDqqHV693dpBeivbNy2rpi5R43OiIqiBQ2-8fIyA8phZgXkcP6EKPwzttfXT9Lw4lGiVgoeRwVyg4u-29f2E441pIS-_wfEcvUPpht4rzA22zrNA" />
                  <div>
                    <p className="font-bold text-sm">Langkah Lokal</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant">Sponsored</p>
                  </div>
                </div>
                <div className="space-y-4 mb-5 md:mb-6">
                  <div className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden w-full max-w-xs mx-auto md:max-w-full">
                    <img className="w-full h-full object-cover" alt="close-up of premium brown leather classic shoes on a dark rustic wooden background with atmospheric lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC45gY2J75_W5ctZ2VpEnEXUsZXQxXB7im2tqOKHmfwdgToV781dDA-WDp1OXSN_HcClu0PC6-wtfoc2Nna9_yThb4T3kZ0btyywnf06shIeYDNXAGlKvUh6RYfi1BnVcuGookeYcX6I93SAggvn-k-UTNNRF20dBNqJ_jnkRF9Ub9RPb9WaWjyo2brAdZvPd09gFIX-yA4VBWZI2pcp2ssjRmxMCaLwB0X3JT-rosAMldJRjqZRftDhkORawQ1eyHIgXyExDDsPwY" />
                  </div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <p className="text-xs md:text-sm font-bold">Langkah Lokal <span className="font-normal">Menghargai tradisi, melangkah ke masa depan. ✨</span></p>
                  <p className="text-xs md:text-sm">Sepatu kulit handmade terbaru kami telah hadir. Dibuat dengan cinta oleh pengrajin lokal untuk Anda yang menghargai kualitas klasik yang tak lekang oleh waktu.</p>
                  <p className="text-xs md:text-sm text-secondary font-medium">#ClassicVibe #LangkahLokal #LeatherGoods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="harga" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl plus-jakarta-sans font-extrabold text-primary mb-3 md:mb-4 tracking-tight">Pilih Paket Anda</h2>
          </div>
          <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-6 md:gap-8 items-stretch">
            {packages.map((pkg) => {
              const features = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features as string[])
              const isPopular = pkg.price > 0 // Simple logic: paid packages are highlighted

              if (isPopular) {
                return (
                  <div key={pkg.id} className="bg-primary text-white p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative transition-transform hover:scale-[1.03] z-10 w-full lg:w-[350px] flex flex-col">
                    <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-5 py-1 md:px-6 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">Populer</div>
                    <h3 className="text-xl md:text-2xl font-bold mb-1.5 md:mb-2">{pkg.name}</h3>
                    <p className="text-on-primary-container text-xs md:text-sm mb-5 md:mb-6 flex-1">{pkg.description}</p>
                    <div className="flex items-baseline gap-1 mb-6 md:mb-8">
                      <span className="text-4xl md:text-5xl font-extrabold text-white">{formatPrice(pkg.price)}</span>
                      {pkg.price > 0 && <span className="opacity-60 text-xs md:text-sm">/bln</span>}
                    </div>
                    <ul className="space-y-4 md:space-y-5 mb-8 md:mb-10 text-left">
                      {Array.isArray(features) && features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-3 text-xs md:text-sm">
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-secondary-fixed shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 md:py-5 mt-auto rounded-xl md:rounded-2xl bg-secondary text-white font-extrabold text-base md:text-lg shadow-xl shadow-secondary/20 transition-transform active:scale-95">
                      Mulai Sekarang
                    </button>
                  </div>
                )
              }

              return (
                <div key={pkg.id} className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-outline-variant/15 transition-transform hover:scale-[1.01] lg:hover:scale-[1.02] w-full lg:w-[350px] flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">{pkg.name}</h3>
                  <p className="text-on-surface-variant text-xs md:text-sm mb-5 md:mb-6 flex-1">{pkg.description}</p>
                  <div className="flex items-baseline gap-1 mb-5 md:mb-6">
                    <span className="text-3xl md:text-4xl font-extrabold text-primary">{formatPrice(pkg.price)}</span>
                    {pkg.price > 0 && <span className="text-on-surface-variant text-xs md:text-sm">/bln</span>}
                  </div>
                  <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 text-left">
                    {Array.isArray(features) && features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-xs md:text-sm">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-secondary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 md:py-4 mt-auto rounded-xl border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-white transition-colors text-sm md:text-base">
                    Pilih Paket
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimoni" className="py-16 md:py-24 bg-surface-container-low mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl plus-jakarta-sans font-extrabold text-primary mb-3 md:mb-4 tracking-tight">Dipercaya oleh UMKM Indonesia</h2>
            <p className="text-on-surface-variant text-base md:text-lg">Bergabunglah dengan 10,000+ pemilik bisnis yang telah bertransformasi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-white">
              <div className="flex gap-1 text-secondary mb-5 md:mb-6">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
              </div>
              <p className="text-on-surface text-sm md:text-base italic mb-6 md:mb-8 leading-relaxed">"Awalnya bingung mau posting apa tiap hari. Sekarang, AI Asisten UMKM yang mikirin semuanya. Jualan makin laris!"</p>
              <div className="flex items-center gap-4">
                <img className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" alt="professional business portrait of a smiling woman with glasses in a bright workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCupHNmiMBb0lwsqbsvKz3RD2a1k_wRXpfXoR9mQmwaNRAv230ILQkd4smNi99cTGE6temJVwAKzlOsSrd7KaxrMaM5EPgCH65pNyf5h75ah4OOg5yEbfGVTdIhNckjhxzGb-AFJUoRb2fYFFxSPfavAWBUSszm5xE7oWKP4Wrlnx6XFmUCzSkvmJFhnzBVC6NiqsUbNWTZYIS0e-2-AU5F4ZSoRy-CzVDK40JZdSXI-QLlmqJLB-Pt8hF3vHOsXjO2JQCTWBCO3RI" />
                <div>
                  <p className="font-bold text-sm md:text-base">Santi Wijaya</p>
                  <p className="text-[10px] md:text-xs text-on-surface-variant">Owner Batik Solo Modern</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-white">
              <div className="flex gap-1 text-secondary mb-5 md:mb-6">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
              </div>
              <p className="text-on-surface text-sm md:text-base italic mb-6 md:mb-8 leading-relaxed">"Fitur automasi ads-nya gila banget. ROI bisnis kopi saya naik 40% dalam sebulan pertama penggunaan."</p>
              <div className="flex items-center gap-4">
                <img className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" alt="headshot of a confident smiling man with a beard and casual clothing" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbRxQDjIRDnyYiea_W2inGF-nXgaDZJ2oRXi3svk_2ET11BZPRIrhVzrVenJ87lOoREjWPuyyJI_NI9QbAaljQBFOK6hiJYN3JCEJEyapoiRM27xp-2zZNcvUqknZ9yxFMVwTX7AVvPVAlE8uyW8wmT66oTvdJ2VAnz3RGn8fZ6zdahQqKsL0fIPj9yS89ByQuyQt6EWeQR-aSskikeBAisCevPxN0aURTs_-raX2TqQwd4Qvxp1KUHwzl4lakaY_l1t56JJ0gIS8" />
                <div>
                  <p className="font-bold text-sm md:text-base">Budi Pratama</p>
                  <p className="text-[10px] md:text-xs text-on-surface-variant">Kopi Anak Bangsa</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl shadow-sm border border-white">
              <div className="flex gap-1 text-secondary mb-5 md:mb-6">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-secondary" />
              </div>
              <p className="text-on-surface text-sm md:text-base italic mb-6 md:mb-8 leading-relaxed">"Gak perlu bayar desainer mahal lagi. AI Image-nya bantu bikin foto produk jadi estetik banget buat katalog."</p>
              <div className="flex items-center gap-4">
                <img className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" alt="portrait of a cheerful woman with a colorful headscarf in a sunlit outdoor market environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM4WPY7kIcVVbm7zIieS-DZFZk_4k-M75R5tgere_pargzQAgjieEv3ygvJE1U4uYCnPWNTPsDutwih24mzoyMomICiUvek2Ja6bo1Frl48uczbov7IRJY9vtpZLIqdC5oIiKPwZK2FWFMlvEu9wB7GCFiFPHQPnsyRL701ymcvrNFNwJEz9T9K9Af-exjMMcW2OgZHneHDgAZkFn2Xd3IYDdKFVthR7AG684RuMspq2ws3DGl_kntvFWX_MVkil26WaaDkhEmE3k" />
                <div>
                  <p className="font-bold text-sm md:text-base">Linda Sari</p>
                  <p className="text-[10px] md:text-xs text-on-surface-variant">Hijabers Choice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}