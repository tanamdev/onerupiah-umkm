import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Fixed Sidebar */}
      <AdminSidebar />
      
      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  )
}
