'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get redirect parameter from URL
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

  // Make sure not to redirect standard users back to admin login if they shouldn't be here
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (
            data.user &&
            (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN')
          ) {
            window.location.href = redirectTo;
          }
        }
      } catch (error) {
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

      const meResponse = await fetch('/api/auth/me');
      const meData = await meResponse.json();

      if (
        !meResponse.ok ||
        !meData?.user ||
        (meData.user.role !== 'ADMIN' && meData.user.role !== 'SUPER_ADMIN')
      ) {
        await fetch('/api/auth/logout', { method: 'POST' });
        throw new Error('Akses ditolak. Anda bukan Admin.');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-blue-100 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-indigo-100 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[50%] rounded-full bg-purple-100 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10">
          <div className="mb-8 text-center space-y-2">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-700 bg-blue-100 rounded-full">
              Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to access the control panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/80 backdrop-blur border border-red-100 rounded-xl p-4 animate-in fade-in zoom-in duration-300">
                <p className="text-sm font-medium text-red-600 text-center">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@onerupiah.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 bg-white/50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 bg-white/50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            &larr; Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="animate-pulse bg-white/50 rounded-3xl w-full max-w-md h-96"></div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
