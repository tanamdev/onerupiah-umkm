import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      message:
        'Endpoint login custom dinonaktifkan. Gunakan NextAuth credentials signIn.',
    },
    { status: 410 },
  );
}
