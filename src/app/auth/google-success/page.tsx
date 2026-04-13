'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/layout/auth-layout';

function sanitizeRedirect(value: string | null): string {
  if (!value || !value.startsWith('/')) {
    return '/dashboard';
  }

  if (value.startsWith('//')) {
    return '/dashboard';
  }

  return value;
}

function GoogleSuccessContent() {
  const searchParams = useSearchParams();
  const redirectTo = useMemo(
    () => sanitizeRedirect(searchParams.get('redirect')),
    [searchParams],
  );
  const [error] = useState('');

  useEffect(() => {
    window.location.href = redirectTo;
  }, [redirectTo]);

  return (
    <AuthLayout
      title="Menyelesaikan login Google"
      description="Kami sedang menghubungkan akun Google Anda ke sesi aplikasi"
    >
      <div className="space-y-3 text-center">
        {error ? (
          <>
            <p className="text-sm text-red-600">{error}</p>
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Kembali ke halaman login
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Mohon tunggu, Anda akan diarahkan otomatis...
          </p>
        )}
      </div>
    </AuthLayout>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title="Menyelesaikan login Google"
          description="Kami sedang menghubungkan akun Google Anda ke sesi aplikasi"
        >
          <p className="text-sm text-gray-600 text-center">
            Mohon tunggu, Anda akan diarahkan otomatis...
          </p>
        </AuthLayout>
      }
    >
      <GoogleSuccessContent />
    </Suspense>
  );
}
