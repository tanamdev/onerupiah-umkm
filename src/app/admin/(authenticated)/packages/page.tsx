'use client'

import { useState, useEffect, useCallback } from 'react'
import { Package, CheckCircle, XCircle, Pencil, Trash2, Plus, X, Loader2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

interface PackageData {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice: number | null
  currency: string
  features: string[]
  isActive: boolean
  maxContentGenerations: number | null
  maxImageGenerations: number | null
  duration: number
  totalSubscriptions: number
  totalCompletedTransactions: number
  createdAt: string
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  yearlyPrice: '',
  currency: 'IDR',
  duration: '30',
  maxContentGenerations: '',
  maxImageGenerations: '',
  features: ['']
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<PackageData | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PackageData | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/packages')
      const json = await res.json()
      if (json.success) setPackages(json.data)
    } catch {
      toast.error('Gagal memuat data paket')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPackages() }, [fetchPackages])

  // open create modal
  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  // open edit modal
  const openEdit = (pkg: PackageData) => {
    setEditTarget(pkg)
    const featureList = Array.isArray(pkg.features) ? pkg.features : []
    setForm({
      name: pkg.name,
      description: pkg.description,
      price: String(pkg.price),
      yearlyPrice: pkg.yearlyPrice ? String(pkg.yearlyPrice) : '',
      currency: pkg.currency,
      duration: String(pkg.duration),
      maxContentGenerations: pkg.maxContentGenerations ? String(pkg.maxContentGenerations) : '',
      maxImageGenerations: pkg.maxImageGenerations ? String(pkg.maxImageGenerations) : '',
      features: featureList.length > 0 ? featureList : ['']
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
    setForm(EMPTY_FORM)
  }

  // feature list helpers
  const setFeature = (idx: number, val: string) => {
    setForm(prev => {
      const features = [...prev.features]
      features[idx] = val
      return { ...prev, features }
    })
  }
  const addFeature = () => setForm(prev => ({ ...prev, features: [...prev.features, ''] }))
  const removeFeature = (idx: number) =>
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))

  // submit create / edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        yearlyPrice: form.yearlyPrice ? Number(form.yearlyPrice) : null,
        currency: form.currency,
        duration: Number(form.duration) || 30,
        maxContentGenerations: form.maxContentGenerations ? Number(form.maxContentGenerations) : null,
        maxImageGenerations: form.maxImageGenerations ? Number(form.maxImageGenerations) : null,
        features: form.features.filter(f => f.trim() !== '')
      }

      const url = editTarget
        ? `/api/admin/packages/${editTarget.id}`
        : '/api/admin/packages'
      const method = editTarget ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      toast.success(json.message || 'Berhasil disimpan')
      closeModal()
      fetchPackages()
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  // toggle active
  const handleToggle = async (pkg: PackageData) => {
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, { method: 'PATCH' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(json.message)
      fetchPackages()
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status')
    }
  }

  // delete
  const handleDelete = async () => {
    if (!deleteTarget) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/packages/${deleteTarget.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(json.message)
      setDeleteTarget(null)
      fetchPackages()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus paket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl border border-gray-100 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Paket Langganan</h1>
          <p className="text-gray-500 mt-1">Kelola paket langganan yang tersedia untuk pengguna.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket
        </button>
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Belum ada paket.</p>
              <p className="text-gray-400 text-sm mt-1">Klik "Tambah Paket" untuk membuat paket baru.</p>
            </div>
          ) : (
            packages.map((pkg) => {
              const featureList = Array.isArray(pkg.features) ? pkg.features : []
              return (
                <Card key={pkg.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
                  {/* Status bar */}
                  <div className={`h-1.5 w-full ${pkg.isActive ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gray-200'}`} />

                  {!pkg.isActive && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Nonaktif
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{pkg.description}</CardDescription>
                    <div className="mt-3 space-y-0.5">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {pkg.currency} {pkg.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/ {pkg.duration} hari</span>
                      </div>
                      {pkg.yearlyPrice && (
                        <div className="text-sm text-gray-500">
                          Tahunan: {pkg.currency} {pkg.yearlyPrice.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col pt-0">
                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-gray-500 mb-4">
                      <span>{pkg.totalSubscriptions} langganan</span>
                      <span>{pkg.totalCompletedTransactions} transaksi</span>
                    </div>

                    {/* Limits */}
                    <div className="mb-3 text-sm text-gray-600 space-y-1">
                      <div>Konten: <span className="font-medium text-gray-800">{pkg.maxContentGenerations ?? 'Unlimited'}</span></div>
                      <div>Gambar: <span className="font-medium text-gray-800">{pkg.maxImageGenerations ?? 'Unlimited'}</span></div>
                    </div>

                    {/* Features */}
                    {featureList.length > 0 && (
                      <ul className="text-sm text-gray-600 space-y-1 mb-4">
                        {featureList.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                        {featureList.length > 4 && (
                          <li className="text-xs text-blue-600 italic pl-5">+{featureList.length - 4} fitur lainnya</li>
                        )}
                      </ul>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-3 flex gap-2 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-blue-600 bg-blue-50 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(pkg)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                          ${pkg.isActive
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'}`}
                      >
                        {pkg.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(pkg)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus paket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editTarget ? 'Edit Paket' : 'Tambah Paket Baru'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="cth. Basic, Premium, Enterprise"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Deskripsi singkat tentang paket ini..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Harga */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Bulanan (IDR) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="50000"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tahunan (IDR)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.yearlyPrice}
                    onChange={e => setForm(p => ({ ...p, yearlyPrice: e.target.value }))}
                    placeholder="500000"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Durasi & Kuota */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (hari)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.duration}
                    onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Konten</label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxContentGenerations}
                    onChange={e => setForm(p => ({ ...p, maxContentGenerations: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Gambar</label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxImageGenerations}
                    onChange={e => setForm(p => ({ ...p, maxImageGenerations: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Fitur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitur Paket</label>
                <div className="space-y-2">
                  {form.features.map((f, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={f}
                        onChange={e => setFeature(idx, e.target.value)}
                        placeholder={`Fitur ${idx + 1}`}
                        className="flex-1 h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        disabled={form.features.length <= 1}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah fitur
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editTarget ? 'Simpan Perubahan' : 'Buat Paket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Hapus Paket?</h2>
              <p className="text-sm text-gray-500">
                Anda akan menghapus paket <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span>.
                {(deleteTarget.totalSubscriptions > 0 || deleteTarget.totalCompletedTransactions > 0) && (
                  <span className="block mt-1 text-amber-600 font-medium">
                    Paket ini masih memiliki data terkait dan akan dinonaktifkan, bukan dihapus.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
