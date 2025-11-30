export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">🚀</span>
              </div>
              <span className="text-xl font-bold">Asisten UMKM</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              AI Assistant all-in-one untuk UMKM Indonesia. Transformasi bisnis Anda dengan teknologi artificial intelligence yang membantu meningkatkan penjualan, hemat waktu, dan otomatisasi marketing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">f</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">📷</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">in</div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produk</h3>
            <ul className="space-y-2">
              <li><a href="#fitur" className="text-gray-300 hover:text-white transition-colors">Fitur Lengkap</a></li>
              <li><a href="#harga" className="text-gray-300 hover:text-white transition-colors">Harga</a></li>
              <li><a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Case Study</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Panduan</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kontak Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; 2024 Asisten UMKM. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}