import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryClientProviderWrapper } from '@/providers/query-client-provider';
import { NavbarFooterWrapper } from '@/components/layout/NavbarFooterWrapper';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Asisten UMKM - AI Assistant All-in-One untuk UMKM Indonesia',
  description:
    'Asisten UMKM adalah AI assistant 24/7 yang membantu Anda membuat konten, gambar, caption, copywriting, desain, ide bisnis, auto balas chat customer service, laporan, dan strategi marketing otomatis. Hemat waktu & biaya, tingkatkan omset 3x lipat!',
  keywords: [
    'asisten umkm',
    'ai assistant',
    'konten otomatis',
    'auto balas chat',
    'marketing automation',
    'umkm indonesia',
    'generate gambar',
    'copywriting',
    'sosial media',
  ],
  authors: [{ name: 'Asisten UMKM Team' }],
  creator: 'Asisten UMKM',
  publisher: 'Asisten UMKM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://asistenumkm.id',
    siteName: 'Asisten UMKM',
    title: 'Asisten UMKM - AI Assistant All-in-One untuk UMKM Indonesia',
    description:
      'AI assistant 24/7 untuk membantu UMKM Indonesia berkembang dengan teknologi artificial intelligence. Generate konten, gambar, caption, auto balas chat, dan strategi marketing otomatis.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Asisten UMKM - AI Assistant untuk UMKM Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asisten UMKM - AI Assistant All-in-One untuk UMKM Indonesia',
    description:
      'AI assistant 24/7 untuk membantu UMKM Indonesia berkembang. Generate konten, gambar, caption, auto balas chat, dan strategi marketing otomatis.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='id'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryClientProviderWrapper>
          <NavbarFooterWrapper>
            {children}
          </NavbarFooterWrapper>
          <Toaster position="top-center" richColors />
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
