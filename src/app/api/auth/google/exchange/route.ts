import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      message:
        'Endpoint exchange dinonaktifkan. Gunakan sesi NextAuth langsung.',
    },
    { status: 410 },
  );
}
