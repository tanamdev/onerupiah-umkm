import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userName="John Doe"
        userEmail="john.doe@example.com"
        userPlan="premium"
      />
      <main className="pt-16 md:pt-16">
        {/* Spacer for mobile navigation */}
        <div className="md:hidden h-14"></div>
        {children}
      </main>
    </div>
  )
}