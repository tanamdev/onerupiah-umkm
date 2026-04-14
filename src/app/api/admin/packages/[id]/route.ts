import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/packages/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subscriptions: true,
            transactions: { where: { status: 'COMPLETED' } }
          }
        }
      }
    })

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Paket tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: pkg })
  } catch (error) {
    console.error('❌ Error fetching package:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data paket' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/packages/[id] - update paket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.package.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Paket tidak ditemukan' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      yearlyPrice,
      currency,
      features,
      maxContentGenerations,
      maxImageGenerations,
      duration,
      isActive
    } = body

    const updated = await prisma.package.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(yearlyPrice !== undefined && { yearlyPrice: yearlyPrice ? Number(yearlyPrice) : null }),
        ...(currency !== undefined && { currency }),
        ...(features !== undefined && { features }),
        ...(maxContentGenerations !== undefined && {
          maxContentGenerations: maxContentGenerations ? Number(maxContentGenerations) : null
        }),
        ...(maxImageGenerations !== undefined && {
          maxImageGenerations: maxImageGenerations ? Number(maxImageGenerations) : null
        }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({ success: true, data: updated, message: 'Paket berhasil diperbarui' })
  } catch (error) {
    console.error('❌ Error updating package:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui paket' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/packages/[id] - toggle isActive
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.package.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Paket tidak ditemukan' },
        { status: 404 }
      )
    }

    const updated = await prisma.package.update({
      where: { id },
      data: { isActive: !existing.isActive }
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Paket berhasil ${updated.isActive ? 'diaktifkan' : 'dinonaktifkan'}`
    })
  } catch (error) {
    console.error('❌ Error toggling package:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengubah status paket' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/packages/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.package.findUnique({
      where: { id },
      include: { _count: { select: { subscriptions: true, transactions: true } } }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Paket tidak ditemukan' },
        { status: 404 }
      )
    }

    // Jika masih ada subscription atau transaksi, nonaktifkan saja
    if (existing._count.subscriptions > 0 || existing._count.transactions > 0) {
      const deactivated = await prisma.package.update({
        where: { id },
        data: { isActive: false }
      })
      return NextResponse.json({
        success: true,
        data: deactivated,
        message: 'Paket dinonaktifkan karena masih terkait dengan subscription/transaksi aktif'
      })
    }

    await prisma.package.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Paket berhasil dihapus' })
  } catch (error) {
    console.error('❌ Error deleting package:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus paket' },
      { status: 500 }
    )
  }
}
