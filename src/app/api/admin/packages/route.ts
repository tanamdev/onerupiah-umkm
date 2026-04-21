import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '@/services/billingService';
import { prisma } from '@/lib/prisma';

// GET /api/admin/packages - semua paket (termasuk non-aktif) dengan stats
export async function GET(request: NextRequest) {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: {
            subscriptions: true,
            transactions: { where: { status: 'COMPLETED' } },
          },
        },
      },
    });

    const data = packages.map((pkg) => ({
      ...pkg,
      totalSubscriptions: pkg._count.subscriptions,
      totalCompletedTransactions: pkg._count.transactions,
      _count: undefined,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error fetching admin packages:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data paket' },
      { status: 500 },
    );
  }
}

// POST /api/admin/packages - buat paket baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      yearlyPrice,
      currency = 'IDR',
      features,
      maxContentGenerations,
      maxImageGenerations,
      imagesPerGeneration,
      duration = 30,
    } = body;

    if (!name || !description || price === undefined || price === null) {
      return NextResponse.json(
        { success: false, error: 'Field wajib: name, description, price' },
        { status: 400 },
      );
    }

    const newPackage = await BillingService.createPackage({
      name,
      description,
      price: Number(price),
      yearlyPrice: yearlyPrice ? Number(yearlyPrice) : undefined,
      currency,
      features: features || [],
      maxContentGenerations: maxContentGenerations
        ? Number(maxContentGenerations)
        : undefined,
      maxImageGenerations: maxImageGenerations
        ? Number(maxImageGenerations)
        : undefined,
      imagesPerGeneration: imagesPerGeneration
        ? Number(imagesPerGeneration)
        : undefined,
      duration: Number(duration) || 30,
    });

    return NextResponse.json(
      { success: true, data: newPackage, message: 'Paket berhasil dibuat' },
      { status: 201 },
    );
  } catch (error) {
    console.error('❌ Error creating package:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat paket' },
      { status: 500 },
    );
  }
}
