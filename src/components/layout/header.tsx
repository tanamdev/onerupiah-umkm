import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">🚀</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Asisten UMKM</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="#fitur"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Fitur
            </Link>
            <Link
              href="#demo"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Demo
            </Link>
            <Link
              href="#harga"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Harga
            </Link>
            <Link
              href="#testimoni"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Testimoni
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}