'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/layout/auth-layout';
import { toast } from 'sonner';

const layoutCopy = {
  title: 'Masuk ke Akun Anda',
  description:
    'Masuk ke akun Asisten UMKM Anda untuk mulai menggunakan fitur AI Assistant',
};

function LoginContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Get redirect parameter from URL
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const oauthError = searchParams.get('error');

  // Debug: Log redirect parameter
  useEffect(() => {
    console.log('🔍 Login page redirect info:', {
      redirectTo,
      searchParams: Object.fromEntries(searchParams.entries()),
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
    });
  }, [redirectTo, searchParams]);

  useEffect(() => {
    if (!oauthError) {
      return;
    }

    const message =
      oauthError === 'OAuthSignin'
        ? 'Google login gagal. Cek konfigurasi OAuth (client id, secret, dan redirect URI).'
        : 'Login gagal. Silakan coba lagi.';

    setError(message);
  }, [oauthError]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // User is already logged in, redirect to intended page
          window.location.href = redirectTo;
        }
      } catch (error) {
        // User is not logged in, stay on login page
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, [redirectTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: redirectTo,
      });

      if (!result || result.error) {
        throw new Error('Email atau password salah');
      }

      toast.success('Login berhasil');
      window.location.href = result.url || redirectTo;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await signIn('google', { callbackUrl: redirectTo });
    } catch (err) {
      const errorMessage = 'Gagal memulai login Google';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout title={layoutCopy.title} description={layoutCopy.description}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Ingat saya
            </label>
          </div>

          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">atau</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-700 shadow-sm transition-all duration-200"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isGoogleLoading ? 'Mengalihkan ke Google...' : 'Masuk dengan Google'}
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Daftar sekarang
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title={layoutCopy.title}
          description={layoutCopy.description}
        >
          <div className="text-center text-sm text-gray-500 py-8">
            Memuat formulir login...
          </div>
        </AuthLayout>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
