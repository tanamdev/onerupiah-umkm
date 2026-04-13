import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { price: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl border border-gray-100 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Subscription Packages</h1>
          <p className="text-gray-500 mt-1">Manage the available subscription tiers for users.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200">
          Add New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
           <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No packages found. Create a new package to get started.</p>
           </div>
        ) : (
          packages.map((pkg) => {
            const features = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features as any)
            const featureList = Array.isArray(features) ? features : []

            return (
              <Card key={pkg.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
                {!pkg.isActive && (
                   <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Inactive</div>
                )}
                <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <CardHeader>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
                  <div className="mt-4">
                     <span className="text-3xl font-bold text-gray-900">Rp {(pkg.price).toLocaleString('id-ID')}</span>
                     <span className="text-sm font-medium text-gray-500"> / {pkg.duration} days</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Limits:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Content: {pkg.maxContentGenerations || 'Unlimited'}</li>
                      <li>• Images: {pkg.maxImageGenerations || 'Unlimited'}</li>
                    </ul>
                    
                    {featureList.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {featureList.slice(0, 4).map((f: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5 text-xs">✓</span>
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                          {featureList.length > 4 && (
                            <li className="text-xs text-blue-600 italic">+{featureList.length - 4} more features</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-2 border-t border-gray-100">
                     <button className="flex-1 text-blue-600 bg-blue-50 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">Edit</button>
                     <button className="flex-1 text-gray-600 bg-gray-50 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        {pkg.isActive ? 'Deactivate' : 'Activate'}
                     </button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
