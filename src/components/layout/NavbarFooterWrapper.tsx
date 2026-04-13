'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export function NavbarFooterWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Define paths where Header and Footer should be hidden
  const isHiddenPath = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/unauthorized');

  return (
    <>
      {!isHiddenPath && <Header />}
      <main className='flex-1'>{children}</main>
      {!isHiddenPath && <Footer />}
    </>
  )
}
