import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/next-auth'
import { checkUserQuota } from '@/lib/usageQuota'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const quota = await checkUserQuota(session.user.id)

    return NextResponse.json({ quota })
  } catch (error) {
    console.error('Get quota error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
