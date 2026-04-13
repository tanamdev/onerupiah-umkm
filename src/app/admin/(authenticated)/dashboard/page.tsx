import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, Activity, Package } from 'lucide-react'

// Server Component
export default async function AdminDashboardPage() {
  // Fetch stats from Prisma
  const [totalUsers, activeSubscriptions, totalTransactions, contentGenerations] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.transaction.count({ where: { status: 'COMPLETED' } }),
    prisma.contentGeneration.count()
  ])

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  // Get recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      package: { select: { name: true } }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome to the One Rupiah UMKM Admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur border-none shadow-sm shadow-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <div className="p-2 bg-blue-50 rounded-xl">
               <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalUsers}</div>
            <p className="text-xs text-green-600 font-medium mt-1">+10% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur border-none shadow-sm shadow-indigo-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Subs</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-xl">
               <Package className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{activeSubscriptions}</div>
            <p className="text-xs text-gray-500 mt-1">Currently subscribed users</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur border-none shadow-sm shadow-emerald-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-xl">
               <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalTransactions}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Successful payments</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur border-none shadow-sm shadow-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Generations</CardTitle>
            <div className="p-2 bg-purple-50 rounded-xl">
               <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{contentGenerations}</div>
            <p className="text-xs text-gray-500 mt-1">Total content generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         {/* Recent Users */}
         <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg">Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-5">
                 {recentUsers.length === 0 ? (
                   <p className="text-sm text-gray-500 text-center py-4">No users found.</p>
                 ) : recentUsers.map(u => (
                   <div key={u.id} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                         {u.name.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-900">{u.name}</p>
                         <p className="text-xs text-gray-500">{u.email}</p>
                       </div>
                     </div>
                     <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
         </Card>

         {/* Recent Transactions */}
         <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-5">
                 {recentTransactions.length === 0 ? (
                   <p className="text-sm text-gray-500 text-center py-4">No transactions found.</p>
                 ) : recentTransactions.map(t => (
                   <div key={t.id} className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-gray-900">{t.user.name}</p>
                       <p className="text-xs text-gray-500">{t.package.name} • Rp {(t.amount).toLocaleString('id-ID')}</p>
                     </div>
                     <div className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">
                        {t.status}
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
