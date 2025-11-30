import { DashboardHeader } from '@/components/layout/dashboard-header'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { UserProvider } from '@/contexts/UserContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader />
          <main className="pt-16 md:pt-16">
            {/* Spacer for mobile navigation */}
            <div className="md:hidden h-14"></div>
            {children}
          </main>
        </div>
      </SubscriptionProvider>
    </UserProvider>
  )
}