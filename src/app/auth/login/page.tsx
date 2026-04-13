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
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3.3 14.6 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.8-.1-1.2H12z"
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
