import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth.config"

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions)
  const userName = session?.user?.name || 'User'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <p>Welcome to your customer dashboard {userName}. Start building your features here.</p>
    </div>
  )
}