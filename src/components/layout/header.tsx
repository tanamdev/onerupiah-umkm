'use client'

import Link from 'next/link'
import { Rocket, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Fitur', href: '#fitur' },
    { name: 'Solusi', href: '#solusi' },
    { name: 'Harga', href: '#harga' },
    { name: 'Testimoni', href: '#testimoni' },
  ]

  return (
    <header 
      className="fixed top-0 w-full z-[100] bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm py-4"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-primary plus-jakarta-sans">
          <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-lg shadow-sm">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="plus-jakarta-sans">
            Asisten UMKM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-on-surface-variant/80 font-medium plus-jakarta-sans text-sm hover:text-secondary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6">
            <Link 
              href="/auth/login" 
              className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-gradient-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm shadow-xl shadow-primary/10 transition-transform active:scale-95"
            >
              Coba Gratis
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-primary hover:bg-surface-container-high rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/10 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="block text-on-surface-variant font-bold plus-jakarta-sans text-lg hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-outline-variant/10">
            <Link 
              href="/auth/login" 
              className="w-full text-center py-3 text-primary font-bold rounded-xl border border-outline-variant/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link 
              href="/auth/register" 
              className="w-full text-center py-3 bg-gradient-primary text-on-primary font-bold rounded-xl shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}