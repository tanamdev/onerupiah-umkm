import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      package: { select: { name: true, duration: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Transaction History</h1>
        <p className="text-gray-500 mt-1">View user payments and subscriptions.</p>
      </div>

      <Card className="border-gray-100 shadow-sm bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A comprehensive list of transaction records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Package</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.id.substring(0, 12)}...</td>
                        <td className="px-6 py-4">
                           <div className="font-medium text-gray-900">{tx.user.name}</div>
                           <div className="text-gray-500 text-xs">{tx.user.email}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{tx.package.name}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {tx.currency} {(tx.amount).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold
                              ${tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 
                                tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 
                                'bg-red-50 text-red-700'}`}
                           >
                              {tx.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
