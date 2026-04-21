'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const PROVIDERS = [
  {
    value: 'google',
    label: 'Google Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
  {
    value: 'outlook',
    label: 'Outlook / Hotmail',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
  },
  {
    value: 'yahoo',
    label: 'Yahoo Mail',
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
  },
  { value: 'custom', label: 'Custom SMTP', host: '', port: 587, secure: false },
] as const;

type Provider = (typeof PROVIDERS)[number]['value'];

interface SmtpForm {
  provider: Provider;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

const DEFAULT_FORM: SmtpForm = {
  provider: 'google',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: '',
  pass: '',
  fromName: 'Asisten UMKM',
  fromEmail: '',
};

export default function SettingsPage() {
  const [form, setForm] = useState<SmtpForm>(DEFAULT_FORM);
  const [testEmail, setTestEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [testAlert, setTestAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/admin/settings/smtp');
      const json = await res.json();
      if (json.success && json.data) {
        setForm((prev) => ({ ...prev, ...json.data }));
      }
    } catch {
      // ignore
    } finally {
      setFetchLoading(false);
    }
  }

  function handleProviderChange(value: Provider) {
    const preset = PROVIDERS.find((p) => p.value === value)!;
    setForm((prev) => ({
      ...prev,
      provider: value,
      host: preset.host,
      port: preset.port,
      secure: preset.secure,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch('/api/admin/settings/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, port: Number(form.port) }),
      });
      const json = await res.json();
      setAlert({
        type: json.success ? 'success' : 'error',
        message: json.message ?? json.error,
      });
    } catch {
      setAlert({ type: 'error', message: 'Gagal menyimpan konfigurasi' });
    } finally {
      setLoading(false);
    }
  }

  async function handleTest() {
    if (!testEmail) {
      setTestAlert({
        type: 'error',
        message: 'Masukkan email tujuan untuk test',
      });
      return;
    }
    setTestLoading(true);
    setTestAlert(null);
    try {
      const res = await fetch('/api/admin/settings/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          port: Number(form.port),
          toEmail: testEmail,
        }),
      });
      const json = await res.json();
      setTestAlert({
        type: json.success ? 'success' : 'error',
        message: json.message ?? json.error,
      });
    } catch {
      setTestAlert({ type: 'error', message: 'Gagal mengirim test email' });
    } finally {
      setTestLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-950" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="plus-jakarta-sans text-2xl font-extrabold text-blue-950 tracking-tight">
          Pengaturan
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Konfigurasi SMTP untuk pengiriman email
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-5">
          Konfigurasi SMTP
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Provider */}
          <div className="space-y-1.5">
            <Label className="block text-sm font-medium text-blue-950">
              Provider Email
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handleProviderChange(p.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold text-left border transition-all ${
                    form.provider === p.value
                      ? 'bg-blue-950/5 border-blue-950 text-blue-950'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Host + Port */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="block text-sm font-medium text-blue-950">
                SMTP Host
              </Label>
              <Input
                value={form.host}
                onChange={(e) =>
                  setForm((f) => ({ ...f, host: e.target.value }))
                }
                placeholder="smtp.gmail.com"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="block text-sm font-medium text-blue-950">
                Port
              </Label>
              <Input
                type="number"
                value={form.port}
                onChange={(e) =>
                  setForm((f) => ({ ...f, port: Number(e.target.value) }))
                }
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20"
                required
              />
            </div>
          </div>

          {/* Secure toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, secure: !f.secure }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                form.secure ? 'bg-blue-950' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  form.secure ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-on-surface-variant font-medium">
              SSL/TLS (secure)
            </span>
          </div>

          {/* User + Pass */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="block text-sm font-medium text-blue-950">
                Username / Email
              </Label>
              <Input
                value={form.user}
                onChange={(e) =>
                  setForm((f) => ({ ...f, user: e.target.value }))
                }
                placeholder="user@gmail.com"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="block text-sm font-medium text-blue-950">
                Password / App Password
              </Label>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  value={form.pass}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pass: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* From Name + From Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="block text-sm font-medium text-blue-950">
                Nama Pengirim
              </Label>
              <Input
                value={form.fromName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fromName: e.target.value }))
                }
                placeholder="Asisten UMKM"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="block text-sm font-medium text-blue-950">
                Email Pengirim
              </Label>
              <Input
                type="email"
                value={form.fromEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fromEmail: e.target.value }))
                }
                placeholder="noreply@asistenumkm.id"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {alert && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                alert.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {alert.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0" />
              )}
              {alert.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-3 font-bold transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Simpan Konfigurasi
          </Button>
        </form>
      </div>

      {/* Test Connection */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-1">Test Koneksi</h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Kirim email percobaan untuk verifikasi konfigurasi SMTP di atas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-gray-400 flex-1"
          />
          <Button
            type="button"
            onClick={handleTest}
            disabled={testLoading}
            variant="outline"
            className="border-outline-variant text-blue-950 hover:bg-surface-container rounded-xl px-5 font-semibold shrink-0 w-full sm:w-auto"
          >
            {testLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Kirim Test
          </Button>
        </div>
        {testAlert && (
          <div
            className={`flex items-center gap-2 p-3 mt-4 rounded-xl text-sm font-medium ${
              testAlert.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {testAlert.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0" />
            )}
            {testAlert.message}
          </div>
        )}
      </div>
    </div>
  );
}
